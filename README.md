# 🚨 Online Complaint Registration System

A scalable complaint management platform built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application streamlines complaint registration, complaint tracking, status management, and administrative resolution through a secure role-based workflow, enabling efficient handling of complaints and improved transparency.

---

# 🔗 Live Demo

### Frontend

https://vip-c2-online-complaint-registerati.vercel.app/

### Backend API

https://complaint-registeration.onrender.com

### GitHub Repository

https://github.com/suchithreddy-07/-VIP-C2--Online-complaint-registration

---

# 📌 Project Overview

The Online Complaint Registration System is a full-stack web application designed to simplify the complaint handling process. Users can register complaints online, monitor complaint status, and receive updates in real time. Administrators can review complaints, update statuses, and ensure timely resolution through a centralized dashboard.

The system improves efficiency, transparency, and accessibility compared to traditional manual complaint management methods.

---

# 🎯 Objectives

* Digitize complaint registration processes
* Reduce paperwork and manual effort
* Improve complaint tracking and monitoring
* Enhance transparency in complaint resolution
* Provide secure user authentication
* Enable efficient complaint management for administrators

---

# ✨ Key Features

## 👤 User Module

### Authentication

* User Registration
* User Login
* JWT-Based Authentication
* Secure Password Encryption

### Complaint Management

* Register New Complaints
* Submit Complaint Details
* View Complaint History
* Track Complaint Status
* Update User Profile

### Notifications

* Complaint Submission Alerts
* Status Update Notifications
* Complaint Resolution Alerts

---

## 🛠️ Admin Module

### Dashboard Management

* View All Complaints
* Monitor Complaint Statistics
* Search and Filter Complaints
* Generate Reports

### Complaint Processing

* Review Complaints
* Assign Complaints
* Update Complaint Status
* Resolve Complaints
* Reject Invalid Complaints

### User Management

* View Registered Users
* Manage User Accounts
* Monitor Platform Activity

---

# 🔔 Complaint Workflow

1. Complaint Submitted
2. Under Review
3. Assigned
4. In Progress
5. Resolved
6. Closed

Users can track the progress of their complaints throughout the workflow.

---

# 🏗️ Technology Stack

## Frontend Technologies

* React.js
* Vite
* React Router DOM
* Axios
* JavaScript
* CSS3

## Backend Technologies

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* cors

## Cloud Infrastructure

### Frontend Deployment

* Vercel

### Backend Deployment

* Render

### Database Hosting

* MongoDB Atlas

---

# 📂 Project Structure

```text
VIP-C2--Online-complaint-registration
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── routes
│   │   └── assets
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── README.md
```

---

# 👥 User Roles

| Role   | Responsibilities                                                    |
| ------ | ------------------------------------------------------------------- |
| User   | Register complaints, track complaint status, view complaint history |
| Admin  | Manage complaints, update status, resolve complaints                |
| System | Notification management and workflow handling                       |

---

# ⚙️ Installation Guide

## Clone Repository

```bash
git clone https://github.com/suchithreddy-07/-VIP-C2--Online-complaint-registration.git
```

```bash
cd -VIP-C2--Online-complaint-registration
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start Backend Server:

```bash
npm start
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 📡 API Modules

## Authentication Module

* User Registration
* User Login
* User Authentication
* JWT Token Management

## Complaint Module

* Create Complaint
* Update Complaint
* Delete Complaint
* View Complaint
* Track Complaint Status

## Admin Module

* View All Complaints
* Manage Complaints
* Update Complaint Status
* Resolve Complaints
* Dashboard Statistics

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes
* Role-Based Access Control (RBAC)
* Secure Environment Variables
* Input Validation
* Secure API Communication

---

# 📊 Dashboard Features

* Total Complaints
* Pending Complaints
* Resolved Complaints
* Complaint Statistics
* User Activity Monitoring
* Complaint Tracking Analytics

---

# 📚 Technical Concepts Implemented

* Full Stack MERN Development
* RESTful API Design
* Authentication & Authorization
* MongoDB Data Modeling
* MVC Architecture
* CRUD Operations
* Client-Server Communication
* Responsive Web Design
* Cloud Deployment

---

# 🚀 Future Enhancements

* Email Notifications
* SMS Alerts
* Complaint Priority Management
* AI-Based Complaint Categorization
* PDF Report Generation
* Mobile Application
* Advanced Analytics Dashboard

---

# 🎓 Learning Outcomes

Through this project, I gained practical experience in:

* Full Stack Web Development
* API Development and Integration
* User Authentication Systems
* Database Design and Management
* Cloud Deployment
* MERN Stack Architecture
* Software Engineering Best Practices

---

# 👨‍💻 Developer

**THUM SUCHITH REDDY**

B.Tech Computer Science and Engineering
Anurag University

GitHub: https://github.com/suchithreddy-07

---

# 📄 License

This project is developed for educational, academic, internship, and portfolio purposes.

---

# ⭐ Acknowledgements

Special Thanks To:

* MongoDB Atlas
* React.js Community
* Node.js Community
* Express.js
* Vercel
* Render
* Open Source Contributors
