# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Parampara" in data["project"]

@pytest.mark.asyncio
async def test_get_traditions():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/traditions")
    assert res.status_code == 200
    traditions = res.json()
    assert len(traditions) == 4
    slugs = [t["slug"] for t in traditions]
    assert "thathera" in slugs
    assert "toda" in slugs
    assert "chhau" in slugs
    assert "warli" in slugs

@pytest.mark.asyncio
async def test_tradition_detail_and_sources():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/traditions/warli")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Warli Painting"
    assert len(data["sources"]) >= 2
    assert any("INTACH" in s["organization"] for s in data["sources"])
    assert data["ar_experience"] is not None
    assert len(data["ar_experience"]["hotspots"]) == 6

@pytest.mark.asyncio
async def test_thathera_craft_journey_experience():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/traditions/thathera/experience")
    assert res.status_code == 200
    exp = res.json()
    assert exp["type"] == "CRAFT_JOURNEY"
    assert len(exp["items"]) == 8
    assert "Ingot" in exp["items"][0]["title"]
    assert "Dimpling" in exp["items"][6]["title"]

@pytest.mark.asyncio
async def test_quiz_retrieval_and_submission():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        q_res = await ac.get("/api/traditions/chhau/quiz")
        assert q_res.status_code == 200
        quiz_data = q_res.json()
        assert len(quiz_data["questions"]) == 3
        q1 = quiz_data["questions"][0]
        opt1 = q1["options"][0]

        quiz_id = quiz_data["id"]
        sub_res = await ac.post(f"/api/quiz/{quiz_id}/submit", json={
            "answers": [{"question_id": q1["id"], "option_id": opt1["id"]}]
        })
        assert sub_res.status_code == 200
        result = sub_res.json()
        assert result["quiz_id"] == quiz_id
        assert result["total_questions"] == 3
        assert "score_percentage" in result
        assert len(result["results"]) == 3

