import pytest
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
