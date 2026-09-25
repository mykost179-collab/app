import time
import threading
import requests
import uvicorn
from server import app

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

def test_live_app():
    # Start server in background thread
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(2) # wait for server to start

    base_url = "http://127.0.0.1:8000/api"

    # Root
    res = requests.get(f"{base_url}/")
    print("Root:", res.status_code, res.json())
    assert res.status_code == 200

    # Get markers
    res = requests.get(f"{base_url}/markers")
    print("Get markers:", res.status_code, len(res.json()))
    assert res.status_code == 200

    # Create marker
    payload = {
        "date": "2026-10-15",
        "color": "green",
        "label": "Live Test Event",
        "icon": "check-circle"
    }
    res = requests.post(f"{base_url}/markers", json=payload)
    print("Create marker:", res.status_code, res.json())
    assert res.status_code == 200
    data = res.json()
    marker_id = data["id"]

    # Update marker
    update_payload = {"label": "Updated Live Event"}
    res = requests.patch(f"{base_url}/markers/{marker_id}", json=update_payload)
    print("Update marker:", res.status_code, res.json())
    assert res.status_code == 200
    assert res.json()["label"] == "Updated Live Event"

    # Get legend
    res = requests.get(f"{base_url}/legend")
    print("Get legend:", res.status_code, res.json())
    assert res.status_code == 200

    # Delete marker
    res = requests.delete(f"{base_url}/markers/{marker_id}")
    print("Delete marker:", res.status_code, res.json())
    assert res.status_code == 200

    print("All live integration tests passed successfully!")

if __name__ == "__main__":
    test_live_app()
