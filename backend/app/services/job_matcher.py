from typing import Dict, Any, List
import re

class JobMatcher:
    @staticmethod
    def match_resume(resume_text: str, resume_skills: List[str], job_description: str) -> Dict[str, Any]:
        """
        Matches a resume text and skill list against a target job description.
        Returns match percentage, matching skills, missing skills, and gap analysis.
        """
        if not job_description or len(job_description.strip()) == 0:
            return {
                "match_score": 0,
                "matching_skills": [],
                "missing_skills": [],
                "gap_analysis": ["Please provide a job description to perform matching."]
            }

        # List of keywords to check for
        tech_keywords = [
            "python", "javascript", "react", "typescript", "node.js", "node", "express", "fastapi", "django",
            "flask", "mongodb", "postgresql", "mysql", "sqlite", "docker", "kubernetes", "aws", "gcp", "azure",
            "git", "html", "css", "tailwind", "bootstrap", "graphql", "rest api", "redux", "next.js", "vue",
            "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
            "java", "c++", "c#", "go", "golang", "rust", "ruby", "rails", "php", "laravel", "devops", "ci/cd",
            "agile", "scrum", "project management", "system design", "microservices", "testing", "jest", "pytest"
        ]

        # Extract keywords from job description
        job_skills = []
        for kw in tech_keywords:
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, job_description, re.IGNORECASE):
                # Standardize casing to match resume_skills
                job_skills.append(kw.title() if len(kw) > 3 else kw.upper())

        # If no specific tech keywords found in JD, generate some base keywords from text
        if not job_skills:
            job_skills = ["Communication", "Problem Solving", "Teamwork", "Agile"]

        # Case-insensitive matching
        resume_skills_lower = [s.lower() for s in resume_skills]
        
        matching_skills = []
        missing_skills = []
        
        for skill in job_skills:
            if skill.lower() in resume_skills_lower or re.search(r'\b' + re.escape(skill) + r'\b', resume_text, re.IGNORECASE):
                matching_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Calculate matching score
        total_skills_count = len(job_skills)
        if total_skills_count > 0:
            match_score = (len(matching_skills) / total_skills_count) * 100
        else:
            match_score = 50

        # Bound match score between 10% and 98% (realistic range)
        match_score = min(98, max(15, round(match_score)))

        # Formulate gap analysis
        gap_analysis = []
        if missing_skills:
            gap_analysis.append(f"Consider adding the following critical keywords to your resume: {', '.join(missing_skills[:5])}.")
        else:
            gap_analysis.append("Excellent! Your resume covers all key terms mentioned in the job description.")

        if match_score < 70:
            gap_analysis.append("Your score is below 70%. We recommend tailored adjustments to align with the core requirements of this role.")
        else:
            gap_analysis.append("Great alignment! Your resume has a strong likelihood of passing the initial automated screens.")

        return {
            "match_score": match_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "gap_analysis": gap_analysis,
            "total_job_skills": job_skills
        }
