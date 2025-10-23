# 🎨 Visual Recall Frontend

Frontend for the **AI-Powered Visual Recall Journal** — a personal AI memory app that lets users capture, search, and relive life moments through photos and notes.

---

## 🚀 Features
- 🧠 AI-powered visual + text search
- 📸 Upload and view daily memories
- 🔐 Firebase Authentication (Google Login)
- ⚡ Responsive UI built with React + Vite
- 🔄 Connects seamlessly with FastAPI backend

---

## 🏗️ Tech Stack
- **Framework:** React (Vite)
- **Auth:** Firebase Authentication
- **UI:** Tailwind CSS
- **API:** Axios for backend integration
- **State Management:** React Hooks

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
git clone https://github.com/your-username/visual-recall-frontend.git
cd visual-recall-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variables
Create a .env file in the root directory and add your Firebase config:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://127.0.0.1:8000

▶️ Run the App
npm run dev



