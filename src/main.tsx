
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { ThemeProvider } from "./contexts/ThemeContext";
  import { AuthProvider } from "./contexts/AuthContext";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
  