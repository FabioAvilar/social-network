import { createRoot } from "react-dom/client";
import Welcome from "./pages/welcome";
import App from "./pages/app";

const root = createRoot(document.querySelector("main"));

fetch("/api/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.user_id) {
            root.render(<Welcome />);
        } else {
            root.render(<App />);
        }
    });
