import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MemoriesProvider } from "./context/MemoriesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MemoriesProvider>
      <App />
    </MemoriesProvider>
  </React.StrictMode>
);
