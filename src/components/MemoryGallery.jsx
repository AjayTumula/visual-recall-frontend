import React from "react";
import { useMemories } from "../context/MemoriesContext";
import styles from "./MemoryGallery.module.css";
import api from "../apiClient";

export default function MemoryGallery() {
  const { memories, loading } = useMemories();

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
              <span className={styles.date}>
                {new Date(m.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
