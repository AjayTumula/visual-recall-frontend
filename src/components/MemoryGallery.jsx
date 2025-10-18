import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MemoryGallery.module.css";

export default function MemoryGallery({ user }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/memories");
      setMemories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.status}>Loading memories...</p>;
  if (memories.length === 0) return <p className={styles.status}>No memories yet. Upload one!</p>;

  return (
    <div className={styles.container}>
      <h2>Your Memory Timeline</h2>
      <div className={styles.gallery}>
        {memories.map((m, i) => (
          <div key={i} className={styles.card}>
            <img src={m.image_url} alt={m.caption || "Memory"} />
            <div className={styles.info}>
              <p className={styles.caption}>{m.caption || "No caption"}</p>
              {m.timestamp && (
                <span className={styles.date}>
                  {new Date(m.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
