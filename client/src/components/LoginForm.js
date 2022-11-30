import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email_address: "",
        password: "",
    });
    const [error, setError] = useState("");

    const onInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (result.error) {
                setError(result.error);
                return;
            }

            location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section onSubmit={onSubmit} className="loginHome">
            <h2 className="loginTitle">Sign in</h2>
            <form className="loginForm" onSubmit={onSubmit}>
                <label htmlFor="email" className="label">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter email"
                    className="input"
                    required
                />
                <label htmlFor="password" className="label">
                    Password
                </label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={onInputChange}
                    placeholder="Password"
                    name="password"
                    className="input"
                    required
                />

                <div className="loginButtons">
                    <button type="submit" className="button">
                        Sign In
                    </button>
                    {error && <p className="error">{error}</p>}
                    <Link to="/register" className="button">
                        Sign Up
                    </Link>
                </div>
            </form>
        </section>
    );
};

export default LoginForm;
