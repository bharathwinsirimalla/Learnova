# Learnova - AI-Powered Learning Management System

Learnova is a full-stack AI-powered Learning Management System built with the MERN stack. It supports student and instructor workflows, secure authentication, course management, payments, media uploads, reviews, and responsive learning dashboards.

Gemini is integrated into course search as an optional backend feature. When `GEMINI_API_KEY` is configured, Learnova expands natural-language student searches into useful course keywords before querying published courses. When the key is not configured, search falls back to the existing database keyword search, so current deployments continue to run without changes.

---

## Features

- JWT authentication and Google OAuth with Firebase
- Student and instructor role-based access
- AI-powered course search with Gemini keyword expansion
- Voice input and read-aloud support on the course search page
- Razorpay payment gateway integration
- Cloudinary media uploads
- OTP and password reset email flow
- Course and lecture management
- Course reviews and ratings
- Redux Toolkit global state management
- Responsive UI with Tailwind CSS

---

## Tech Stack

### Frontend

- React.js
- Redux Toolkit
- Tailwind CSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication

### Services and Integrations

- Gemini API
- Firebase Authentication
- Razorpay
- Cloudinary
- Nodemailer/Brevo email

---

## Getting Started

```bash
git clone https://github.com/bharathwinsirimalla/Learnova.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### `/backend/.env`

```env
PORT=
MONGODB_URL=
JWT_SECRET=
USER_EMAIL=
USER_PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=

# Optional AI search integration.
# If omitted, Learnova uses normal database search and deployment still works.
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
```

### `/frontend/.env`

```env
VITE_BACKEND_URL=
VITE_FIREBASE_APIKEY=
VITE_RAZORPAY_KEY_ID=
```

---

## Gemini Integration

The course search endpoint uses Gemini only on the backend. The API key is never exposed to the frontend.

- Endpoint: `POST /api/course/search`
- Request body: `{ "input": "beginner frontend projects" }`
- Behavior with Gemini: expands the search into relevant course keywords, then searches published courses.
- Behavior without Gemini: searches published courses using the original input only.

This keeps the deployment process unchanged. To enable AI search in production, add `GEMINI_API_KEY` to the backend environment variables in your hosting dashboard and redeploy the backend. No new package install is required for the Gemini integration.

---

## API Reference

Base URL:

```bash
http://localhost:{PORT}/api
```

### Authentication Routes - `/api/auth`

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/signup`        | Register user         |
| POST   | `/login`         | Login user            |
| GET    | `/logout`        | Logout user           |
| POST   | `/sendotp`       | Send OTP              |
| POST   | `/verifyotp`     | Verify OTP            |
| POST   | `/resetpassword` | Reset password        |
| POST   | `/googleauth`    | Google authentication |

### Course Routes - `/api/course`

| Method | Endpoint                    | Auth | Description              |
| ------ | --------------------------- | ---- | ------------------------ |
| POST   | `/create`                   | Yes  | Create course            |
| GET    | `/getpublished`             | No   | Get published courses    |
| GET    | `/getcreator`               | Yes  | Get instructor courses   |
| POST   | `/editcourse/:courseId`     | Yes  | Edit course              |
| GET    | `/getcoursebyid/:courseId`  | Yes  | Get course by ID         |
| GET    | `/viewcourse/:courseId`     | No   | Public course view       |
| DELETE | `/remove/:courseId`         | Yes  | Delete course            |
| POST   | `/createlecture/:courseId`  | Yes  | Add lecture              |
| GET    | `/courselecture/:courseId`  | Yes  | Get course lectures      |
| GET    | `/lecture/:lectureId`       | Yes  | Get lecture              |
| POST   | `/editlecture/:lectureId`   | Yes  | Edit lecture             |
| POST   | `/removelecture/:lectureId` | Yes  | Remove lecture           |
| POST   | `/search`                   | No   | AI-powered course search |

### Payment Routes - `/api/order`

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| POST   | `/razorpay-order` | Create Razorpay order        |
| POST   | `/verifypayment`  | Verify payment and enroll    |

### Review Routes - `/api/review`

| Method | Endpoint                | Auth | Description        |
| ------ | ----------------------- | ---- | ------------------ |
| POST   | `/createreview`         | Yes  | Create review      |
| GET    | `/getreviews/:courseId` | No   | Get course reviews |
| GET    | `/recent`               | No   | Get recent reviews |

### User Routes - `/api/user`

| Method | Endpoint            | Auth | Description          |
| ------ | ------------------- | ---- | -------------------- |
| GET    | `/getcurrentuser`   | Yes  | Get current user     |
| GET    | `/enrolled-courses` | Yes  | Get enrolled courses |
| POST   | `/profile`          | Yes  | Update profile       |

---

## Future Enhancements

- Live classes
- Certificate generation
- Course analytics dashboard
- Personalized AI recommendations
- Progress tracking system

---

## Author

GitHub: https://github.com/bharathwinsirimalla

LinkedIn: https://www.linkedin.com/in/bharathwinsirimalla/
