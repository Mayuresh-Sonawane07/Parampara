import urllib.request
import json
import sys

def run_tests():
    base_urls = ["http://127.0.0.1:8000", "http://localhost:5173"]
    all_passed = True

    for base in base_urls:
        print(f"\n==========================================")
        print(f" Auditing Endpoints via: {base}")
        print(f"==========================================")

        try:
            # 1. Health check
            req = urllib.request.Request(f"{base}/api/health")
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                print(f"[PASS] 1. GET /api/health -> HTTP {resp.status} ({data['status']})")

            # 2. Traditions list
            req = urllib.request.Request(f"{base}/api/traditions")
            with urllib.request.urlopen(req) as resp:
                traditions = json.loads(resp.read().decode())
                slugs = [t["slug"] for t in traditions]
                print(f"[PASS] 2. GET /api/traditions -> HTTP {resp.status} ({len(traditions)} traditions: {slugs})")

            # 3. Warli Tradition Detail with Hotspots
            req = urllib.request.Request(f"{base}/api/traditions/warli")
            with urllib.request.urlopen(req) as resp:
                warli = json.loads(resp.read().decode())
                hotspots = warli.get("ar_experience", {}).get("hotspots", [])
                print(f"[PASS] 3. GET /api/traditions/warli -> HTTP {resp.status} ({len(hotspots)} hotspots mapped)")
                for h in hotspots:
                    print(f"         - Motif #{h['id']}: {h['name']}")

            # 4. Warli Quiz
            req = urllib.request.Request(f"{base}/api/traditions/warli/quiz")
            with urllib.request.urlopen(req) as resp:
                quiz = json.loads(resp.read().decode())
                print(f"[PASS] 4. GET /api/traditions/warli/quiz -> HTTP {resp.status} ({len(quiz)} questions)")

            # 5. Sources list
            req = urllib.request.Request(f"{base}/api/sources")
            with urllib.request.urlopen(req) as resp:
                sources = json.loads(resp.read().decode())
                print(f"[PASS] 5. GET /api/sources -> HTTP {resp.status} ({len(sources)} sources verified)")

            # 6. Post a Community Contribution
            contrib_payload = json.dumps({
                "contributor_name": "Audit Verifier",
                "email": "verifier@parampara.org",
                "tradition_name": "Warli Painting",
                "region": "Maharashtra",
                "location": "Palghar Tribal Belt",
                "description": "Field documentation of rice-paste and geru ochre mural practices on Karvi bamboo thatch walls during marriage rituals.",
                "cultural_significance": "Celebrates communal harmony and ancestral nature veneration.",
                "consent_given": True
            }).encode()
            req = urllib.request.Request(f"{base}/api/contributions", data=contrib_payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req) as resp:
                created_contrib = json.loads(resp.read().decode())
                contrib_id = created_contrib["id"]
                print(f"[PASS] 6. POST /api/contributions -> HTTP {resp.status} (Created ID #{contrib_id}, Status: {created_contrib['status']})")

            # 7. Get Contribution by ID
            req = urllib.request.Request(f"{base}/api/contributions/{contrib_id}")
            with urllib.request.urlopen(req) as resp:
                fetched_contrib = json.loads(resp.read().decode())
                print(f"[PASS] 7. GET /api/contributions/{contrib_id} -> HTTP {resp.status} ('{fetched_contrib['tradition_name']}')")

            # 8. Admin Login with default credentials
            login_payload = json.dumps({"username": "admin", "password": "ParamparaAdmin@2026"}).encode()
            req = urllib.request.Request(f"{base}/api/admin/login", data=login_payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req) as resp:
                token_resp = json.loads(resp.read().decode())
                token = token_resp["access_token"]
                print(f"[PASS] 8. POST /api/admin/login -> HTTP {resp.status} (JWT Access Token received)")

            # 9. Admin Stats
            req = urllib.request.Request(f"{base}/api/admin/stats", headers={"Authorization": f"Bearer {token}"})
            with urllib.request.urlopen(req) as resp:
                stats = json.loads(resp.read().decode())
                print(f"[PASS] 9. GET /api/admin/stats -> HTTP {resp.status} (Stats: {stats})")

            # 10. Admin Contributions List
            req = urllib.request.Request(f"{base}/api/admin/contributions", headers={"Authorization": f"Bearer {token}"})
            with urllib.request.urlopen(req) as resp:
                admin_contribs = json.loads(resp.read().decode())
                print(f"[PASS] 10. GET /api/admin/contributions -> HTTP {resp.status} ({len(admin_contribs)} total submissions)")

            # 11. Admin Review Action (Approve the contribution)
            review_payload = json.dumps({
                "status": "APPROVED",
                "reviewer_notes": "Verified against INTACH Dahanu field records."
            }).encode()
            req = urllib.request.Request(f"{base}/api/admin/contributions/{contrib_id}", data=review_payload, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }, method="PATCH")
            with urllib.request.urlopen(req) as resp:
                updated_c = json.loads(resp.read().decode())
                print(f"[PASS] 11. PATCH /api/admin/contributions/{contrib_id} -> HTTP {resp.status} (New Status: {updated_c['status']})")

            # 12-14. Regional Spoken Audio Narration for English, Hindi, and Marathi
            sample_texts = {
                "en": "The sacred Warli circle dance represents ecological cosmic harmony.",
                "hi": "वारली चित्रकला में गोल घेरा प्रकृति और जीवन के चक्र को दर्शाता है।",
                "mr": "वारली चित्रकलेतील वर्तुळाकार नृत्य निसर्ग आणि विश्वाचे प्रतीक आहे."
            }
            for lang, lang_name in [("en", "English"), ("hi", "Hindi"), ("mr", "Marathi")]:
                sample = urllib.parse.quote(sample_texts[lang])
                url = f"{base}/api/narration/audio?text={sample}&lang={lang}"
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req) as resp:
                    audio_data = resp.read()
                    print(f"[PASS] 12. GET /api/narration/audio?lang={lang} ({lang_name}) -> HTTP {resp.status} ({len(audio_data)} audio bytes, content-type: {resp.headers.get('Content-Type')})")

        except Exception as e:
            print(f"[FAIL] Error testing {base}: {e}")
            all_passed = False

    if all_passed:
        print("\n===========================================================")
        print(">>> ALL 14 AUDIT SUITES PASSED ON BACKEND AND VITE PROXY! <<<")
        print("===========================================================\n")
    else:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
