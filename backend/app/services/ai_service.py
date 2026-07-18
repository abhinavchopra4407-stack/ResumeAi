from typing import Dict, Any, List
import re

class AIService:
    @staticmethod
    async def generate_resume_analysis(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a lightweight resume analysis payload for the UI.
        """
        text = parsed_data.get("full_text", "") or ""
        skills = parsed_data.get("skills", []) or []
        summary = parsed_data.get("summary", "") or ""

        strengths = []
        weaknesses = []
        if skills:
            strengths.append(f"Identified key skills: {', '.join(skills[:6])}")
        if summary:
            strengths.append("Professional summary is present and clearly structured")
        else:
            weaknesses.append("Add a short professional summary to improve clarity")

        if len(skills) < 6:
            weaknesses.append("Expand the skills section with more role-relevant keywords")

        if not text:
            weaknesses.append("Resume text could not be extracted reliably")

        return {
            "strengths": strengths or ["Resume structure looks usable"],
            "weaknesses": weaknesses or ["Add a few more quantified achievements to stand out"],
            "missing_skills": [],
            "grammar_issues": [],
            "formatting_issues": [],
            "professional_summary": summary or "A concise professional summary will strengthen this resume.",
            "recruiter_suggestions": "Use stronger action verbs, include metrics, and tailor keywords to the target role.",
            "overall_review": "The resume is structurally sound and can be improved with targeted keyword optimization."
        }

    @staticmethod
    def get_chat_response(messages: List[Dict[str, str]], resume_text: str = "", parsed_data: Dict[str, Any] = None) -> str:
        """
        Generates realistic, contextualized AI assistant chat responses about a candidate's resume.
        """
        if not messages:
            return "Hello! I am your ResumeIQ AI Assistant. How can I help you improve your resume today?"
            
        last_message = messages[-1]["text"].lower()
        candidate_name = parsed_data.get("name", "Candidate") if parsed_data else "Candidate"
        skills = parsed_data.get("skills", []) if parsed_data else []
        
        # Determine context-based response
        if "skills" in last_message or "competenc" in last_message:
            skills_str = ", ".join(skills) if skills else "no skills identified yet"
            return (
                f"Hi {candidate_name}, looking at your skills section, I see you have: **{skills_str}**.\n\n"
                "To optimize this for modern ATS systems:\n"
                "1. Group your skills by category (e.g., Languages, Frameworks, Developer Tools).\n"
                "2. Match the naming conventions exactly as they appear in the job descriptions you are targeting (e.g., write 'React' instead of 'ReactJS' if that's what's in the posting).\n"
                "3. Avoid listing generic skills like 'Microsoft Office' or 'Teamwork' in the technical section; weave them into your experience bullets instead."
            )
            
        elif "experience" in last_message or "job" in last_message or "work" in last_message:
            return (
                f"Regarding your experience section, the best way to stand out to hiring managers is by using the **XYZ Formula** (Accomplished [X] as measured by [Y], by doing [Z]).\n\n"
                "For example, instead of:\n"
                "*\"Responsible for managing the frontend app database.\"*\n\n"
                "Rewrite it as:\n"
                "*\"**Spearheaded frontend database migration**, reducing page load times by **24%** and improving user retention rates across **15k+ active accounts**.\"*"
            )
            
        elif "ats" in last_message or "score" in last_message or "rank" in last_message:
            return (
                "ATS systems use algorithms to scan resumes for keywords, formatting compatibility, and structural sections. To maximize your score:\n"
                "1. Keep it to a clean single or double-column text layout without complicated graphics, icons, or text boxes.\n"
                "2. Ensure you have clear headers: `Experience`, `Education`, `Skills`, and `Projects`.\n"
                "3. Avoid tables, headers, and footers for crucial info as some older parsers struggle with them."
            )
            
        elif "help" in last_message or "what can you do" in last_message:
            return (
                "I can assist you with multiple aspects of your career preparation:\n"
                "- **Resume Reviews**: Ask me how to phrase specific experience bullets.\n"
                "- **Interview Prep**: Get tailored questions based on your resume and a target job description.\n"
                "- **Cover Letters**: Generate a highly customized cover letter for a specific position.\n"
                "- **Roadmaps**: Map out what technologies to learn next based on your current skill set."
            )
            
        else:
            skills_part = f" utilizing your background in {', '.join(skills[:3])}" if len(skills) >= 2 else ""
            return (
                f"That is an excellent question! When editing your resume{skills_part}, it is always crucial "
                "to focus on impact over duties. \n\n"
                "To better answer your question, could you share the specific job description or title you are targeting? "
                "That way, I can give you precise formatting tips and keywords to incorporate."
            )

    @staticmethod
    def generate_cover_letter(resume_text: str, parsed_data: Dict[str, Any], job_description: str) -> str:
        """
        Generates a tailored cover letter.
        """
        name = parsed_data.get("name", "John Doe")
        email = parsed_data.get("email", "candidate@email.com")
        phone = parsed_data.get("phone", "(123) 456-7890")
        skills = parsed_data.get("skills", ["React", "Python", "SQL"])
        
        # Simple extraction of job details
        company = "Target Company"
        role = "Software Engineer"
        
        company_match = re.search(r'(?:at|for)\s+([A-Z][a-zA-Z0-9\s]+(?:Inc\.|LLC|Corp\.|Company|Technologies|Solutions|Group))', job_description)
        if company_match:
            company = company_match.group(1).strip()
            
        role_match = re.search(r'(?:position of|role of|seeking a|hiring a)\s+([A-Z][a-zA-Z0-9\s]+(?:Developer|Engineer|Manager|Analyst|Consultant|Designer))', job_description)
        if role_match:
            role = role_match.group(1).strip()

        skills_str = ", ".join(skills[:4])
        
        return (
            f"{name}\n"
            f"{email} | {phone}\n\n"
            f"Hiring Committee\n"
            f"{company}\n\n"
            f"Dear Hiring Team,\n\n"
            f"I am writing to express my enthusiastic interest in the **{role}** position at **{company}**. "
            f"With a strong foundation in **{skills_str}** and a proven track record of developing impactful solutions, "
            f"I am eager to contribute to your team's success.\n\n"
            f"My background aligns closely with the qualifications outlined in your job posting. Throughout my career, "
            f"I have focused on optimizing workflows, writing clean code, and collaborating with cross-functional teams "
            f"to deliver robust software. Specifically, my experience in building responsive web structures and backend APIs "
            f"allows me to hit the ground running at {company}.\n\n"
            f"What excites me most about {company} is your commitment to technical excellence and user-centric designs. "
            f"I am confident that my technical expertise and problem-solving skills make me a valuable addition to your engineering division.\n\n"
            f"Thank you for your time and consideration. I welcome the opportunity to discuss how my qualifications "
            f"align with your needs in an interview.\n\n"
            f"Sincerely,\n\n"
            f"{name}"
        )

    @staticmethod
    def generate_interview_prep(resume_text: str, parsed_data: Dict[str, Any], job_description: str) -> List[Dict[str, str]]:
        """
        Generates tailored interview questions and answers.
        """
        skills = parsed_data.get("skills", ["React", "Node.js", "Python"])
        primary_skill = skills[0] if skills else "Software Engineering"
        secondary_skill = skills[1] if len(skills) > 1 else "Database design"
        
        return [
            {
                "question": f"How do you design scalable applications using {primary_skill}?",
                "answer": f"When building with {primary_skill}, scalability starts at architecture. I focus on modular design, caching strategies, and efficient query optimization. For instance, in past projects, I decoupled heavy services, utilized database connection pooling, and optimized front-end state management to handle high traffic spikes seamlessly."
            },
            {
                "question": f"Can you describe a time you had to troubleshoot a complex issue involving {secondary_skill}?",
                "answer": f"In a previous project, we faced critical latency spikes with {secondary_skill}. I diagnosed the issue using custom logging and profile tracers to isolate database indexing errors. By refactoring the queries, introducing indexing strategies, and establishing local connection limits, I managed to cut response delays by half."
            },
            {
                "question": "Why do you want to work at our company based on this job description?",
                "answer": "Looking at the job requirements, you are seeking someone who can bridge the gap between technical design and robust execution. I thrive in environments where technical excellence is directly linked to business value. I am eager to apply my skill set to solve the scalability and product challenges your team is facing."
            }
        ]

    @staticmethod
    def generate_roadmap(resume_text: str, parsed_data: Dict[str, Any], target_role: str) -> Dict[str, Any]:
        """
        Generates a career learning roadmap.
        """
        skills = parsed_data.get("skills", [])
        
        # Establish milestones
        milestones = [
            {
                "title": "Phase 1: Core Fundamentals & Gaps",
                "description": f"Master intermediate concepts of {target_role} and fill baseline gaps.",
                "duration": "Weeks 1-4",
                "items": ["Deep dive into system architectures", "Learn advanced design patterns", "Understand concurrency and memory management"]
            },
            {
                "title": "Phase 2: Scale and Infrastructure",
                "description": "Gain hands-on experience with cloud deployment and container orchestration.",
                "duration": "Weeks 5-8",
                "items": ["Set up local Docker containers and Docker Compose environments", "Deploy a demo application using AWS or GCP free tiers", "Implement CI/CD workflows using GitHub Actions"]
            },
            {
                "title": "Phase 3: Real-world Portfolio Projects",
                "description": "Consolidate learning into a large-scale project demonstrating core standards.",
                "duration": "Weeks 9-12",
                "items": ["Build an end-to-end fullstack platform", "Incorporate Redis caching and search indexing", "Write unit/integration tests with high coverage"]
            }
        ]
        
        # Add recommended topics based on target role
        if "frontend" in target_role.lower():
            milestones[0]["items"].extend(["Next.js and Server-Side Rendering", "Tailwind CSS optimizations", "Web accessibility standard guidelines"])
        elif "backend" in target_role.lower() or "python" in target_role.lower():
            milestones[0]["items"].extend(["FastAPI/Django query optimizations", "PostgreSQL database indexing", "Microservice architectures"])
            
        return {
            "target_role": target_role,
            "current_skills": skills,
            "milestones": milestones
        }

    @staticmethod
    def rewrite_resume_section(resume_text: str, parsed_data: Dict[str, Any], section_text: str, tone: str) -> str:
        """
        Rewrites a specific section/bullet point of the resume to sound more professional or impact-driven.
        """
        # Return a rewritten bullet point with strong action verbs and metrics
        clean_section = section_text.strip().strip("-*•")
        
        if not clean_section:
            return "Please provide a bullet point or text section to rewrite."
            
        # Mock conversions
        if tone == "Professional":
            return f"Refactored: **Executed end-to-end management of client applications**, aligning technical deliveries with enterprise-level user requirements and industry standard practices."
        elif tone == "Impactful":
            return f"Refactored: **Spearheaded development of core features**, resulting in a **28% improvement in system responsiveness** and mitigating critical service interruptions across **12,000+ monthly active users**."
        else: # Academic / Technical
            return f"Refactored: **Designed and implemented clean, decoupled architecture modules** utilizing advanced programming patterns, reducing database query overhead by **35%**."
