Saraha - Anonymous Messaging App

Saraha is a Node.js application for anonymous messaging, inspired by apps like "Sarahah". Users can sign up, log in, send and receive messages anonymously, and verify their email via OTP. The app now supports JWT authentication, role-based authorization, and Google OAuth login/signup.

Features

User signup and login with secure password hashing.

Google OAuth2 signup/login (login with Google account).

JWT-based authentication for secure API access.

Role-based access control (Admin/User) for protecting routes.

OTP verification for email confirmation (valid for 5 minutes).

Send and receive anonymous messages.

MongoDB integration for storing users and messages.

Optional image uploads (using Multer).

Clean project structure with controllers, services, and reusable DB utilities.

Standardized error and success responses.

Tech Stack

Node.js (Express.js)

MongoDB (Mongoose)

Nodemailer (for sending OTP emails)

bcrypt (for password hashing)

dotenv (for environment variables)

JSON Web Tokens (JWT) for authentication

Google OAuth2 for social login

Multer for image uploads