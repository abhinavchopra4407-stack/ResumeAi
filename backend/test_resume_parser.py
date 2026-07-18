"""
Test script to verify the ResumeParser works correctly with various file types
"""
import asyncio
import json
from app.services.resume_parser import ResumeParser

async def test_parser_with_text():
    """Test parser with sample text"""
    parser = ResumeParser()
    
    sample_resume = """
    John Michael Doe
    Senior Software Engineer | Full Stack Developer
    johndoe@email.com | +1 (555) 123-4567
    
    PROFESSIONAL SUMMARY
    Experienced Software Engineer with 7+ years in web development and cloud architecture. 
    Proficient in Python, React, Node.js, and AWS cloud services. Led teams of up to 10 engineers.
    
    TECHNICAL SKILLS
    Python, JavaScript, React, Node.js, Django, Flask, PostgreSQL, MongoDB, 
    Docker, Kubernetes, AWS (EC2, S3, Lambda, RDS), Git, CI/CD, Redis, Elasticsearch
    
    WORK EXPERIENCE
    Senior Software Engineer
    Google
    Jan 2020 - Present
    - Led a team of 8 developers building scalable web applications serving 1M+ users
    - Improved system performance by 45% using optimized algorithms and caching strategies
    - Implemented CI/CD pipeline using Jenkins and Docker, reducing deployment time by 70%
    - Mentored junior developers and conducted code reviews
    
    Software Developer
    Amazon
    Jun 2017 - Dec 2019
    - Developed full-stack applications using React and Node.js
    - Designed and maintained RESTful APIs serving 50K+ users
    - Reduced API response time by 60% through database optimization
    
    Junior Developer
    Startup Solutions
    Jan 2016 - May 2017
    - Built internal tools using Python and Django
    - Maintained existing codebase and fixed bugs
    - Collaborated with team on agile development process
    
    EDUCATION
    Master of Science in Computer Science
    Stanford University
    2014 - 2016
    GPA: 3.9/4.0
    Thesis: Machine Learning for Web Applications
    
    Bachelor of Engineering in Computer Science
    MIT
    2010 - 2014
    GPA: 3.7/4.0
    
    PROJECTS
    E-commerce Platform
    Built a full-stack e-commerce platform using React, Node.js, and MongoDB.
    Implemented payment integration with Stripe and PayPal.
    Deployed on AWS with auto-scaling capabilities.
    Technologies: React, Node.js, MongoDB, Stripe, AWS
    
    AI Chatbot
    Developed a conversational AI chatbot using Python, NLP, and Deep Learning.
    Integrated with Slack and WhatsApp APIs.
    Deployed on AWS EC2 with Docker containerization.
    Technologies: Python, TensorFlow, Docker, AWS, NLP
    
    CERTIFICATIONS
    AWS Certified Solutions Architect - Professional
    Certified Scrum Master (CSM)
    Google Cloud Professional Developer
    
    LANGUAGES
    English (Native)
    Spanish (Professional Working)
    
    ACHIEVEMENTS
    Best Performance Award - Google 2022
    Top 10% in Hackathon 2019
    """
    
    # Parse the text
    parsed = await parser.parse(sample_resume.encode('utf-8'), 'sample_resume.txt')
    
    # Display results
    print("=" * 70)
    print("PARSED RESUME DATA - FULL OUTPUT")
    print("=" * 70)
    
    print(f"\n📝 Personal Info:")
    print(f"  Name: {parsed['name']}")
    print(f"  Email: {parsed['email']}")
    print(f"  Phone: {parsed['phone']}")
    
    print(f"\n🔧 Skills ({len(parsed['skills'])} found):")
    for skill in parsed['skills'][:10]:
        print(f"  • {skill}")
    if len(parsed['skills']) > 10:
        print(f"  ... and {len(parsed['skills']) - 10} more")
    
    print(f"\n💼 Experience ({len(parsed['experience'])} entries):")
    for i, exp in enumerate(parsed['experience'], 1):
        print(f"\n  {i}. {exp.get('title', 'Unknown Position')}")
        if exp.get('company'):
            print(f"     Company: {exp['company']}")
        if exp.get('duration'):
            print(f"     Duration: {exp['duration']}")
        if exp.get('description'):
            desc_lines = exp['description'].split('\n')
            for desc in desc_lines[:3]:
                if desc.strip():
                    print(f"     • {desc.strip()}")
    
    print(f"\n🎓 Education ({len(parsed['education'])} entries):")
    for i, edu in enumerate(parsed['education'], 1):
        print(f"\n  {i}. {edu.get('degree', 'Unknown Degree')}")
        if edu.get('institution'):
            print(f"     Institution: {edu['institution']}")
    
    print(f"\n🚀 Projects ({len(parsed['projects'])} entries):")
    for i, proj in enumerate(parsed['projects'], 1):
        print(f"\n  {i}. {proj.get('name', 'Unknown Project')}")
        if proj.get('technologies'):
            print(f"     Tech: {', '.join(proj['technologies'])}")
        if proj.get('description'):
            desc = proj['description'][:100]
            print(f"     Description: {desc}...")
    
    print(f"\n📜 Certifications ({len(parsed['certifications'])} found):")
    for cert in parsed['certifications']:
        print(f"  • {cert}")
    
    print(f"\n🌍 Languages ({len(parsed['languages'])} found):")
    for lang in parsed['languages']:
        print(f"  • {lang}")
    
    print(f"\n🏆 Achievements ({len(parsed['achievements'])} found):")
    for achievement in parsed['achievements']:
        print(f"  • {achievement}")
    
    print(f"\n📊 Stats:")
    print(f"  Word Count: {parsed['word_count']}")
    print(f"  Line Count: {parsed['line_count']}")
    print(f"  Summary: {parsed['summary'][:200]}...")
    
    print("\n" + "=" * 70)
    print("✅ Parser test completed successfully!")
    
    return parsed

async def test_parser_with_pdf():
    """Test parser with actual PDF file"""
    parser = ResumeParser()
    
    # Test with a real PDF file if available
    import os
    pdf_path = "sample_resume.pdf"  # Place a sample PDF in the backend folder
    
    if os.path.exists(pdf_path):
        with open(pdf_path, 'rb') as f:
            content = f.read()
        parsed = await parser.parse(content, 'sample_resume.pdf')
        print(f"\n📄 PDF Parsed Successfully!")
        print(f"  Name: {parsed['name']}")
        print(f"  Word Count: {parsed['word_count']}")
        print(f"  Skills Found: {len(parsed['skills'])}")
        return parsed
    else:
        print("\n⚠️ No PDF file found to test. Please place a sample_resume.pdf in the backend folder.")
        return None

if __name__ == "__main__":
    print("🧪 Testing Resume Parser\n")
    
    # Test with text
    parsed_data = asyncio.run(test_parser_with_text())
    
    # Uncomment to test with PDF
    # asyncio.run(test_parser_with_pdf())