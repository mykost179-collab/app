import pytest
from fastapi.testclient import TestClient
from server import app

def test_root():
    with TestClient(app) as client:
        response = client.get("/api/")
        assert response.status_code == 200
        assert response.json() == {"message": "Tanda API berjalan"}

def test_get_markers():
    with TestClient(app) as client:
        response = client.get("/api/markers")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

def test_create_and_update_marker():
    with TestClient(app) as client:
        # Create marker
        payload = {
            "date": "2026-10-01",
            "color": "blue",
            "label": "Test Meeting",
            "icon": "check-circle"
        }
        res = client.post("/api/markers", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["label"] == "Test Meeting"
        assert data["date"] == "2026-10-01"
        marker_id = data["id"]

        # Update marker
        update_payload = {
            "label": "Updated Meeting"
        }
        res_update = client.patch(f"/api/markers/{marker_id}", json=update_payload)
        assert res_update.status_code == 200
        updated_data = res_update.json()
        assert updated_data["label"] == "Updated Meeting"

        # Get legend
        res_legend = client.get("/api/legend")
        assert res_legend.status_code == 200
        assert isinstance(res_legend.json(), list)

        # Delete marker
        res_del = client.delete(f"/api/markers/{marker_id}")
        assert res_del.status_code == 200
        assert res_del.json()["success"] is True
