import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../apiClient";
import { auth } from "../firebaseConfig";

const MemoriesContext = createContext();

export const MemoriesProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/memories");
      setMemories(res.data || []);
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchMemories(); // ✅ only after user signs in
    });
    return () => unsubscribe();
  }, []);

  const addMemory = (memory) => setMemories((prev) => [memory, ...prev]);

  return (
    <MemoriesContext.Provider value={{ memories, addMemory, loading, fetchMemories }}>
      {children}
    </MemoriesContext.Provider>
  );
};

export const useMemories = () => useContext(MemoriesContext);
