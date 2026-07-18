const apiBaseUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const API_BASE_URL = apiBaseUrl.startsWith('http') ? apiBaseUrl : `${window.location.origin}${apiBaseUrl}`;

export const ACTION_VERBS = [
  "Led", "Managed", "Designed", "Developed", "Built", "Implemented", "Optimized", 
  "Increased", "Reduced", "Delivered", "Created", "Spearheaded", "Directed"
];

export const MOCK_RESUME_KEYWORDS = [
  "React", "JavaScript", "TypeScript", "Python", "FastAPI", "Docker", "SQL", "PostgreSQL", "AWS"
];
