import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CLOUD_RUN_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${CLOUD_RUN_URL}/query`, { q: query });
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem",
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <h1>🧠 Visual Recall Journal</h1>
      <p>Search through your visual memories...</p>

      <input
        value={query}
        placeholder="e.g. golden retriever, café, sunset"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={!query || loading}
        style={{
          padding: "0.6rem 1rem",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#4f46e5",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "2rem" }}>
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#f9fafb",
                padding: "1rem",
                borderRadius: 10,
                marginBottom: "1rem",
              }}
            >
              <img
                src={item.image_url}
                alt=""
                style={{ width: "100%", borderRadius: 10 }}
              />
              <p>{item.caption}</p>
            </div>
          ))
        ) : (
          !loading && <p>No results yet.</p>
        )}
      </div>
    </div>
  );
}
