import React, { useState } from "react";
import styles from "./SearchMemories.module.css";
import api from "../apiClient";

export default function SearchMemories({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return alert("Please enter something to search.");
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/query", { q: query });
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("❌ Failed to fetch results. Check your backend or auth token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🔍 Search Your Memories</h2>
      <div className={styles.inputRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memories..."
          className={styles.input}
        />
        <button onClick={handleSearch} disabled={loading} className={styles.button}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.results}>
        {results.length > 0 ? (
          <ul className={styles.list}>
            {results.map((item, i) => (
              <li key={i} className={styles.card}>
                <strong>{item.caption || "No caption"}</strong>
                {item.url && (
                  <img
                    src={item.url}
                    alt={item.caption}
                    className={styles.image}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No results yet. Try searching something!</p>
        )}
      </div>
    </div>
  );
}
