# ResumeAi
### AI-Powered Resume Screening, ATS Scoring, and Interview Assistant

ResumeIQ AI is a smart recruitment and candidate preparation platform. It automates resume parsing, computes structural and keyword-based ATS alignment scores, identifies critical skill gaps, recommends career roadmaps, and conducts interactive AI-powered mock interviews. It helps recruiters evaluate applicants faster and empowers candidates with actionable, personalized career feedback. 

**Website Link** :- https://resume-ai-nine.vercel.app


## 📋 Table of Contents

- [Core Features](#-core-features)
- [System Architecture & Flow](#-system-architecture--flow)
- [Project Tech Stack](#-project-tech-stack)
- [Directory Layout](#-directory-layout)
- [Local Setup Guide](#-local-setup-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Docker Setup](#3-docker-setup-optional)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Academic Project Team](#-academic-project-team)


---

## ✨ Core Features

*   **Resume Parsing (PDF/DOCX)**: Extract contact information, skills, education, and experience using structured rules and library parsers (`PyMuPDF`/`pdfplumber`/`python-docx`).
*   **Comprehensive ATS Scorer**: Evaluates resumes dynamically based on layout/formatting, contact information completeness, core skill keywords, usage of action verbs (strong vs. weak), and section metrics.
*   **Job Description Matching**: Compares candidate resumes against specific job descriptions to calculate alignment scores, list matching/missing skills, and generate key improvement insights.
*   **Interactive AI Mock Interview**: Runs role-tailored mock interview sessions powered by OpenAI GPT or Groq (Llama 3.1) with context-aware chat logs and answer evaluations.
*   **AI-Powered Career Tools**:
    *   *Cover Letter Generator*: Generates professional cover letters customized to specific job descriptions.
    *   *Interview Prep*: Creates customized question-and-answer prep sheets based on the user's background.
    *   *Career Roadmap*: Outlines chronological milestone roadmaps and learning suggestions tailored to target job roles.
    *   *Resume Rewriter*: Refines resume bullets instantly with different professional tones (Professional, Impactful, Technical).
*   **Secure Authentication**: JWT-based session tokens, password hashing with bcrypt, and profile management.

---

## ⚙️ System Architecture & Flow

```
   +-------------------+         +-----------------------+
   |   Resume Upload   | ------> |    PDF/DOCX Parser    |
   |   (Candidate)     |         | (PyMuPDF/pdfplumber)  |
   +-------------------+         +-----------+-----------+
                                             |
                                             v
   +-------------------+         +-----------+-----------+
   |  Job Description  | ------> |    NLP & Skill        |
   |  (Recruiter/Role) |         |     Extraction        |
   +-------------------+         +-----------+-----------+
                                             |
                                             v
   +-------------------+         +-----------+-----------+
   | AI Mock Interview | <------ |  ATS & Match Scorer   |
   | (OpenAI / Groq)   |         |   (Rule-based + ML)   |
   +-------------------+         +-----------+-----------+
             |                               |
             v                               v
   +-----------------------------------------------------+
   |                 Candidate Dashboard                 |
   |   (Reports, Skill Roadmaps, Cover Letters, Prep QA) |
   +-----------------------------------------------------+
```

---

## 🛠️ Project Tech Stack

| Layer | Technology | Key Packages / Libraries |
|---|---|---|
| **Frontend** | React, Vite | React Router DOM, Tailwind CSS, Framer Motion, Recharts, Chart.js, React Dropzone, React PDF |
| **Backend** | Python, FastAPI | Uvicorn, SQLAlchemy, Pydantic (v2), PyJWT, Passlib (Bcrypt) |
| **Database** | SQLite / PostgreSQL | Local file-based `resumeiq.db` database schema with support for PostgreSQL |
| **Parsing** | PDF & Word Parsers | PyMuPDF (`fitz`), `pdfplumber`, `python-docx`, Regular Expressions (`re`) |
| **AI Integration** | OpenAI / Groq SDK | `openai` client (integrates with GPT-3.5 or Groq's Llama 3.1 depending on API key format) |

---

## 📁 Directory Layout

```
ResumeAI/
├── backend/
│   ├── app/
│   │   ├── api/             # API Router endpoints (auth, resume, chat, tools, admin)
│   │   ├── core/            # App configurations, database connections, and auth middleware
│   │   ├── models/          # SQLAlchemy Database Models (User, Resume, Chat, etc.)
│   │   ├── schemas/         # Pydantic Schemas for request/response serialization
│   │   ├── services/        # Service layer (AI, ATS Scorer, Parsers, Job Matcher)
│   │   ├── main.py          # FastAPI application entrypoint
│   │   └── requirements.txt # Python dependency file
│   ├── .env                 # Backend environment secrets
│   ├── Dockerfile           # Backend container instructions
│   └── resumeiq.db          # Default SQLite database
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios request instances & API routes
│   │   ├── components/      # Common UI elements (Navbar, Loader, Sidebar)
│   │   ├── pages/           # Application views (Landing, Dashboard, Analyze, Chat, Reports, Profile)
│   │   ├── router.jsx       # App route protection & mappings
│   │   ├── styles/          # Tailwind setup and custom CSS
│   │   └── App.jsx          # Root component
│   ├── .env                 # Frontend environment settings
│   ├── tailwind.config.js   # Tailwind style customizations
│   ├── vite.config.js       # Vite build configurations
│   ├── package.json         # Node package definitions
│   └── Dockerfile           # Frontend container instructions
├── docker-compose.yml       # Docker orchestration template
└── README.md                # Project documentation
```

---

## 💻 Local Setup Guide

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+** & **npm**
*   **OpenAI API Key** or **Groq API Key** *(Optional - for advanced AI Mock Interviews)*

### 1. Backend Setup

1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r app/requirements.txt
    ```
4.  Configure the environment:
    *   Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below).
5.  Start the FastAPI local development server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    *   *The API will start at:* `http://127.0.0.1:8000`
    *   *Interactive Swagger Documentation will be available at:* `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

1.  Navigate into the `frontend/` directory:
    ```bash
    cd ../frontend
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Configure the environment:
    *   Create a `.env` file in the `frontend/` directory with your API URL:
        ```env
        VITE_API_URL=http://127.0.0.1:8000/api/v1
        ```
4.  Start the Vite development environment:
    ```bash
    npm run dev
    ```
    *   *The frontend will run at:* `http://localhost:5173`

---

### 3. Docker Setup (Optional)

To spin up both frontend and backend using Docker:

1.  From the root project directory, run:
    ```bash
    docker-compose up --build
    ```
2.  The application will be accessible at:
    *   **Frontend**: `http://localhost:5173`
    *   **Backend API**: `http://localhost:8000`

---

## 🔑 Environment Variables

### Backend Environment (`backend/.env`)

```env
SECRET_KEY=your-jwt-signing-secret-key-change-in-production
DATABASE_URL=sqlite:///./resumeiq.db
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
OPENAI_API_KEY=your-openai-or-groq-api-key
```

> [!NOTE]
> The backend automatically detects the provider based on your key format:
> *   If the key starts with `gsk_`, it configures the client to connect to **Groq API** using the `llama-3.1-8b-instant` model.
> *   Otherwise, it assumes an **OpenAI API Key** and targets `gpt-3.5-turbo`.
> *   If no key is configured, the application falls back gracefully to a built-in rules engine to handle user requests without failing.

### Frontend Environment (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

---

## ⚡ API Reference

All requests must be prefixed with `/api/v1`. Protected routes require a Bearer token in the `Authorization` header.

### 🔐 Authentication Router (`/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/signup` | Register a new user and receive a JWT | No |
| `POST` | `/auth/login` | Authenticate credentials and receive a JWT | No |
| `GET` | `/auth/profile` | Retrieve the currently logged-in user profile details | **Yes** |

### 📄 Resume Router (`/resume`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/resume` | Upload a new resume (Multipart PDF/DOCX) | **Yes** |
| `GET` | `/resume` | List all resumes uploaded by the current user | **Yes** |
| `GET` | `/resume/{resume_id}` | Retrieve details of a parsed resume | **Yes** |
| `POST` | `/resume/{resume_id}/analyze` | Perform dynamic ATS score and Job Description matching | **Yes** |
| `GET` | `/resume/analysis/{resume_id}` | Get previous analysis results for a resume | **Yes** |
| `DELETE` | `/resume/{resume_id}` | Remove a resume and its related data from database | **Yes** |

### 💬 Chat/Mock Interview Router (`/chat`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/chat` | Retrieve history of user's mock interview sessions | **Yes** |
| `POST` | `/chat` | Initiate a new mock interview session | **Yes** |
| `GET` | `/chat/{chat_id}` | Retrieve the chat log for a specific session | **Yes** |
| `POST` | `/chat/{chat_id}/message` | Send answer message to AI and receive next question/evaluation | **Yes** |

### 🔧 AI Career Tools Router (`/tools`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/tools/cover-letter` | Generate customized cover letter for a job description | **Yes** |
| `POST` | `/tools/interview-prep` | Generate customized question-answer sheets based on resume | **Yes** |
| `POST` | `/tools/roadmap` | Generate milestones and suggestions to transition into a target role | **Yes** |
| `POST` | `/tools/rewrite` | Optimize specific resume bullet points in custom tones | **Yes** |

### 📊 Admin Router (`/admin`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/admin/stats` | Retrieve platform statistics (users, parsing, uploads) | **Yes** |

---

## 👥 Project Contributors

**Abhinav Chopra**

**Priya**

**Niyati Dhar**

**Nitin Kumar**
