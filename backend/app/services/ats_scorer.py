from typing import Dict, List, Any, Optional
import re
import math

class ATSScorer:
    def __init__(self):
        self.keyword_weights = {
            "skills": 30,
            "experience": 25,
            "education": 15,
            "certifications": 10,
            "projects": 10,
            "formatting": 10
        }
        
        self.skill_keywords = {
            'programming': ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust'],
            'web': ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring'],
            'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
            'data': ['machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'pandas', 'numpy'],
            'soft': ['leadership', 'communication', 'project management', 'agile', 'scrum', 'team management']
        }
        
        self.action_verbs = {
            'strong': ['spearheaded', 'orchestrated', 'pioneered', 'revolutionized', 'transformed', 
                      'optimized', 'engineered', 'architected', 'strategized', 'maximized'],
            'good': ['led', 'managed', 'developed', 'designed', 'implemented', 'created', 'built',
                    'improved', 'increased', 'reduced', 'achieved', 'delivered'],
            'weak': ['assisted', 'helped', 'worked', 'made', 'did', 'used', 'utilized', 'performed']
        }

    def calculate_score(self, parsed_data: Dict, job_keywords: List[str] = None) -> Dict:
        """
        Calculate comprehensive ATS score with detailed breakdown
        """
        if not parsed_data or not parsed_data.get('full_text'):
            return self._get_default_score()
        
        # Calculate individual scores
        formatting_score = self._score_formatting(parsed_data)
        contact_score = self._score_contact_details(parsed_data)
        skills_score = self._score_skills(parsed_data, job_keywords)
        action_verbs_score = self._score_action_verbs(parsed_data)
        experience_score = self._score_experience(parsed_data)
        education_score = self._score_education(parsed_data)
        projects_score = self._score_projects(parsed_data)
        certifications_score = self._score_certifications(parsed_data)
        
        # Calculate weighted total
        total_score = (
            (formatting_score * 0.15) +
            (contact_score * 0.10) +
            (skills_score * 0.25) +
            (action_verbs_score * 0.15) +
            (experience_score * 0.15) +
            (education_score * 0.10) +
            (projects_score * 0.05) +
            (certifications_score * 0.05)
        )
        
        total_score = min(100, max(0, total_score))
        
        # Generate recommendations
        recommendations = self._generate_recommendations({
            "formatting": formatting_score,
            "contact": contact_score,
            "skills": skills_score,
            "action_verbs": action_verbs_score,
            "experience": experience_score,
            "education": education_score,
            "projects": projects_score,
            "certifications": certifications_score
        }, parsed_data)
        
        return {
            "total_score": round(total_score, 1),
            "breakdown": {
                "formatting": round(formatting_score, 1),
                "contact_details": round(contact_score, 1),
                "core_skills_depth": round(skills_score, 1),
                "action_verbs_impact": round(action_verbs_score, 1),
                "experience_depth": round(experience_score, 1),
                "education": round(education_score, 1),
                "projects": round(projects_score, 1),
                "certifications": round(certifications_score, 1)
            },
            "recommendations": recommendations,
            "word_count": parsed_data.get('word_count', 0),
            "skills_found": parsed_data.get('skills', []),
            "experience_count": len(parsed_data.get('experience', []))
        }

    def _get_default_score(self) -> Dict:
        """Return default score when no data available"""
        return {
            "total_score": 0,
            "breakdown": {
                "formatting": 0,
                "contact_details": 0,
                "core_skills_depth": 0,
                "action_verbs_impact": 0,
                "experience_depth": 0,
                "education": 0,
                "projects": 0,
                "certifications": 0
            },
            "recommendations": ["No resume data available for scoring"],
            "word_count": 0,
            "skills_found": [],
            "experience_count": 0
        }

    def _score_formatting(self, parsed_data: Dict) -> float:
        """Score resume formatting and structure"""
        score = 0
        text = parsed_data.get('full_text', '')
        word_count = parsed_data.get('word_count', 0)
        
        # Check word count (ideal: 400-1000 words)
        if 400 <= word_count <= 1000:
            score += 10
        elif 200 <= word_count < 400:
            score += 7
        elif 1000 < word_count <= 1500:
            score += 5
        elif word_count > 0:
            score += 3
        
        # Check for section headers
        sections = parsed_data.get('sections', {})
        section_count = sum(1 for v in sections.values() if v)
        if section_count >= 5:
            score += 8
        elif section_count >= 3:
            score += 5
        elif section_count >= 1:
            score += 2
        
        # Check for bullet points
        bullet_count = len(re.findall(r'[•●○■◆▶➢·-]\s', text))
        if bullet_count >= 20:
            score += 7
        elif bullet_count >= 10:
            score += 4
        elif bullet_count >= 5:
            score += 2
        
        # Normalize to 25
        return min(25, score)

    def _score_contact_details(self, parsed_data: Dict) -> float:
        """Score contact information"""
        score = 0
        
        # Name
        if parsed_data.get('name') and parsed_data['name'] != "Unknown Candidate":
            score += 5
        
        # Email
        if parsed_data.get('email'):
            score += 5
        
        # Phone
        if parsed_data.get('phone'):
            score += 5
        
        # Check for LinkedIn or other contact
        text = parsed_data.get('full_text', '').lower()
        if 'linkedin' in text:
            score += 3
        if 'github' in text or 'gitlab' in text:
            score += 2
        
        return min(15, score)

    def _score_skills(self, parsed_data: Dict, job_keywords: List[str] = None) -> float:
        """Score skills section"""
        skills = parsed_data.get('skills', [])
        if not skills:
            return 0
        
        score = 0
        skills_text = ' '.join(skills).lower()
        
        # Check for skill categories
        categories_found = 0
        for category, keywords in self.skill_keywords.items():
            if any(kw in skills_text for kw in keywords):
                categories_found += 1
        
        # Score based on number of categories
        if categories_found >= 5:
            score += 15
        elif categories_found >= 3:
            score += 10
        elif categories_found >= 1:
            score += 5
        
        # Check number of skills
        skill_count = len(skills)
        if skill_count >= 15:
            score += 10
        elif skill_count >= 10:
            score += 7
        elif skill_count >= 5:
            score += 4
        
        # Job-specific keyword matching
        if job_keywords:
            matched = sum(1 for kw in job_keywords if kw.lower() in skills_text)
            match_rate = matched / len(job_keywords) if job_keywords else 0
            score += (match_rate * 5)  # Up to 5 points
        
        return min(30, score)

    def _score_action_verbs(self, parsed_data: Dict) -> float:
        """Score action verbs and impact metrics"""
        text = parsed_data.get('full_text', '')
        score = 0
        
        # Count strong action verbs
        strong_count = 0
        for verb in self.action_verbs['strong']:
            strong_count += len(re.findall(r'\b' + verb + r'\b', text, re.IGNORECASE))
        score += min(strong_count * 3, 15)
        
        # Count good action verbs
        good_count = 0
        for verb in self.action_verbs['good']:
            good_count += len(re.findall(r'\b' + verb + r'\b', text, re.IGNORECASE))
        score += min(good_count * 1.5, 10)
        
        # Check for metrics and numbers
        number_pattern = r'\b\d+%|\b\d+\s*(?:percent|%)|\b\d+\s*(?:dollars|\$)|increased|decreased|reduced|improved|boosted'
        metric_count = len(re.findall(number_pattern, text, re.IGNORECASE))
        score += min(metric_count * 2, 5)
        
        return min(30, score)

    def _score_experience(self, parsed_data: Dict) -> float:
        """Score work experience"""
        experience = parsed_data.get('experience', [])
        if not experience:
            return 0
        
        score = 0
        
        # Experience count
        if len(experience) >= 4:
            score += 10
        elif len(experience) >= 2:
            score += 7
        elif len(experience) >= 1:
            score += 4
        
        # Check for detailed descriptions
        for exp in experience:
            desc = exp.get('description', '')
            if desc and len(desc) > 50:
                score += 2
            if desc and len(desc) > 100:
                score += 2
            
            # Check for metrics in experience
            if re.search(r'\b\d+%|\b\d+\s*(?:percent|%)', desc):
                score += 2
        
        return min(20, score)

    def _score_education(self, parsed_data: Dict) -> float:
        """Score education section"""
        education = parsed_data.get('education', [])
        if not education:
            return 0
        
        score = 5  # Base score for having education
        
        # Check for advanced degrees
        advanced_degrees = ['master', 'phd', 'doctorate', 'mba', 'm.sc', 'm.s']
        for edu in education:
            edu_text = str(edu).lower()
            if any(degree in edu_text for degree in advanced_degrees):
                score += 5
                break
        
        # Check for institution
        for edu in education:
            if edu.get('institution'):
                score += 3
                break
        
        return min(15, score)

    def _score_projects(self, parsed_data: Dict) -> float:
        """Score projects section"""
        projects = parsed_data.get('projects', [])
        if not projects:
            return 0
        
        score = 0
        
        # Project count
        if len(projects) >= 3:
            score += 5
        elif len(projects) >= 1:
            score += 3
        
        # Check for technologies in projects
        for project in projects:
            tech = project.get('technologies', [])
            if tech:
                score += 2
        
        # Check for detailed descriptions
        for project in projects:
            desc = project.get('description', '')
            if desc and len(desc) > 50:
                score += 2
        
        return min(10, score)

    def _score_certifications(self, parsed_data: Dict) -> float:
        """Score certifications"""
        certifications = parsed_data.get('certifications', [])
        if not certifications:
            return 0
        
        score = len(certifications) * 2  # 2 points per certification
        
        # Check for high-value certifications
        high_value = ['aws', 'azure', 'google cloud', 'cisco', 'ccna', 'ccnp', 'pmp', 'scrum master']
        for cert in certifications:
            cert_text = cert.lower()
            if any(hv in cert_text for hv in high_value):
                score += 2
        
        return min(10, score)

    def _generate_recommendations(self, scores: Dict, parsed_data: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Formatting recommendations
        if scores.get('formatting', 0) < 15:
            word_count = parsed_data.get('word_count', 0)
            if word_count < 400:
                recommendations.append(f"Your resume is around {word_count} words. The ideal length is between 400 and 1000 words. Add more details about your experience and achievements.")
            elif word_count > 1000:
                recommendations.append(f"Your resume is around {word_count} words. Consider condensing it to 400-1000 words for better readability.")
            
            if not parsed_data.get('sections'):
                recommendations.append("Add clear section headers (e.g., Experience, Education, Skills) to improve structure.")
        
        # Skills recommendations
        if scores.get('skills', 0) < 20:
            skills = parsed_data.get('skills', [])
            if len(skills) < 10:
                recommendations.append(f"Good skills section, but consider listing more core competencies and tools relevant to your target jobs. Currently found {len(skills)} skills.")
            else:
                recommendations.append("Consider adding more specialized skills relevant to your target role.")
        
        # Action verbs recommendations
        if scores.get('action_verbs', 0) < 15:
            recommendations.append("Use strong action verbs (e.g., 'Spearheaded', 'Optimized', 'Designed') instead of passive verbs like 'Developed' or 'Implemented'.")
        
        # Experience recommendations
        if scores.get('experience', 0) < 10:
            recommendations.append("Add more detail to your experience descriptions. Include specific achievements and metrics (e.g., 'Increased sales by 20%').")
        
        # Education recommendations
        if scores.get('education', 0) < 8:
            recommendations.append("Add more details to your education section, including relevant coursework or achievements.")
        
        # Projects recommendations
        if scores.get('projects', 0) < 5:
            recommendations.append("Include more personal or academic projects with clear descriptions and technologies used.")
        
        # Certifications recommendations
        if scores.get('certifications', 0) < 5:
            recommendations.append("Consider adding relevant certifications to strengthen your profile.")
        
        # Contact recommendations
        if scores.get('contact', 0) < 10:
            recommendations.append("Ensure all contact information is complete and clearly visible (name, email, phone).")
        
        return recommendations if recommendations else ["Your resume looks well-structured. Consider adding more metrics and achievements to stand out."]