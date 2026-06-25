# WorkSphere

## Smart Freelancer Marketplace

WorkSphere is a full-stack SaaS-based freelancer marketplace built using the MERN stack.

The platform connects clients and freelancers in a professional ecosystem where clients can post projects, receive proposals, hire talent, manage contracts, and collaborate efficiently. Freelancers can discover opportunities, submit proposals, manage contracts, communicate with clients, and track their work progress.

---

## Features

### Authentication & Authorization

- JWT Authentication
- Secure Password Hashing
- Role-Based Access Control
- Protected Routes
- Client and Freelancer Dashboards

### Client Features

- Create and Manage Projects
- Review Freelancer Proposals
- Hire Freelancers
- Contract Management
- Payment Tracking

### Freelancer Features

- Browse Available Projects
- Submit Proposals
- Manage Contracts
- Track Earnings
- Professional Profile Management

### Communication

- Real-Time Messaging
- Instant Notifications
- Project Discussions

### Dashboard Analytics

- Project Statistics
- Revenue Tracking
- Contract Monitoring
- Proposal Insights

---

## Tech Stack

### Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- JWT Authentication
- Socket.io
- Express Validator
- Multer

### Database

- MongoDB
- Mongoose

### Cloud Services

- Cloudinary
- Razorpay

---

## Project Structure

```bash
WorkSphere
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── redux
│   ├── services
│   └── routes
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── validators
│   ├── config
│   └── utils
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Swasti-123-Kundal/worksphere.git

cd worksphere
```

### Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

Run Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## Future Enhancements

- AI Freelancer Matching
- AI Proposal Ranking
- AI Contract Generator
- AI Budget Estimation
- Smart Reputation System
- Team Collaboration Workspace
- Skill Verification System

---

## What This Project Demonstrates

- Full Stack Development
- REST API Design
- Authentication & Authorization
- Role-Based Access Control
- Real-Time Communication
- Database Design
- SaaS Architecture
- Payment Integration
- Cloud Deployment Ready Architecture
- Scalable MERN Application Development

---

## Author

**Swastika Kundal**

MERN Stack Developer

GitHub: https://github.com/Swasti-123-Kundal

