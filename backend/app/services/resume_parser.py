import re
from typing import Dict, Any, List

class ResumeParser:
    @staticmethod
    def parse_text(text: str) -> Dict[str, Any]:
        """
        Parses resume text into structured components using regex and keyword search.
        """
        parsed_data = {
            "name": "Unknown Candidate",
            "email": "",
            "phone": "",
            "skills": [],
            "experience": [],
            "education": [],
            "sections": {}
        }
        
        if not text or len(text.strip()) == 0:
            return parsed_data

        # 1. Extract Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            parsed_data["email"] = email_match.group(0)

        # 2. Extract Phone Number
        phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        if phone_match:
            parsed_data["phone"] = phone_match.group(0)

        # 3. Extract Name (often the first line or two)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            # Let's take the first line as name unless it contains common headers
            name_candidate = lines[0]
            if not any(keyword in name_candidate.lower() for keyword in ["resume", "cv", "curriculum", "email", "phone"]):
                parsed_data["name"] = name_candidate

        # 4. Extract Skills
        # Common skill keywords
        skill_db = [
            "python", "javascript", "react", "typescript", "node.js", "node", "express", "fastapi", "django",
            "flask", "mongodb", "postgresql", "mysql", "sqlite", "docker", "kubernetes", "aws", "gcp", "azure",
            "git", "html", "css", "tailwind", "bootstrap", "graphql", "rest api", "redux", "next.js", "vue",
            "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
            "java", "c++", "c#", "go", "golang", "rust", "ruby", "rails", "php", "laravel", "devops", "ci/cd"
        ]
        
        found_skills = []
        for skill in skill_db:
            # Match whole words or boundary sensitive
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                # Format skills nicely
                found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
        parsed_data["skills"] = list(set(found_skills))

        # 5. Extract Sections (Simple keyword segmentation)
        sections = {
            "summary": [],
            "experience": [],
            "education": [],
            "projects": []
        }
        current_section = "summary"
        
        experience_headers = ["experience", "employment history", "work history", "professional experience", "work experience"]
        education_headers = ["education", "academic details", "academic history", "degrees"]
        project_headers = ["projects", "personal projects", "academic projects", "key projects"]
        
        for line in lines:
            line_lower = line.lower()
            if any(header in line_lower for header in experience_headers) and len(line) < 30:
                current_section = "experience"
                continue
            elif any(header in line_lower for header in education_headers) and len(line) < 30:
                current_section = "education"
                continue
            elif any(header in line_lower for header in project_headers) and len(line) < 30:
                current_section = "projects"
                continue
            
            sections[current_section].append(line)

        parsed_data["sections"] = {
            "summary": "\n".join(sections["summary"]),
            "experience": "\n".join(sections["experience"]),
            "education": "\n".join(sections["education"]),
            "projects": "\n".join(sections["projects"])
        }

        # Structure experience entries roughly
        exp_lines = sections["experience"]
        if exp_lines:
            parsed_data["experience"] = [line for line in exp_lines if len(line) > 10][:4]
        
        edu_lines = sections["education"]
        if edu_lines:
            parsed_data["education"] = [line for line in edu_lines if len(line) > 10][:2]

        return parsed_data
