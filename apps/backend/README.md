# 🏰 EBUDDY Backend API

This is the backend service for the **EBUDDY Technical Test**, built using:

- **TypeScript + Express.js** (REST API)
- **Firebase Authentication** (User Login & Authorization)
- **Firestore** (Database)
- **Firebase Admin SDK** (Token Validation)
- **Jest + Supertest** (Unit Testing)

This API includes: ✅ **User Authentication** (Login with Firebase)\
✅ **Fetching User Data (By ID and All Users)**\
✅ **Updating User Data (PUT Method)**\
✅ **Auto-Generated User IDs in Firestore**\
✅ **Audit Logging** (Firestore)\
✅ **Secure API with JWT Authentication**\
✅ **Unit Tests for API Validation**

---

## **👤 Example User**

All examples use this sample user:

```json
{
  "id": "D1NQAWRWWDdUsIeMRCac",
  "name": "Agus Riyanto",
  "email": "denagus007@gmail.com",
  "totalAverageWeightRatings": 4.5,
  "numberOfRents": 30,
  "recentlyActive": 1738938812
}
```

---

## **📚 Project Structure**

```sh
backend-repo/
├── src/
│   ├── config/           # Firebase configuration
│   ├── controller/       # API controllers (Auth & User)
│   ├── core/             # Main app setup
│   ├── middleware/       # Authentication middleware
│   ├── repository/       # Database layer (Firestore)
│   ├── routes/           # API routes
│   ├── utils/            # Utilities (Logging, API Response)
│   ├── index.ts          # Main entry point
├── tests/                # Unit & integration tests
├── .env                  # Environment variables
├── package.json          # Dependencies
├── README.md             # Project documentation
```

## 🚀 Setup & Installation

Follow these steps to set up and run the project.

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/ebuddy-backend.git
cd ebuddy-backend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```sh
# Server Port
PORT=8011

# Firebase Admin Credentials
FIREBASE_CREDENTIAL_PATH=src/config/ebuddy-backend-firebase-adminsdk.json
FIREBASE_API_KEY=AIzaSyC1dggyvDLDlXVEwF4C5g-XdUpTw-isAiw

# Enable Firebase Emulator for Local Testing
USE_FIREBASE_EMULATOR=true
FIREBASE_PROJECT_ID=ebuddy-technical-test-50414
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIREBASE_FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
```

✅ **Ensure you have your Firebase Admin SDK JSON file** in `src/config/`.

---

## 🔥 Running the Server

Start the backend:

# 🚀 Running the Development Server with Firebase Emulator

To start the backend server **with Firebase Emulator**, run:

```sh
npm run dev && firebase emulators:start --only firestore,auth --project=ebuddy-technical-test-50414
```

```sh
npm start
```

✅ **Server will start on** `http://localhost:8011/`.

---

## 🛠 Running Unit Tests

To run tests:

```sh
npm test
```

✅ This will execute **Jest + Supertest API tests**.

---

## 💻 API Endpoints & Testing

### 1️⃣ Login & Get Token

```sh
curl -X POST http://localhost:8011/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "denagus007@gmail.com",
           "password": "Admin12#"
         }'
```

✅ **Copy the **`` from the response.

---

### 2️⃣ Fetch User Data (By ID)

```sh
curl -X GET http://localhost:8011/api/v1/fetch-user-data/D1NQAWRWWDdUsIeMRCac \
     -H "Authorization: Bearer YOUR_ID_TOKEN"
```

✅ **Replace **``** with the token from the login response**.

---

### 3️⃣ Fetch All Users

```sh
curl -X GET http://localhost:8011/api/v1/fetch-all-users \
     -H "Authorization: Bearer YOUR_ID_TOKEN"
```

✅ **Returns a list of all users.**

---

### 4️⃣ Create a New User (Firestore Auto-Generated ID)

```sh
curl -X POST http://localhost:8011/api/v1/add-user \
     -H "Authorization: Bearer YOUR_ID_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
  "name": "Agus Riyanto",
  "email": "denagus007@gmail.com",
  "totalAverageWeightRatings": 4.5,
  "numberOfRents": 30,
  "recentlyActive": 1738938812
}'
```

✅ **The response will include the auto-generated **``** from Firestore.**

---

### 5️⃣ Update User Data (PUT Method)

```sh
curl -X PUT http://localhost:8011/api/v1/update-user-data/D1NQAWRWWDdUsIeMRCac \
     -H "Authorization: Bearer YOUR_ID_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
    "name": "Agus Riyanto Updated"
}'
```

✅ **Updates the user’s name.**

---

## 🖊 Notes for Assessor

- **Check Firebase Console → Authentication** to verify registered users.
- **Audit logs are stored in Firestore** under the `AUDIT_LOGS` collection.
- **Use Postman or cURL** for API testing.

---

## 📩 Contact

If you have any questions, please contact:\
📧 [**denagus007@gmail.com**](mailto\:denagus007@gmail.com)

