import React, { useState, useEffect } from "react";
import { useMemories } from "../context/MemoriesContext";
import api from "../apiClient";
import styles from "./SearchMemories.module.css";

export default function SearchMemories({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("hybrid"); // semantic, keyword, hybrid
  const [memoryTypeFilter, setMemoryTypeFilter] = useState([]); // [], ["text"], ["image"], ["mixed"]
  const [suggestions, setSuggestions] = useState([]);
  const { memories } = useMemories();

  // Load search suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const res = await api.get("/query/suggestions");
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.post("/query", {
        query: query,
        search_mode: searchMode,
        memory_types: memoryTypeFilter.length > 0 ? memoryTypeFilter : null,
        limit: 20
      });
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      alert(`❌ Search failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMemoryType = (type) => {
    setMemoryTypeFilter(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const displayed = query && results.length > 0 ? results : memories;

  return (
    <div className={styles.container}>
      <h2>🔍 Search Your Memories</h2>

      {/* Search Box */}
      <div className={styles.searchBox}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search your memories..."
          className={styles.input}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className={styles.button}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className={styles.clearButton}
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Mode Selector */}
      <div className={styles.controls}>
        <div className={styles.modeSelector}>
          <label>Search Mode:</label>
          <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)}>
            <option value="hybrid">🎯 Hybrid (Best)</option>
            <option value="semantic">🧠 Semantic (AI)</option>
            <option value="keyword">🔤 Keyword</option>
          </select>
        </div>

        {/* Memory Type Filters */}
        <div className={styles.filterGroup}>
          <label>Filter by type:</label>
          <button
            className={`${styles.filterBtn} ${memoryTypeFilter.includes("text") ? styles.active : ""}`}
            onClick={() => toggleMemoryType("text")}
          >
            📝 Text
          </button>
          <button
            className={`${styles.filterBtn} ${memoryTypeFilter.includes("image") ? styles.active : ""}`}
            onClick={() => toggleMemoryType("image")}
          >
            🖼️ Image
          </button>
          <button
            className={`${styles.filterBtn} ${memoryTypeFilter.includes("mixed") ? styles.active : ""}`}
            onClick={() => toggleMemoryType("mixed")}
          >
            📸 Mixed
          </button>
        </div>
      </div>

      {/* Search Suggestions */}
      {!query && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <span>💡 Try searching: </span>
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className={styles.suggestionChip}
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Search Mode Info */}
      <div className={styles.info}>
        <p>
          {searchMode === "semantic" && "🧠 AI-powered search finds memories by meaning, not just keywords"}
          {searchMode === "keyword" && "🔤 Traditional search finds exact word matches"}
          {searchMode === "hybrid" && "🎯 Best of both worlds: AI + keyword matching"}
        </p>
      </div>

      {/* Results */}
      <div className={styles.results}>
        <h3>
          {query && results.length > 0
            ? `Search Results (${results.length})`
            : `All Memories (${memories.length})`}
        </h3>

        {displayed.length > 0 ? (
          <div className={styles.gallery}>
            {displayed.map((item, i) => (
              <div key={item.memory_id || i} className={styles.card}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.caption}
                    className={styles.image}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.memoryType}>
                      {item.memory_type === "text" && "📝"}
                      {item.memory_type === "image" && "🖼️"}
                      {item.memory_type === "mixed" && "📸"}
                    </span>
                    {item.similarity !== undefined && (
                      <span className={styles.similarity}>
                        {(item.similarity * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>
                  {item.caption && (
                    <p className={styles.caption}>{item.caption}</p>
                  )}
                  {item.timestamp && (
                    <p className={styles.timestamp}>
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            {query
              ? "No results found. Try a different search term or mode."
              : "No memories yet. Upload some to get started!"}
          </p>
        )}
      </div>
    </div>
  );
}