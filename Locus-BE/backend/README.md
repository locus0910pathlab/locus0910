# LocusLab Backend API

A FastAPI backend for managing diagnostic laboratory patients, tests catalog, and patient visits.

## Project Structure

```text
backend/
├── app/
│   ├── main.py              # Application entry point and router inclusion
│   ├── database.py          # SQLAlchemy engine, session maker, and DB dependency
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── patient.py
│   │   ├── test.py
│   │   └── visit.py
│   ├── schemas/             # Pydantic validation & response models
│   │   ├── patient.py
│   │   ├── test.py
│   │   └── visit.py
│   ├── routers/             # API endpoints
│   │   ├── patients.py
│   │   ├── tests.py
│   │   └── visits.py
│   └── services/            # Business logic and database operations
│       ├── patient_service.py
│       ├── test_service.py
│       └── visit_service.py
├── tests/
│   └── test_api.py
├── pytest.ini
├── requirements.txt
└── .env.example
```

## Getting Started

### 1. Activate Virtual Environment & Install Dependencies

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Run the Development Server

**Option A — Run from the project root:**
```bash
source .venv/bin/activate
uvicorn backend.app.main:app --reload --port 8000
```
*(or `uvicorn --app-dir backend app.main:app --reload --port 8000`)*

**Option B — Run from inside `backend/`:**
```bash
cd backend
source ../.venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 3. Interactive API Documentation

Once the server is running, visit:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

### 4. Run Automated Tests

```bash
cd backend
pytest -v
```
