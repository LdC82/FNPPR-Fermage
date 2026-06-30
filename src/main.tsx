import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PasswordGate } from "./components/PasswordGate";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Élément racine #root introuvable.");
}

createRoot(rootElement).render(
  <StrictMode>
    <PasswordGate>
      <App />
    </PasswordGate>
  </StrictMode>,
);
