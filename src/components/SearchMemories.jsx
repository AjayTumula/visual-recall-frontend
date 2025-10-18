import React, { useState } from "react";
import axios from "axios";
import styles from "./SearchMemories.module.css";

export default function SearchMemories({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/query",
        { q: query, user: user.email }
      );
      setResults(res.data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
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

      <div className={styles.results}>
        {results.length > 0 ? (
          <ul className={styles.list}>
            {results.map((item, i) => (
              <li key={i} className={styles.card}>
                <strong>{item.caption || "No caption"}</strong>
                {item.url && (
                  <img src={item.url} alt={item.caption} className={styles.image} />
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
