import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await axios.post(
      "https://YOUR-CLOUD-RUN-URL/query",
      { q: query }
    );
    setResults(res.data.results);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 Visual Recall Journal</h1>
      <input
        value={query}
        placeholder="Search your memories..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
