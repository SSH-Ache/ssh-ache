import { createRoot } from "react-dom/client";
import App from "./App";
import logoMark from "./assets/logo-mark.svg";

// Brand favicon (uses the processed asset URL — works in dev and in the build).
const favicon = (document.querySelector("link[rel=icon]") as HTMLLinkElement) || document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/svg+xml";
favicon.href = logoMark;
document.head.appendChild(favicon);
// JetBrains Mono vendored locally (no CDN → fully offline, no third-party request).
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "@xterm/xterm/css/xterm.css";
import "./style.css";

createRoot(document.getElementById("root")!).render(<App />);
