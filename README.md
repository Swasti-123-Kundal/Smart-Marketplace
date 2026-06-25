WorkSphere - Smart Freelancer Marketplace
 Overview

WorkSphere is a full-stack SaaS-based freelancer marketplace that connects clients and freelancers on a single platform.

Unlike traditional freelancing platforms, WorkSphere focuses on intelligent talent discovery, team collaboration, proposal management, contracts, payments, and real-time communication.

The platform enables clients to post projects, review proposals, hire freelancers, manage contracts, and collaborate efficiently while freelancers can discover opportunities, submit proposals, build reputation, and track earnings.

✨ Key Features
 Authentication & Authorization
JWT Authentication
Secure Password Hashing using bcrypt
Role-Based Access Control
Client Dashboard
Freelancer Dashboard
 Client Features
Create Project Listings
Manage Posted Projects
Review Freelancer Proposals
Hire Freelancers
Contract Management
Project Tracking
Payment Management
 Freelancer Features
Browse Open Projects
Advanced Filtering
Submit Proposals
Manage Active Contracts
Track Earnings
Build Professional Profile
Receive Team Offers
 Real-Time Communication
Socket.io Integration
Real-Time Messaging
Instant Notifications
Project Discussions
 Analytics Dashboard
Active Projects
Proposal Statistics
Revenue Tracking
Contract Status Monitoring
 Modern User Experience
Responsive Design
Dark Mode Support
Mobile Friendly UI
Professional Dashboard Layout
 System Architecture
Client (React + Redux)
        │
        ▼
 REST API + Socket.io
        │
        ▼
 Node.js + Express
        │
        ▼
 MongoDB
🛠 Tech Stack
Frontend
React.js
Redux Toolkit
React Router
Axios
Tailwind CSS
Vite
Backend
Node.js
Express.js
JWT Authentication
Socket.io
Express Validator
Multer
Database
MongoDB
Mongoose
Cloud Services
Cloudinary
Razorpay
Deployment
Vercel (Frontend)
Render / Railway (Backend)
MongoDB Atlas
 Project Structure
WorkSphere/
│
├── client/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── redux/
│   ├── services/
│   └── routes/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   ├── utils/
│   └── config/
│
└── README.md
⚡ Installation
Clone Repository
git clone https://github.com/yourusername/worksphere.git
cd worksphere
Backend Setup
cd server

npm install

Create .env file

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

Run backend

npm run dev
Frontend Setup
cd client

npm install

npm run dev
Future Enhancements
AI Smart Matching
AI-based freelancer recommendation
Skill score prediction
Proposal ranking
Smart Reputation System
Trust Score
Project Completion Score
Freelancer Ranking Algorithm
AI Project Assistant
Automatic Proposal Suggestions
AI Budget Estimation
AI Contract Generation
Team Collaboration
Team Formation
Multi-Freelancer Projects
Shared Workspaces



This project demonstrates:

Full Stack Development
REST API Design
Authentication & Authorization
Real-Time Communication
Database Design
SaaS Architecture
Payment Integration
Cloud Deployment
Role-Based Access Control
Production-Level Project Structure
 Author

Swastika Kundal

Full Stack Developer | MERN Stack | Problem Solver

GitHub: https://github.com/Swasti-123-Kundal

