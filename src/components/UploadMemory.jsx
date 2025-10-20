import React, { useState } from "react";
import { useMemories } from "../context/MemoriesContext";
import styles from "./UploadMemory.module.css";
import api from "../apiClient";

export default function UploadMemory({ user }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isTextOnly, setIsTextOnly] = useState(false);
  const { addMemory, memories } = useMemories();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // ✅ Show preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    // ✅ Updated validation
    if (!file && !caption && !isTextOnly) {
      return alert("Please provide a caption or select an image");
    }

    setUploading(true);

    const formData = new FormData();

    if (file) formData.append("file", file);
    formData.append("caption", caption);
    formData.append("memory_type", isTextOnly ? "text" : file ? "mixed" : "text");

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Build memory object
      const newMemory = {
        memory_id: res.data.memory_id,
        image_url: isTextOnly ? null : preview, // No image if text-only
        caption: caption,
        timestamp: new Date().toISOString(),
        memory_type: isTextOnly ? "text" : "mixed",
      };

      addMemory(newMemory);

      // ✅ Clear form
      setFile(null);
      setCaption("");
      setPreview(null);
      setIsTextOnly(false);
      
      alert("✅ Uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`❌ Upload failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>📸 Upload a New Memory</h2>

      <div className={styles.uploadBox}>
        {/* ✅ Checkbox for text-only */}
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={isTextOnly}
            onChange={(e) => {
              setIsTextOnly(e.target.checked);
              if (e.target.checked) {
                setFile(null);
                setPreview(null);
              }
            }}
          />
          Text-only memory (no image)
        </label>

        {/* ✅ Only show file input if not text-only */}
        {!isTextOnly && (
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
          />
        )}
        
        {/* ✅ Show preview if not text-only */}
        {!isTextOnly && preview && (
          <div className={styles.preview}>
            <img src={preview} alt="Preview" style={{ maxWidth: "200px" }} />
          </div>
        )}
        
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        
        <button 
          onClick={handleUpload} 
          disabled={uploading || (!file && !caption && !isTextOnly)}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* ✅ Gallery Preview */}
      <h3>Your Uploaded Memories ({memories.length})</h3>
      {memories.length > 0 ? (
        <div className={styles.gallery}>
          {memories.map((m, i) => (
            <div key={m.memory_id || i} className={styles.card}>
              {m.image_url ? (
                <img 
                  src={m.image_url} 
                  alt={m.caption || "Memory"}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                />
              ) : (
                <div className={styles.textMemory}>
                  📝 Text Memory
                </div>
              )}
              <p className={styles.caption}>{m.caption || "No caption"}</p>
              {m.timestamp && (
                <p className={styles.timestamp}>
                  {new Date(m.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No memories yet. Upload one!</p>
      )}
    </div>
  );
}
