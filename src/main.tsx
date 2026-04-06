import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Set CSS variables for fonts
document.documentElement.style.setProperty("--font-playfair", "'Playfair Display', serif");
document.documentElement.style.setProperty("--font-dm-sans", "'DM Sans', sans-serif");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
