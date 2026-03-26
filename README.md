# 🛡️ Saraha - Advanced Anonymous Messaging API

An industrial-grade Node.js backend application for anonymous messaging, inspired by apps like "Sarahah". This version is heavily optimized for **Security**, **Scalability**, and **High Availability** using modern architectural patterns.

---

## 🚀 Key Features

### 🔐 Security & Authentication
* **Dual Auth Strategy:** Support for standard Email/Password and **Google OAuth 2.0** social login.
* **JWT Ecosystem:** Secure session management with Access & Refresh tokens.
* **Password Hashing:** Industry-standard encryption using `bcrypt`.
* **RBAC (Role-Based Access Control):** Granular permission system for **Admin** and **User** roles.

### ⚡ Performance & Reliability
* **Redis Integration:** High-speed caching for OTP management and session blacklisting.
* **Smart Rate Limiting:** Advanced protection against Brute-force and DoS attacks (via Redis).
* **OTP Verification:** Secure email confirmation system with a strictly enforced 5-minute TTL.

### 📩 Messaging & Media
* **True Anonymity:** Robust logic for sending and receiving messages without compromising sender identity.
* **Media Handling:** Scalable file upload utility (via `Multer`) with custom MIME-type validation for Images, Audio, and Video.

### 🏗️ Architecture
* **Modular Design:** Clean separation of concerns (Controllers, Services, Repositories).
* **Unified Responses:** Standardized JSON success/error structures for seamless Frontend integration.
* **Global Error Handling:** Centralized middleware to capture and log exceptions.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js (Express.js) |
| **Database** | MongoDB (Mongoose) |
| **Caching/Rates** | **Redis** (OTP & Rate Limiting) |
| **Auth** | JWT, Passport.js (Google OAuth2) |
| **Storage** | Multer (Custom MIME Validation) |
| **Emailing** | Nodemailer |
| **Security** | Bcrypt, Helmet, CORS |

---

## 📂 Project Structure

```text
├── src/
│   ├── controllers/    # Request handling logic
│   ├── services/       # Business logic & Database interactions
│   ├── middlewares/    # Auth, Validation, & Rate-limiting
│   ├── models/         # Mongoose schemas
│   ├── utils/          # Reusable helpers (Redis, Multer, JWT)
│   ├── config/         # Environment & DB configurations
│   └── app.js          # Main entry point
├── uploads/            # Local storage for media files
└── .env                # Secret keys & Configurations

🔌 API Endpoints (Quick Reference)
🔑 Authentication
POST /auth/signup - Register a new user (triggers OTP).

POST /auth/login - Standard login (Email/Password).

GET /auth/google - Google OAuth2 login entry.

POST /auth/verify-otp - Confirm email via 6-digit code.

📩 Messages
POST /messages/send - Send an anonymous message to a user.

GET /messages/inbox - Retrieve received messages (Auth Required).

DELETE /messages/:id - Remove a message.

👤 User Profile
GET /user/me - Get current user info.

PATCH /user/update - Update profile details or upload avatar.

⚙️ Environment Variables
To run this project, you will need to add the following variables to your .env file:

مقتطف الرمز
PORT=3000
MONGO_URI=your_mongodb_connection
REDIS_URL=your_redis_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
🚦 Getting Started
Clone the repository:

Bash
git clone https://github.com/Mokhtar-Mohammed-Ali/saraha-api.git
Install dependencies:

Bash
npm install
Run in development mode:

Bash
npm run dev
