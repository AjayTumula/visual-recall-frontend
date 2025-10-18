import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import SearchMemories from "./components/SearchMemories";
import UploadMemory from "./components/UploadMemory";
import styles from "./App.module.css";
import MemoryGallery from "./components/MemoryGallery";

export default function App() {
  const [page, setPage] = useState("search");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) console.log("✅ Logged in:", currentUser.displayName);
      else console.log("👋 Logged out");
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={styles.app}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navButtons}>
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

        <div className={styles.authSection}>
          {user ? (
            <>
              <span className={styles.welcome}>👋 {user.displayName}</span>
              <button className={styles.logout} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className={styles.login} onClick={handleLogin}>
              Sign in with Google
            </button>
          )}
        </div>

        <button onClick={() => setPage("gallery")}>🖼 Gallery</button>
      </nav>

      {/* Main content */}
      <main className={styles.main}>
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
