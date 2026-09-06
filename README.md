# 🚗 AutoXP — AI-Powered Car Valuation & Marketplace

<p align="center">
  <b>Smart Pricing. Better Deals. Smarter Car Trading.</b>
</p>

<p align="center">
  An AI-powered used-car valuation and marketplace platform that combines machine learning price prediction with a modern car buying and selling experience.
</p>

---

## ✨ Overview

**AutoXP** is a full-stack used-car marketplace designed to help users make smarter buying and selling decisions.

The platform combines an **AI-powered car price prediction system** with a complete marketplace where users can browse, evaluate, and list vehicles.

Instead of simply showing a listing price, AutoXP analyzes the vehicle's characteristics and estimates its **fair market value**, allowing users to understand whether a car is a **Great Deal, Fair Price, or Overpriced**.

### 🎯 What AutoXP Provides

* 🤖 AI-powered car price prediction
* 🚘 Used-car marketplace
* 📊 Fair-market value analysis
* 🏷️ Deal rating for listings
* 🔐 Secure JWT authentication
* 👤 User profiles and seller listings
* 🖼️ Car listing management
* 🐳 Dockerized backend
* ☁️ MongoDB Atlas cloud database

---

# 🛠️ Tech Stack

## 🎨 Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

* **React 19** — Component-based frontend
* **Vite** — Fast development and production builds
* **Tailwind CSS** — Utility-first styling
* **PostCSS** — CSS processing
* **Oxlint** — JavaScript/React linting

---

## ⚡ Backend

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=for-the-badge\&logo=uvicorn\&logoColor=white)

* **FastAPI** — REST API framework
* **Python 3.12** — Backend language
* **Uvicorn** — ASGI server
* **Pydantic** — Request validation and data modelling

---

## 🤖 Machine Learning

![Python](https://img.shields.io/badge/Python-ML-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Scikit Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge\&logo=pandas\&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge\&logo=numpy\&logoColor=white)

The platform uses a pre-trained **scikit-learn regression pipeline** to estimate the fair market value of a vehicle.

### Prediction Factors

The model considers attributes such as:

* 🚘 Car brand
* 📅 Manufacturing year
* 🛣️ Mileage
* ⛽ Fuel type
* ⚙️ Transmission
* 🔧 Vehicle condition

The trained pipeline is stored as:

```text
car_price_pipeline.joblib
```

# 🏗️ Project Architecture

```text
                         ┌─────────────────────┐
                         │      React App      │
                         │   Vite + Tailwind   │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │    Backend API      │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │ Authentication│  │  Marketplace │  │ ML Prediction│
          │     & JWT     │  │   Listings   │  │    Engine    │
          └──────────────┘  └──────────────┘  └──────┬───────┘
                                                     │
                                                     ▼
                                           ┌──────────────────┐
                                           │ Scikit-Learn ML  │
                                           │     Pipeline     │
                                           └──────────────────┘
                                   
                                   
                         ┌─────────────────────┐
                         │     MongoDB Atlas   │
                         │      Database       │
                         └─────────────────────┘
```

---

# 📁 Project Structure

```text
AutoXP/
│
├── car-price-api/                  # FastAPI Backend
│   │
│   ├── controllers/                # API route handlers
│   │   ├── auth.py
│   │   ├── listings.py
│   │   ├── predictions.py
│   │   └── deps.py
│   │
│   ├── models/                     # Pydantic schemas & domain models
│   │
│   ├── repositories/               # Database access layer
│   │
│   ├── services/                   # Business logic
│   │   ├── authentication
│   │   └── ML prediction
│   │
│   ├── car_price_pipeline.joblib   # Trained ML pipeline
│   ├── database.py                 # Async MongoDB connection
│   ├── main.py                     # FastAPI application entry
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend container
│   ├── .dockerignore
│   └── .env.example
│
├── frontend/                       # React Frontend
│   │
│   ├── public/                     # Static assets
│   │
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Application pages
│   │   │   ├── BuyPage
│   │   │   ├── DealPage
│   │   │   ├── EnlistPage
│   │   │   ├── LoginPage
│   │   │   ├── PredictPage
│   │   │   └── ProfilePage
│   │   │
│   │   ├── utils/                  # API & application utilities
│   │   ├── App.jsx                 # Main router & layout
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── docs/                           # Documentation
├── .env.example                    # Root environment template
└── .gitignore
```

---



---

## 🗄️ Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-1F8A45?style=for-the-badge\&logo=mongodb\&logoColor=white)

* **MongoDB** — Primary application database
* **MongoDB Atlas** — Cloud-hosted database
* **Motor / PyMongo** — MongoDB database connectivity
* Async database operations through Motor

---

## 🔐 Authentication & Security

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)

* JWT-based authentication
* Secure password hashing with bcrypt
* Protected API routes
* Token refresh support
* Pydantic input validation
* Email validation
* Input sanitization
* Configurable CORS origin whitelist

---

## 🐳 DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)

* Dockerized backend
* Lightweight `python:3.12-slim` image
* Non-root container execution
* Configurable worker count
* Environment-based configuration
* Git version control

