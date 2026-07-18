import openai
from openai import AsyncOpenAI
from typing import Dict, List, Optional
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        # YAHAN SE API KEY LOAD HO GI
        self.api_key = settings.OPENAI_API_KEY
        
        print(f"[Info] ChatService: API Key present: {'Yes' if self.api_key else 'No'}")
        
        if not self.api_key or self.api_key == "":
            logger.error("OPENAI_API_KEY is not set!")
            print("[Error] OPENAI_API_KEY is not set in .env file!")
            self.client = None
        else:
            if self.api_key.startswith("gsk_"):
                self.client = AsyncOpenAI(
                    api_key=self.api_key,
                    base_url="https://api.groq.com/openai/v1"
                )
                self.model = "llama-3.1-8b-instant"
                print("Groq Client initialized successfully!")
            else:
                self.client = AsyncOpenAI(api_key=self.api_key)
                self.model = "gpt-3.5-turbo"
                print("OpenAI AsyncOpenAI client initialized successfully!")
            print(f"Model: {self.model}")
        
    async def get_chat_response(self, 
                                message: str, 
                                resume_data: Dict, 
                                chat_history: List[Dict]) -> str:
        """
        Get AI response based on resume context and chat history
        """
        try:
            # Check if API key is available
            if not self.client:
                return "⚠️ OpenAI API key is missing. Please add OPENAI_API_KEY to your .env file."
            
            # Build system prompt
            system_prompt = self._build_system_prompt(resume_data)
            
            # Build messages
            messages = [
                {"role": "system", "content": system_prompt}
            ]
            
            # Add chat history
            for msg in chat_history[-10:]:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    messages.append({
                        "role": msg['role'],
                        "content": msg['content']
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            print(f"[Info] Sending request to OpenAI with {len(messages)} messages")
            
            # Get response from OpenAI
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.8,
                max_tokens=500,
                top_p=0.9,
                frequency_penalty=0.5,
                presence_penalty=0.5
            )
            
            ai_response = response.choices[0].message.content
            print(f"[Info] Received response: {len(ai_response)} characters")
            return ai_response
            
        except openai.AuthenticationError as e:
            print(f"[Error] OpenAI Authentication Error: {str(e)}")
            return "⚠️ OpenAI API key is invalid. Please check your API key."
            
        except openai.RateLimitError as e:
            print(f"[Error] OpenAI Rate Limit/Quota Error: {str(e)}")
            if "insufficient_quota" in str(e):
                return "⚠️ OpenAI API quota exceeded (insufficient_quota). Please check your OpenAI plan and billing details."
            return f"⚠️ OpenAI Rate Limit exceeded: {str(e)}"
            
        except Exception as e:
            print(f"[Error] Exception in ChatService: {str(e)}")
            return self._get_fallback_response(message, resume_data)
    
    def _build_system_prompt(self, resume_data: Dict) -> str:
        """Build system prompt with resume context"""
        resume_text = self._format_resume_data(resume_data)
        
        return f"""You are ResumeIQ AI, a professional career coach and resume expert.

RESUME CONTEXT:
{resume_text}

Guidelines:
1. Give specific, personalized advice based on the user's actual resume
2. Suggest relevant skills, technologies, and improvements
3. Be conversational and helpful
4. Never give generic responses - always personalize

Provide detailed, actionable advice."""
    
    def _format_resume_data(self, resume_data: Dict) -> str:
        """Format resume data for context"""
        sections = []
        
        if resume_data.get('name'):
            sections.append(f"Name: {resume_data['name']}")
        
        if resume_data.get('skills'):
            sections.append(f"Skills: {', '.join(resume_data['skills'])}")
        
        if resume_data.get('experience'):
            for exp in resume_data['experience'][:3]:
                if exp.get('title'):
                    sections.append(f"Experience: {exp['title']} at {exp.get('company', 'Unknown')}")
        
        if resume_data.get('education'):
            for edu in resume_data['education'][:2]:
                if edu.get('degree'):
                    sections.append(f"Education: {edu['degree']}")
        
        return '\n'.join(sections) if sections else "No resume data available"
    
    def _get_fallback_response(self, message: str, resume_data: Dict) -> str:
        """Fallback response when API fails"""
        skills = resume_data.get('skills', [])
        
        if 'skill' in message.lower() or 'add' in message.lower():
            if skills:
                return f"""Based on your current skills: {', '.join(skills[:5])}

Here are skills you should consider adding:

1. **Deep Learning**: TensorFlow, PyTorch, Keras
2. **Big Data**: Spark, Hadoop, Kafka
3. **Cloud**: AWS, GCP, Azure
4. **MLOps**: Docker, Kubernetes, MLflow
5. **Advanced**: FastAPI, GraphQL, Redis

Which of these interests you most?"""
        
        return """I can help you with:
1. Resume improvements
2. Skill recommendations
3. Interview preparation
4. ATS optimization
5. Career roadmap

What would you like to know?"""