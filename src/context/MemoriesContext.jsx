// src/context/MemoriesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../apiClient";

const MemoriesContext = createContext();

export const MemoriesProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/memories");
      // ✅ Handle new response format from MongoDB backend
      setMemories(res.data.memories || res.data || []);
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = (memory) => {
    // ✅ Instantly show new uploads at the top
    setMemories((prev) => [memory, ...prev]);
  };

  return (
    <MemoriesContext.Provider
      value={{ memories, addMemory, loading, fetchMemories }}
    >
      {children}
    </MemoriesContext.Provider>
  );
};

export const useMemories = () => useContext(MemoriesContext);