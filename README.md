# LocusLab - Clinical Diagnostic Laboratory Platform

LocusLab is a full-stack clinical laboratory management platform designed for patient intake, test ordering, status tracking, and diagnostic report recording.

## Project Structure

```
LocusLab/
├── Locus-BE/         # FastAPI Backend
│   ├── backend/
│   │   ├── app/
│   │   │   ├── models/       # SQLAlchemy models (Patient, Test, Visit)
│   │   │   ├── routers/      # REST API endpoints (/patients, /tests, /visits)
│   │   │   ├── schemas/      # Pydantic validation schemas
│   │   │   └── database.py   # Database session and engine config
│   │   └── requirements.txt
│   └── run.py
│
└── Locus-FE/         # React + TypeScript Frontend
    └── locusfe/
        ├── public/
        ├── src/
        │   ├── components/   # UI components (Button, Input, Modal, Sidebar, Navbar)
        │   ├── modules/      # Feature modules (Dashboard, Patients, AddPatient, PatientDetails, TestList)
        │   ├── routes/       # AppRoutes
        │   └── services/     # API client and service endpoints
        └── package.json
```

## Getting Started

### 1. Backend (FastAPI)
```bash
cd Locus-BE
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend (React + TypeScript)
```bash
cd Locus-FE/locusfe
npm install
npm start
```
- Web Application: `http://localhost:3000`

## Deployment Roadmap
- **Database**: Supabase PostgreSQL connection
- **Frontend Hosting**: Vercel
