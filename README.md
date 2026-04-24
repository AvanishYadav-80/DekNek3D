# Nex3D Hub - 3D Creator Platform

Nex3D Hub is a premium full-stack web application designed for 3D creators to manage, showcase, and optimize their digital assets. Built for the DekNek3D internship assignment.

## 🚀 Live Demo
[Deploy to Vercel/GitHub and paste link here]

## ✨ Features
- **Modern UI/UX**: Futuristic dark theme with glassmorphism, responsive design, and smooth animations using Framer Motion.
- **3D Visualization**: Interactive 3D hero scene built with Three.js and React Three Fiber.
- **Real Authentication**: Secure login and signup system powered by Firebase Authentication.
- **Database Integration**: Cloud Firestore used to store user profiles and 3D asset metadata.
- **Protected Dashboard**: Personalized workspace for authenticated users to manage their assets.
- **Asset CRUD**: Real-time ability to add and list assets within the dashboard.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Vanilla CSS (Custom Tokens), Lucide React (Icons), Framer Motion (Animations)
- **Backend/DB**: Firebase Auth, Firestore
- **3D Engine**: Three.js, React Three Fiber

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/deknek3d-assignment.git
cd deknek3d-assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase (Already Configured)
The project comes pre-configured with a dedicated Firebase project. If you wish to use your own:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password) and **Firestore Database**.
3. Copy your Web App config into `src/lib/firebase.ts`.

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🚢 Deployment (Vercel)
The easiest way to deploy is through Vercel:
1. Push this code to a GitHub repository.
2. Connect your repo to Vercel.
3. Vercel will automatically detect Next.js and deploy.

---
Built with ❤️ for **DekNek3D**