---

# 🚀 Key Features

## 🤖 AI Fair-Market Price Prediction

Enter a vehicle's specifications and AutoXP predicts its estimated market value using a trained machine learning regression pipeline.

```text
Vehicle Information
       │
       ▼
ML Prediction Pipeline
       │
       ▼
Estimated Fair Value
```

---

## 💰 Deal Rating

AutoXP doesn't stop at predicting the price.

It compares the **seller's listing price** against the predicted fair-market value.

| Listing Price                  | Evaluation    |
| ------------------------------ | ------------- |
| Significantly below fair value | 🟢 Great Deal |
| Close to fair value            | 🟡 Fair Price |
| Significantly above fair value | 🔴 Overpriced |

This gives buyers a quick way to understand whether a listing is worth considering.

---

## 🚘 Marketplace

Users can:

* Browse available vehicles
* Search listings
* Filter vehicles
* Sort results
* View detailed vehicle information
* Evaluate listing prices
* Discover better deals

---

## 🏷️ Seller Portal

Authenticated users can enlist their vehicles for sale.

Sellers can provide:

* Vehicle specifications
* Price
* Description
* Images
* Vehicle condition
* Fuel type
* Transmission
* Mileage
* Manufacturing year

---

## 👤 User Profiles

Users get their own profile where they can:

* Manage their account
* View their listings
* Manage vehicles they have listed
* Access authenticated features

---

# 🔐 Authentication Flow

```text
        User
          │
          ▼
   ┌──────────────┐
   │ Register/Login│
   └───────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ FastAPI Auth │
    └──────┬──────┘
           │
           ▼
      JWT Token
           │
           ▼
   Protected Routes
           │
           ▼
      User Data
```

---

# ⚙️ Getting Started

## 📋 Prerequisites

Make sure you have the following installed:

* **Python 3.10+**
* **Node.js 18+**
* **npm**
* **MongoDB / MongoDB Atlas**
* **Docker** *(optional)*

---

# 🔧 Backend Setup

### 1. Navigate to the backend

```bash
cd car-price-api
```

### 2. Create a virtual environment

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file using `.env.example`.

```env
ENVIRONMENT=development

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/autoxp?retryWrites=true&w=majority

JWT_SECRET=your-32-character-secret-key-here

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 5. Start the backend

```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at:

```text
http://localhost:8000
```

### 📚 API Documentation

FastAPI automatically provides interactive API documentation:

```text
http://localhost:8000/docs
```

---

# 🎨 Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Start the development server

```bash
npm run dev
```

The frontend will typically be available at:

```text
http://localhost:5173
```

---

# 🐳 Docker Setup

The backend can also be run using Docker.

### Build the image

```bash
docker build -t autoxp-api ./car-price-api
```

### Run the container

```bash
docker run -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e MONGODB_URI="<your-mongodb-uri>" \
  -e JWT_SECRET="<your-jwt-secret>" \
  -e ALLOWED_ORIGINS="http://localhost:5173" \
  autoxp-api
```

---

# 🔄 Application Flow

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   React Client  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    FastAPI      │
                  │    REST API     │
                  └──────┬─────┬────┘
                         │     │
             ┌───────────┘     └───────────┐
             ▼                             ▼
      ┌──────────────┐             ┌──────────────┐
      │   MongoDB    │             │ ML Pipeline  │
      │    Atlas     │             │ Scikit-Learn │
      └──────────────┘             └───────┬──────┘
                                           │
                                           ▼
                                   Fair Market Value
                                           │
                                           ▼
                                     Deal Rating
```

---

# 📌 Project Highlights

| Area             | Implementation  |
| ---------------- | --------------- |
| Frontend         | React 19 + Vite |
| Styling          | Tailwind CSS    |
| Backend          | FastAPI         |
| Database         | MongoDB Atlas   |
| Authentication   | JWT + bcrypt    |
| Machine Learning | Scikit-learn    |
| Data Processing  | Pandas + NumPy  |
| API Server       | Uvicorn         |
| Containerization | Docker          |
| Version Control  | Git             |

---

# 🔮 Future Improvements

Some potential additions to AutoXP include:

* 📈 Advanced price trend analytics
* 🧠 Improved ML models and model comparison
* 📍 Location-based vehicle pricing
* ❤️ Wishlist / saved vehicles
* 💬 Buyer-seller messaging
* 🔔 Price drop notifications
* 📊 Seller analytics dashboard
* 🖼️ Cloud image storage
* 🔎 More advanced marketplace filtering
* ☁️ Full cloud deployment
* 📱 Mobile-responsive improvements

---

# 👨‍💻 Author

**Ayushmaan Singh**

🎓 Computer Science Student
🌐 Web Development Enthusiast
📊 Data Analytics Enthusiast
🤖 Interested in AI, Backend Development & Distributed Systems

---

<p align="center">
  <b>🚗 AutoXP — Making Used-Car Buying Smarter.</b>
</p>

<p align="center">
  ⭐ Star this repository if you find it interesting!
</p>
