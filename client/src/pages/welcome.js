import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome 🎮</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/" element={<Login />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
