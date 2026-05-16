# 🚀 Learnova — Learning Management System

Learnova is a full-stack Learning Management System (LMS) built using the MERN stack, designed for seamless online learning with dual-role access for Students and Instructors.

The platform includes secure authentication, course search, Razorpay payment integration, media uploads, OTP-based password reset, and fully responsive dashboards for modern e-learning experiences.

---

## ✨ Features

* 🔐 JWT Authentication & Google OAuth (Firebase)
* 👨‍🎓 Student & Instructor Role-Based Access
* 💳 Razorpay Payment Gateway Integration
* ☁️ Cloudinary Media Uploads
* 📧 OTP & Password Reset via Nodemailer
* 📚 Course & Lecture Management
* ⭐ Course Reviews & Ratings
* ⚡ Redux Toolkit Global State Management
* 📱 Fully Responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Services & Integrations

* Firebase Authentication
* Razorpay
* Cloudinary
* BrevoAPI

---

## 🚀 Getting Started

```bash
git clone https://github.com/bharathwinsirimalla/Learnova.git

cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### `/backend/.env`

```env
PORT=
MONGODB_URL=
JWT_SECRET=
BREVO_API_KEY=
BREVO_SENDER_NAME=
BREVO_SENDER_EMAIL=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### `/frontend/.env`

```env
VITE_FIREBASE_APIKEY=
VITE_RAZORPAY_KEY_ID=
VITE_BACKEND_URL=
```

---

## 📌 API Reference

Base URL:

```bash
http://localhost:{PORT}/api
```

### Authentication Routes — `/api/auth`

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/signup`        | Register User         |
| POST   | `/login`         | Login User            |
| GET    | `/logout`        | Logout User           |
| POST   | `/sendotp`       | Send OTP              |
| POST   | `/verifyotp`     | Verify OTP            |
| POST   | `/resetpassword` | Reset Password        |
| POST   | `/googleauth`    | Google Authentication |

---

### Course Routes — `/api/course`

| Method | Endpoint                    | Auth | Description            |
| ------ | --------------------------- | ---- | ---------------------- |
| POST   | `/create`                   | ✅    | Create Course          |
| GET    | `/getpublished`             | ❌    | Get Published Courses  |
| GET    | `/getcreator`               | ✅    | Get Instructor Courses |
| POST   | `/editcourse/:courseId`     | ✅    | Edit Course            |
| GET    | `/getcoursebyid/:courseId`  | ✅    | Get Course by ID       |
| GET    | `/viewcourse/:courseId`     | ❌    | Public Course View     |
| DELETE | `/remove/:courseId`         | ✅    | Delete Course          |
| POST   | `/createlecture/:courseId`  | ✅    | Add Lecture            |
| GET    | `/courselecture/:courseId`  | ✅    | Get Course Lectures    |
| GET    | `/lecture/:lectureId`       | ✅    | Get Lecture            |
| POST   | `/editlecture/:lectureId`   | ✅    | Edit Lecture           |
| POST   | `/removelecture/:lectureId` | ✅    | Remove Lecture         |
| POST   | `/search`                   | ❌    | AI-Powered Search      |

---

### Payment Routes — `/api/payment`

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| POST   | `/razorpay-order` | Create Razorpay Order        |
| POST   | `/verifypayment`  | Verify Payment & Enroll User |

---

### Review Routes — `/api/review`

| Method | Endpoint                | Auth | Description        |
| ------ | ----------------------- | ---- | ------------------ |
| POST   | `/createreview`         | ✅    | Create Review      |
| GET    | `/getreviews/:courseId` | ❌    | Get Course Reviews |
| GET    | `/recent`               | ❌    | Get Recent Reviews |

---

### User Routes — `/api/user`

| Method | Endpoint            | Auth | Description          |
| ------ | ------------------- | ---- | -------------------- |
| GET    | `/getcurrentuser`   | ✅    | Get Current User     |
| GET    | `/enrolled-courses` | ✅    | Get Enrolled Courses |
| POST   | `/profile`          | ✅    | Update Profile       |

---

## 🚧 Future Enhancements

* AI Powered Search using GeminiAPI
* 🎥 Live Classes
* 📜 Certificate Generation
* 📊 Course Analytics Dashboard
* 🤖 Personalized AI Recommendations
* 📈 Progress Tracking System

---

## 👨‍💻 Author

GitHub: https://github.com/bharathwinsirimalla

LinkedIn: https://www.linkedin.com/in/bharathwinsirimalla/
