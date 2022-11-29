import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
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
            const response = await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify({
                    first_name: event.target.first_name.value,
                    last_name: event.target.last_name.value,
                    email: event.target.email.value,
                    password: event.target.password.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = response.json();
            if (result.error) {
                setError(result.error);
                return;
            }
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <section>
            <form onSubmit={onSubmit} className="register">
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={onInputChange}
                    placeholder="First Name"
                    required
                />

                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={onInputChange}
                    placeholder="Last Name"
                    required
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter email"
                    required
                />

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onInputChange}
                    placeholder="Password"
                    required
                />

                <button type="Submit">Register</button>
                {error && <p className="error">{error}</p>}
            </form>
            <Link to="/">Click here to Login</Link>
        </section>
    );
};

export default RegisterForm;
