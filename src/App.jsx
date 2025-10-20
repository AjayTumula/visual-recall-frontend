// src/App.jsx
import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useMemories } from "./context/MemoriesContext"; // ✅ import context
import SearchMemories from "./components/SearchMemories";
import UploadMemory from "./components/UploadMemory";
import styles from "./App.module.css";

export default function App() {
  const [page, setPage] = useState("search");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const { fetchMemories } = useMemories(); // ✅ access context function

  // sync theme
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // handle login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // ✅ load that user's memories after login
        await fetchMemories();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className={styles.app}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            onClick={() => setPage("search")}
            className={page === "search" ? styles.active : ""}
          >
            🔍 Search
          </button>
          <button
            onClick={() => setPage("upload")}
            className={page === "upload" ? styles.active : ""}
          >
            📸 Upload
          </button>
        </div>

        <div className={styles.navRight}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${styles.button} ${styles.themeToggle}`}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <span className={styles.userName}>👋 {user.displayName}</span>
              <button onClick={handleLogout} className={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className={styles.button}>
              Sign in with Google
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.content}>
        {user ? (
          page === "search" ? (
            <SearchMemories user={user} />
          ) : (
            <UploadMemory user={user} />
          )
        ) : (
          <p className={styles.signInPrompt}>
            Please sign in to access your memories.
          </p>
        )}
      </main>
    </div>
  );
}
