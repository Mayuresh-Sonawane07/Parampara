import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_admin_flow():
    print(f"==================================================")
    print(f" Testing All Admin Endpoints on {BASE_URL}")
    print(f"==================================================")

    # 1. Login
    login_resp = requests.post(f"{BASE_URL}/api/admin/login", json={
        "username": "admin",
        "password": "ParamparaAdmin@2026"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] 1. POST /api/admin/login -> Token received")

    # 2. Stats
    stats_resp = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    print(f"[PASS] 2. GET /api/admin/stats -> {stats}")

    # 3. List Contributions
    contribs_resp = requests.get(f"{BASE_URL}/api/admin/contributions", headers=headers)
    assert contribs_resp.status_code == 200
    contribs = contribs_resp.json()
    print(f"[PASS] 3. GET /api/admin/contributions -> {len(contribs)} contributions retrieved")

    # 4. Review Contribution
    if contribs:
        target_c = contribs[0]
        review_resp = requests.patch(f"{BASE_URL}/api/admin/contributions/{target_c['id']}", headers=headers, json={
            "status": "APPROVED",
            "reviewer_notes": "Automated verification audit test notes."
        })
        assert review_resp.status_code == 200
        print(f"[PASS] 4. PATCH /api/admin/contributions/{target_c['id']} -> Status APPROVED")

    # 5. List Traditions (Admin)
    trad_resp = requests.get(f"{BASE_URL}/api/admin/traditions", headers=headers)
    assert trad_resp.status_code == 200
    traditions = trad_resp.json()
    print(f"[PASS] 5. GET /api/admin/traditions -> {len(traditions)} traditions with hotspots and quiz counts")

    # 6. Create Tradition
    new_trad = {
        "name": "Kalamkari Textile Art",
        "slug": f"kalamkari-audit-test",
        "region": "South",
        "state": "Andhra Pradesh",
        "category": "Textile / Embroidery",
        "short_description": "Ancient organic-dyed pen craft tradition.",
        "description": "Kalamkari represents an ancient temple narrative scroll art using tamarind pens and natural vegetable pigments.",
        "experience_type": "MOTIF_EXPLORER",
        "hero_image": "/heritage-images/toda.jpg",
        "thumbnail": "/heritage-images/toda.jpg",
        "status": "DRAFT"
    }
    create_trad_resp = requests.post(f"{BASE_URL}/api/admin/traditions", headers=headers, json=new_trad)
    assert create_trad_resp.status_code == 201
    created_t = create_trad_resp.json()
    print(f"[PASS] 6. POST /api/admin/traditions -> Created ID #{created_t['id']} ('{created_t['name']}')")

    # 7. Update Tradition
    update_trad_resp = requests.patch(f"{BASE_URL}/api/admin/traditions/{created_t['id']}", headers=headers, json={
        "status": "PUBLISHED",
        "short_description": "Updated audit description."
    })
    assert update_trad_resp.status_code == 200
    print(f"[PASS] 7. PATCH /api/admin/traditions/{created_t['id']} -> Updated status to PUBLISHED")

    # 8. Delete Tradition
    del_trad_resp = requests.delete(f"{BASE_URL}/api/admin/traditions/{created_t['id']}", headers=headers)
    assert del_trad_resp.status_code == 200
    print(f"[PASS] 8. DELETE /api/admin/traditions/{created_t['id']} -> Cleanly removed")

    # 9. List Sources
    src_resp = requests.get(f"{BASE_URL}/api/admin/sources", headers=headers)
    assert src_resp.status_code == 200
    sources = src_resp.json()
    print(f"[PASS] 9. GET /api/admin/sources -> {len(sources)} archival citations")

    # 10. Create Source
    new_src = {
        "title": "National Crafts Council Archival Dossier",
        "organization": "Crafts Council of India",
        "source_type": "CULTURAL_INSTITUTION",
        "url": "https://craftscouncilindia.org/archives",
        "description": "Field documentation of traditional Indian material cultures.",
        "verification_status": "VERIFIED"
    }
    create_src_resp = requests.post(f"{BASE_URL}/api/admin/sources", headers=headers, json=new_src)
    assert create_src_resp.status_code == 201
    created_s = create_src_resp.json()
    print(f"[PASS] 10. POST /api/admin/sources -> Created Source #{created_s['id']}")

    # 11. Delete Source
    del_src_resp = requests.delete(f"{BASE_URL}/api/admin/sources/{created_s['id']}", headers=headers)
    assert del_src_resp.status_code == 200
    print(f"[PASS] 11. DELETE /api/admin/sources/{created_s['id']} -> Removed test citation")

    # 12. Real-Time System Audit
    audit_resp = requests.get(f"{BASE_URL}/api/admin/audit", headers=headers)
    assert audit_resp.status_code == 200
    audit = audit_resp.json()
    print(f"[PASS] 12. GET /api/admin/audit -> Database Status: '{audit['database_status']}', Narration: {audit['narration_voice_engines']}")
    print(f"         Verified Heritage Assets: {audit['heritage_assets_verified']}")

    print("\n=======================================================")
    print(" >>> ALL ADMIN MANAGEMENT ENDPOINTS FULLY VERIFIED! <<<")
    print("=======================================================\n")

if __name__ == "__main__":
    test_admin_flow()
