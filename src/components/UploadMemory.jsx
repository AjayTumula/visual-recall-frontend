import React, { useState } from "react";
import axios from "axios";

export default function UploadMemory() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const CLOUD_RUN_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a photo first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      setUploading(true);
      const res = await axios.post(`${CLOUD_RUN_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
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
      <h1>📸 Add a Memory</h1>
      <p>Upload a photo and caption to store in your visual journal.</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
      />
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          style={{
            width: "100%",
            borderRadius: 10,
            marginBottom: "1rem",
          }}
        />
      )}

      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows="3"
        style={{
          width: "100%",
          borderRadius: 8,
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          backgroundColor: "#4f46e5",
          color: "#fff",
          padding: "0.7rem 1rem",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload Memory"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>✅ Uploaded Successfully!</h3>
          <img
            src={result.url}
            alt="uploaded"
            style={{ width: "100%", borderRadius: 10 }}
          />
          <p>{result.caption}</p>
        </div>
      )}
    </div>
  );
}
