import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles.css"
import { App as Canvas } from "./Canvas.tsx"
import { Overlay } from "./Overlay.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas />
    <Overlay />
  </StrictMode>
)
