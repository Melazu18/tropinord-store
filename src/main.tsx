/**
 * App bootstrap.
 * Mounts the React application into the DOM and imports global styles.
 */
import "./i18n";
import "./index.css";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
