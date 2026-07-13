from typing import Dict, Any, List
import re

class ATSScorer:
    @staticmethod
    def calculate_score(text: str, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates an ATS score (0-100) and returns structural feedback.
        """
        score_breakdown = {
            "formatting": 0,
            "contact_info": 0,
            "skills": 0,
            "metrics": 0
        }
        suggestions = []

        # 1. Contact Information Scoring (Max 15)
        contact_points = 0
        if parsed_data.get("email"):
            contact_points += 7.5
        else:
            suggestions.append("Missing email address. Make sure your email is clearly visible at the top of your resume.")

        if parsed_data.get("phone"):
            contact_points += 7.5
        else:
            suggestions.append("Missing phone number. Ensure employers have a direct line to contact you.")
        score_breakdown["contact_info"] = round(contact_points)

        # 2. Formatting & Structure Scoring (Max 25)
        formatting_points = 0
        word_count = len(text.split())
        
        # Word count checks
        if 400 <= word_count <= 1000:
            formatting_points += 10
        elif word_count > 0:
            formatting_points += 5
            suggestions.append(f"Your resume is around {word_count} words. The ideal length is between 400 and 1000 words.")
        
        # Section checks
        sections = parsed_data.get("sections", {})
        has_exp = len(sections.get("experience", "")) > 10
        has_edu = len(sections.get("education", "")) > 10
        
        if has_exp:
            formatting_points += 7.5
        else:
            suggestions.append("Missing a clear 'Experience' or 'Employment History' section header.")

        if has_edu:
            formatting_points += 7.5
        else:
            suggestions.append("Missing a clear 'Education' section header.")
        score_breakdown["formatting"] = round(formatting_points)

        # 3. Skills Scoring (Max 30)
        skills = parsed_data.get("skills", [])
        skills_count = len(skills)
        if skills_count >= 10:
            skills_points = 30
        elif skills_count >= 5:
            skills_points = 20
            suggestions.append("Good skills section, but consider listing more core competencies and tools relevant to your target jobs.")
        elif skills_count > 0:
            skills_points = 10
            suggestions.append("List more specific technical and soft skills. ATS filters heavily scan these keywords.")
        else:
            skills_points = 0
            suggestions.append("No technical or professional skills recognized. Add a dedicated 'Skills' section to rank for keywords.")
        score_breakdown["skills"] = skills_points

        # 4. Action Verbs & Metrics/Quantifiable Results (Max 30)
        # Action verbs
        action_verbs = ["led", "managed", "designed", "developed", "built", "implemented", "optimized", "increased", "reduced", "delivered", "created", "spearheaded", "directed"]
        verb_count = sum(1 for verb in action_verbs if re.search(r'\b' + verb + r'\b', text, re.IGNORECASE))
        
        verb_points = min(15, verb_count * 3)
        if verb_count < 3:
            suggestions.append("Use strong action verbs (e.g., 'Spearheaded', 'Optimized', 'Designed') instead of passive verbs like 'responsible for' or 'helped'.")

        # Quantifiable metrics (numbers, percentages, dollar values)
        # Regex to match percentages (e.g. 20%, 5x, $10k, 50,000)
        metrics_matches = re.findall(r'(\b\d+%\b|\b\d+x\b|\$\d+|\b\d+\s+percent\b)', text)
        metrics_count = len(metrics_matches)
        
        metrics_points = min(15, metrics_count * 5)
        if metrics_count < 2:
            suggestions.append("Include quantifiable achievements. Support your experience bullet points with numbers, percentages, and dollars (e.g., 'increased sales by 15%', 'saved 10 hours weekly').")
        
        score_breakdown["metrics"] = round(verb_points + metrics_points)

        # Total ATS Score
        total_score = sum(score_breakdown.values())

        return {
            "ats_score": min(100, max(0, total_score)),
            "score_breakdown": score_breakdown,
            "suggestions": suggestions,
            "skills_found": skills,
            "word_count": word_count
        }
