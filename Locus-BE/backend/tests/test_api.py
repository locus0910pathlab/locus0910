import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_patient_crud():
    # 1. Create Patient
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com",
        "phone": "+1234567890",
        "gender": "Female",
        "date_of_birth": "1990-05-15",
    }
    response = client.post("/api/v1/patients/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["first_name"] == "Jane"
    patient_id = data["id"]

    # 2. Get Patient by ID
    response = client.get(f"/api/v1/patients/{patient_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "jane.doe@example.com"

    # 3. Update Patient
    response = client.put(
        f"/api/v1/patients/{patient_id}",
        json={"first_name": "Janet"},
    )
    assert response.status_code == 200
    assert response.json()["first_name"] == "Janet"

    # 4. List Patients
    response = client.get("/api/v1/patients/?search=Janet")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_test_crud():
    # 1. Create Test
    payload = {
        "code": "CBC001",
        "name": "Complete Blood Count",
        "category": "Hematology",
        "price": 35.50,
        "turnaround_hours": 12,
    }
    response = client.post("/api/v1/tests/", json=payload)
    assert response.status_code == 201
    test_id = response.json()["id"]

    # 2. List Tests
    response = client.get("/api/v1/tests/")
    assert response.status_code == 200
    assert len(response.json()) == 1

    # 3. Duplicate code rejected
    response = client.post("/api/v1/tests/", json=payload)
    assert response.status_code == 400


def test_visit_flow():
    # 1. Create patient
    p_resp = client.post(
        "/api/v1/patients/",
        json={"first_name": "John", "last_name": "Smith", "email": "john.smith@example.com"},
    )
    patient_id = p_resp.json()["id"]

    # 2. Create test
    t_resp = client.post(
        "/api/v1/tests/",
        json={"code": "LIPID01", "name": "Lipid Profile", "price": 50.0},
    )
    test_id = t_resp.json()["id"]

    # 3. Create Visit with test
    v_resp = client.post(
        "/api/v1/visits/",
        json={
            "patient_id": patient_id,
            "test_ids": [test_id],
            "notes": "Routine checkup",
        },
    )
    assert v_resp.status_code == 201
    visit_data = v_resp.json()
    assert visit_data["total_amount"] == 50.0
    assert len(visit_data["tests_ordered"]) == 1
    visit_id = visit_data["id"]
    visit_test_id = visit_data["tests_ordered"][0]["id"]

    # 4. Update test result inside visit
    patch_resp = client.patch(
        f"/api/v1/visits/{visit_id}/tests/{visit_test_id}",
        json={"status": "COMPLETED", "result_value": "Normal"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "COMPLETED"
    assert patch_resp.json()["result_value"] == "Normal"

    # 5. Get Visit details
    get_v = client.get(f"/api/v1/visits/{visit_id}")
    assert get_v.status_code == 200
    assert get_v.json()["patient"]["email"] == "john.smith@example.com"
