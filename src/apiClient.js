import axios from "axios";
import { auth } from "./firebaseConfig";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach the Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Attached token:", token.slice(0, 20) + "..."); // debug
  } else {
    console.warn("⚠️ No Firebase user detected — not sending token");
  }
  return config;
});

export default api;
