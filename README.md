# Saraha - Anonymous Messaging App

Saraha is a **Node.js application** for **anonymous messaging**, inspired by apps like "Sarahah". Users can sign up, log in, send and receive messages anonymously, and verify their email via OTP.

---

## **Features**

- User signup and login with secure password hashing.
- OTP verification for email confirmation (valid for 5 minutes).
- Send and receive **anonymous messages**.
- MongoDB integration for storing users and messages.
- Optional image uploads (using Multer).
- Role-based access control (Admin/User).
- Clean project structure with controllers, services, and reusable DB utilities.
- Standardized error and success responses.

---

## **Tech Stack**

- Node.js (Express.js)
- MongoDB (Mongoose)
- Nodemailer (for sending OTP emails)
- bcrypt (for password hashing)
- dotenv (for environment variables)
- (Optional) Multer for image uploads

---
