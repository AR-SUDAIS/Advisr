import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000"

async def test_backend():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # 1. Register
        reg_data = {
            "name": "Test Student",
            "reg_no": "TEST001",
            "email": "test@example.com",
            "current_semester": 3,
            "password": "password123"
        }
        print(f"Registering user: {reg_data['reg_no']}")
        response = await client.post("/register", json=reg_data)
        if response.status_code == 400 and "already exists" in response.text:
             print("User already exists, proceeding to login...")
        elif response.status_code != 200:
            print(f"Registration failed: {response.text}")
            return
        else:
            print("Registration successful!")

        # 2. Login
        login_data = {
            "username": "TEST001",
            "password": "password123"
        }
        print(f"Logging in user: {login_data['username']}")
        response = await client.post("/token", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
        
        token_info = response.json()
        access_token = token_info["access_token"]
        print("Login successful! Token received.")

        # 3. Get User Profile
        headers = {"Authorization": f"Bearer {access_token}"}
        print("Fetching user profile...")
        response = await client.get("/users/me", headers=headers)
        if response.status_code != 200:
            print(f"Failed to get profile: {response.text}")
        else:
            print(f"Profile retrieved: {response.json()}")

        # 4. Chat
        chat_msg = {"message": "Hello, what semester am I in?"}
        print(f"Sending chat message: {chat_msg['message']}")
        response = await client.post("/chat", json=chat_msg, headers=headers)
        if response.status_code != 200:
            print(f"Chat failed: {response.text}")
        else:
            print(f"Chat response: {response.json()}")

if __name__ == "__main__":
    asyncio.run(test_backend())
