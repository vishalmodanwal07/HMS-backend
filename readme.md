# 🏥 Hospital Management System (HMS) – Backend

This is the **backend API** for the Hospital Management System built with the **MERN stack**.  
It provides secure REST APIs for managing users, patients, treatments, lab reports, and billing with **role-based access control**.  

---

## 🚀 Features

- 🔑 **Authentication & Authorization**
  - JWT-based login & register
  - Role-Based Access Control (**Admin, Doctor, Reception, Lab Staff**)
  - Secure cookie storage for tokens  

- 🧑‍⚕️ **Patient Management**
  - Register and manage patients
  - Assign doctors
  - Search, filter, and paginate patients  

- 💊 **Treatment Records (Doctor)**
  - Add/update diagnosis & medication
  - View patient medical history  

- 🧪 **Lab Reports (Lab Staff)**
  - Upload PDF/Image securely to **Cloudinary**
  - Attach reports to patients  

- 💵 **Billing (Reception/Admin)**
  - Generate invoices
  - Update payment status (`Pending`, `Paid`, `Partial`)
  - Download **Invoice as PDF**  

- 📊 **Admin Reports**
  - Download **Hospital Activity Report** as PDF
  - Metrics: Patients, Doctors, Revenue, Lab Reports  

---

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** + **bcrypt** for authentication
- **Multer** + **Cloudinary** for file uploads
- **PDFKit** for PDF generation

---

## 📂 Project Structure

HMS-backend/
│── src/
│ ├── config/ # DB, cloudinary, multer configs
│ ├── controllers/ # Route handlers (auth, patients, lab, billing, admin)
│ ├── middleware/ # Auth & role middleware
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routes
│ ├── utils/ # Helpers (ApiError, ApiResponse, asyncHandler)
│ └── server.js # Entry point
│── .env # Environment variables (not committed)
│── .env.example # Example env file
│── package.json

## ⚙️ Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/hms-backend.git
   cd hms-backend

2. install dependies

3. Create a .env file in the root and configure:

PORT=8000
MONGO_URI=your_mongo_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

HOSPITAL_NAME=My Hospital
CURRENCY_CODE=INR


Run the server

npm run dev   # for development (with nodemon)
npm start     # for production

📌 API Endpoints
🔑 Auth

POST /api/v1/auth/register → Register user

POST /api/v1/auth/login → Login

🧑‍⚕️ Patients

POST /api/v1/patients → Create patient (Reception/Admin)

GET /api/v1/patients → Get patients (with search & pagination)

GET /api/v1/patients/:id → Get patient by ID

PUT /api/v1/patients/:id → Update patient

DELETE /api/v1/patients/:id → Delete (Admin only)

💊 Treatments

POST /api/v1/treatments → Add treatment record (Doctor)

GET /api/v1/treatments/patient/:patientId → Get patient history

🧪 Lab Reports

POST /api/v1/labs/upload → Upload lab report (Lab/Admin)

GET /api/v1/labs/patient/:patientId → Get reports by patient

💵 Billing

POST /api/v1/bills → Create bill

GET /api/v1/bills/patient/:patientId → Get bills for patient

GET /api/v1/bills/:id → Get bill by ID

PUT /api/v1/bills/:id/status → Update bill status

GET /api/v1/bills/:id/invoice → Download invoice PDF