@pytest.mark.asyncio
async def test_community_contribution_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "contributor_name": "Test Contributor",
            "email": "contributor@example.com",
            "tradition_name": "Warli Painting",
            "region": "West",
            "location": "Dahanu, Maharashtra",
            "description": "Documentation of Tarpa wind instrument crafted from dried bottle gourd and bamboo reeds.",
            "cultural_significance": "Tarpa is used exclusively in autumn and winter communal harvest dances.",
            "consent_given": True
        }
        res = await ac.post("/api/contributions", json=payload)
        assert res.status_code == 201
        contrib = res.json()
        assert contrib["status"] == "PENDING"
        contrib_id = contrib["id"]

        login_res = await ac.post("/api/admin/login", json={
            "username": "admin",
            "password": "ParamparaAdmin@2026"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        list_res = await ac.get("/api/admin/contributions?status=PENDING", headers=headers)
        assert list_res.status_code == 200
        pending = list_res.json()
        assert any(c["id"] == contrib_id for c in pending)

        patch_res = await ac.patch(f"/api/admin/contributions/{contrib_id}", json={
            "status": "APPROVED",
            "reviewer_notes": "Verified against INTACH Dahanu field documentation."
        }, headers=headers)
        assert patch_res.status_code == 200
        updated = patch_res.json()
        assert updated["status"] == "APPROVED"
        assert updated["reviewer_notes"] == "Verified against INTACH Dahanu field documentation."

        stats_res = await ac.get("/api/admin/stats", headers=headers)
        assert stats_res.status_code == 200
        stats = stats_res.json()
        assert stats["total_traditions"] == 4
        assert stats["approved_contributions"] >= 1

        # Verify that the approved contribution now appears in GET /api/traditions/warli
        warli_res = await ac.get("/api/traditions/warli")
        assert warli_res.status_code == 200
        warli_detail = warli_res.json()
        assert len(warli_detail["approved_contributions"]) >= 1
        assert any(c["id"] == contrib_id for c in warli_detail["approved_contributions"])


@pytest.mark.asyncio
async def test_traditions_filtering():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Filter by region
        north_res = await ac.get("/api/traditions?region=North")
        assert north_res.status_code == 200
        assert len(north_res.json()) == 1
        assert north_res.json()[0]["slug"] == "thathera"

        # Filter by category
        craft_res = await ac.get("/api/traditions?category=Craft")
        assert craft_res.status_code == 200
        assert any(t["slug"] == "thathera" for t in craft_res.json())

        # Filter by experience
        ar_res = await ac.get("/api/traditions?experience=AR")
        assert ar_res.status_code == 200
        assert len(ar_res.json()) == 1
        assert ar_res.json()[0]["slug"] == "warli"

        interactive_res = await ac.get("/api/traditions?experience=Interactive")
        assert interactive_res.status_code == 200
        assert len(interactive_res.json()) == 3


@pytest.mark.asyncio
async def test_all_experiences():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Toda Motif Explorer
        toda_res = await ac.get("/api/traditions/toda/experience")
        assert toda_res.status_code == 200
        toda_exp = toda_res.json()
        assert toda_exp["type"] == "MOTIF_EXPLORER"
        assert len(toda_exp["items"]) >= 4

        # Chhau Performance Explorer
        chhau_res = await ac.get("/api/traditions/chhau/experience")
        assert chhau_res.status_code == 200
        chhau_exp = chhau_res.json()
        assert chhau_exp["type"] == "PERFORMANCE_EXPLORER"
        assert len(chhau_exp["items"]) >= 3

        # Warli AR Story
        warli_res = await ac.get("/api/traditions/warli/experience")
        assert warli_res.status_code == 200
        warli_exp = warli_res.json()
        assert warli_exp["type"] == "AR_STORY"


@pytest.mark.asyncio
async def test_sources_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        sources_res = await ac.get("/api/sources")
        assert sources_res.status_code == 200
        sources = sources_res.json()
        assert len(sources) >= 8

        first_id = sources[0]["id"]
        single_res = await ac.get(f"/api/sources/{first_id}")
        assert single_res.status_code == 200
        assert single_res.json()["id"] == first_id

        # 404 on invalid source
        not_found_res = await ac.get("/api/sources/999999")
        assert not_found_res.status_code == 404


@pytest.mark.asyncio
async def test_admin_auth_security():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Invalid login
        bad_login = await ac.post("/api/admin/login", json={
            "username": "admin",
            "password": "WrongPassword123"
        })
        assert bad_login.status_code == 401

        # Unauthorized access to protected route
        unauth_res = await ac.get("/api/admin/contributions")
        assert unauth_res.status_code == 401


@pytest.mark.asyncio
async def test_qr_code_generation_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Default tradition QR
        res = await ac.get("/api/qr/warli")
        assert res.status_code == 200
        assert res.headers["content-type"] == "image/png"
        assert res.content[:4] == b"\x89PNG"
        assert "scan/warli" in res.headers.get("x-qr-target-url", "")

        # Custom base_url
        res_custom = await ac.get("/api/qr/thathera?base_url=https://parampara-api-oocd.onrender.com")
        assert res_custom.status_code == 200
        assert res_custom.headers.get("x-qr-target-url") == "https://parampara-api-oocd.onrender.com/scan/thathera"

        # Invalid slug returns 404
        res_invalid = await ac.get("/api/qr/unknown-slug")
        assert res_invalid.status_code == 404

        # Custom dynamic URL generator
        res_dyn = await ac.get("/api/qr/dynamic/generate?url=https://parampara-api-oocd.onrender.com/scan/toda")
        assert res_dyn.status_code == 200
        assert res_dyn.headers["content-type"] == "image/png"


@pytest.mark.asyncio
async def test_contributor_auth_and_submissions():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Register a new contributor
        reg_res = await ac.post("/api/contributions/auth/register", json={
            "username": "test_artisan_2026",
            "email": "artisan@heritage.org",
            "password": "ArtisanPassword2026!"
        })
        assert reg_res.status_code in [201, 400]  # 400 if already created in persistent db
        
        # Login
        login_res = await ac.post("/api/contributions/auth/login", json={
            "username_or_email": "test_artisan_2026",
            "password": "ArtisanPassword2026!"
        })
        assert login_res.status_code == 200
        token_data = login_res.json()
        assert "access_token" in token_data
        token = token_data["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # Check me
        me_res = await ac.get("/api/contributions/auth/me", headers=auth_headers)
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["username"] == "test_artisan_2026"
        assert me_data["is_admin"] is False

        # Submit contribution with auth token
        sub_res = await ac.post("/api/contributions", headers=auth_headers, json={
            "contributor_name": "Ramesh Artisan",
            "email": "artisan@heritage.org",
            "tradition_name": "Kashmir Pashmina Shawl Weaving",
            "region": "North",
            "location": "Srinagar, Jammu & Kashmir",
            "description": "Traditional hand-spun and hand-woven fine cashmere wool weaving on wooden pit looms.",
            "cultural_significance": "Century old craft tradition preserved across generations in Kashmir valley.",
            "consent_given": True
        })
        assert sub_res.status_code == 201
        new_contrib = sub_res.json()
        assert new_contrib["user_id"] == me_data["id"]

        # View my-submissions
        my_res = await ac.get("/api/contributions/my-submissions", headers=auth_headers)
        assert my_res.status_code == 200
        my_items = my_res.json()
        assert any(item["tradition_name"] == "Kashmir Pashmina Shawl Weaving" for item in my_items)


@pytest.mark.asyncio
async def test_admin_quizzes_and_hotspots_mastery():
    import os
    transport = ASGITransport(app=app)
    admin_pass = os.getenv("ADMIN_PASSWORD") or os.getenv("ADMIN_DEFAULT_PASSWORD") or "ParamparaAdmin@2026"
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        admin_login = await ac.post("/api/admin/login", json={
            "username": "admin",
            "password": admin_pass
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # 1. Test Admin Quizzes endpoint
        quizzes_res = await ac.get("/api/admin/quizzes", headers=admin_headers)
        assert quizzes_res.status_code == 200
        quizzes = quizzes_res.json()
        assert len(quizzes) >= 4
        first_quiz = quizzes[0]

        # Add question to first quiz
        new_q_res = await ac.post(f"/api/admin/quizzes/{first_quiz['id']}/questions", headers=admin_headers, json={
            "question_text": "What material is traditionally used for shaping utensils?",
            "explanation": "Wooden mallets and stone anvils are traditionally utilized by the artisans.",
            "order_index": 99,
            "options": [
                {"option_text": "Wooden mallets and anvils", "is_correct": True, "order_index": 0},
                {"option_text": "Plastic molds", "is_correct": False, "order_index": 1}
            ]
        })
        assert new_q_res.status_code == 201
        created_q = new_q_res.json()
        q_id = created_q["id"]

        # Update question
        update_q_res = await ac.patch(f"/api/admin/questions/{q_id}", headers=admin_headers, json={
            "explanation": "Updated institutional archival explanation from National ICH dossier."
        })
        assert update_q_res.status_code == 200
        assert "Updated institutional" in update_q_res.json()["explanation"]

        # Delete question
        del_q_res = await ac.delete(f"/api/admin/questions/{q_id}", headers=admin_headers)
        assert del_q_res.status_code == 200

        # 2. Test Admin Hotspots endpoint
        hotspots_res = await ac.get("/api/admin/hotspots", headers=admin_headers)
        assert hotspots_res.status_code == 200
        hotspots = hotspots_res.json()
        assert len(hotspots) >= 6
        first_hotspot = hotspots[0]

        # Update hotspot
        h_id = first_hotspot["id"]
        update_h_res = await ac.patch(f"/api/admin/hotspots/{h_id}", headers=admin_headers, json={
            "content": first_hotspot["content"]
        })
        assert update_h_res.status_code == 200
