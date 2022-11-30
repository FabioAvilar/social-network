import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

export default function Welcome() {
    return (
        <div className="homeWelcome">
            <h1 className="homeTitle">
                Social Network <i className="fa-brands fa-react icon"></i>
            </h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/" element={<Login />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
