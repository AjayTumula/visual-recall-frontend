import React, { useState } from "react";
import axios from "axios";
import { useMemories } from "../context/MemoriesContext";
import styles from "./UploadMemory.module.css";
import api from "../apiClient";


export default function UploadMemory({ user }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const { addMemory } = useMemories();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMemory = {
        image_url: res.data.url,
        caption,
        timestamp: new Date().toISOString(),
      };

      addMemory(newMemory); // instantly updates gallery
      setFile(null);
      setCaption("");
      alert("✅ Uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>📸 Upload a New Memory</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
