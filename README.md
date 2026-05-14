# Smart Job Portal

An elite, full-stack AI-driven job matching platform designed to connect visionary companies with top-tier talent. This application leverages a Spring Boot backend, a state-of-the-art React frontend, and a custom TF-IDF neural matching engine to provide an unparalleled recruiting experience.

## ✨ Features

- **Jaw-Dropping UI:** Built with Vite and React, featuring an interactive 3D neural network background (Vanta.js), smooth Framer Motion page transitions, and a premium "neon-glass" aesthetic.
- **AI Match Engine:** Upload your resume (PDF/DOCX) and our Apache Tika-powered engine will extract your skills and use a TF-IDF Cosine Similarity algorithm to score your profile against live job descriptions.
- **Role-Based Access:** Dedicated dashboards for both Candidates and Recruiters, secured via stateless JWT authentication.
- **Bento Box Grids:** Job cards and feature elements are presented in a sleek, modern grid with magnetic "spotlight" hover effects tracking the user's custom cursor.

## 🛠️ Tech Stack

### Backend
- **Java 17 & Spring Boot 3**
- **Spring Security & JJWT:** Token-based stateless authentication.
- **Spring Data JPA & Hibernate**
- **MySQL Database**
- **Apache Tika:** For precise document text extraction.

### Frontend
- **React 18 & Vite**
- **React Router DOM:** Client-side routing.
- **Three.js & Vanta.js:** For the interactive 3D background.
- **Framer Motion & React Tilt:** For buttery smooth micro-animations and 3D tactile cards.
- **Lucide React:** Beautiful, consistent iconography.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17
- MySQL Database
- Maven

### 1. Database Setup
Create a local MySQL database named `smart_job_portal`. Ensure your local MySQL server is running on port 3306.
Update the credentials in `backend/src/main/resources/application.properties` if your MySQL username/password differs from `root`/`root123`.

### 2. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*Note: The backend runs on `http://localhost:8081`.*

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:5173`.*

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
