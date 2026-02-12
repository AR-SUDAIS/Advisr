import httpx
import asyncio
import random

BASE_URL = "http://127.0.0.1:8000"

async def test_semester_flow():
    # Use simple random number to avoid collision in repeated runs
    rand_suff = random.randint(1000, 9999)
    reg_no = f"SEMTEST{rand_suff}"
    email = f"semtest{rand_suff}@example.com"
    
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        print(f"--- Starting Semester Flow Verification for {reg_no} ---")

        # 1. Register
        reg_data = {
            "name": "Semester Test Student",
            "reg_no": reg_no,
            "email": email,
            "password": "password123"
        }
        print(f"\n1. Registering user...")
        response = await client.post("/register", json=reg_data)
        if response.status_code != 200:
            print(f"Registration failed: {response.text}")
            return
        print("Registration successful!")

        # 2. Login
        login_data = {
            "username": reg_no,
            "password": "password123"
        }
        print(f"\n2. Logging in...")
        response = await client.post("/token", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
        
        token_info = response.json()
        access_token = token_info["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        print("Login successful!")

        # 3. Add Subjects (Semester 1)
        print(f"\n3. Adding subjects for Semester 1...")
        subjects_to_add = [
            {"name": "Intro to CS", "code": "CS101", "credits": 4},
            {"name": "Calculus I", "code": "MA101", "credits": 3}
        ]
        
        for sub in subjects_to_add:
            resp = await client.post("/users/me/subjects", json=sub, headers=headers)
            if resp.status_code == 200:
                print(f"Added {sub['code']}: OK")
            else:
                print(f"Failed to add {sub['code']}: {resp.text}")

        # 4. Verify Subjects Listed
        print(f"\n4. Verifying subjects list...")
        resp = await client.get("/users/me/subjects", headers=headers)
        current_subjects = resp.json()
        print(f"Current subjects: {len(current_subjects)}")
        if len(current_subjects) != 2:
            print("ERROR: Expected 2 subjects")
            return
        
        # 5. Complete Semester 1
        print(f"\n5. Completing Semester 1...")
        grades = {
            "CS101": "A",
            "MA101": "B"
        }
        resp = await client.post("/users/me/complete-semester", json=grades, headers=headers)
        if resp.status_code == 200:
            print("Semester completed: OK")
            print(resp.json())
        else:
            print(f"Failed to complete semester: {resp.text}")
            return

        # 6. Verify New Semester State
        print(f"\n6. Verifying new semester state...")
        resp = await client.get("/users/me", headers=headers)
        user_profile = resp.json()
        print(f"Current Semester is now: {user_profile['current_semester']}")
        
        if user_profile['current_semester'] != 2:
             print("ERROR: Semester did not increment")
        
        # Verify subjects list is empty for new semester
        resp = await client.get("/users/me/subjects", headers=headers)
        new_subjects = resp.json()
        print(f"New semester subjects count: {len(new_subjects)}")
        if len(new_subjects) != 0:
             print("ERROR: Expected 0 subjects for new semester")

        # 7. Verify History
        print(f"\n7. Verifying academic history...")
        resp = await client.get("/users/me/history", headers=headers)
        history = resp.json()
        print(f"History entries: {len(history)}")
        
        if len(history) > 0:
            sem1 = history[0] # Assuming it's the first one pushed or filtered
            # Note: history returns list of semester objects
            # We need to find sem 1
            sem1_data = next((s for s in history if s['semester_number'] == 1), None)
            
            if sem1_data:
                print("Found Semester 1 record.")
                print(f"Subjects in history: {len(sem1_data['subjects'])}")
                # Check grades
                for sub in sem1_data['subjects']:
                    print(f"  {sub['code']}: {sub.get('grade')}")
            else:
                print("ERROR: Semester 1 not found in history")
        else:
             print("ERROR: History is empty")
             
        print("\n--- Verification Complete ---")

if __name__ == "__main__":
    asyncio.run(test_semester_flow())
