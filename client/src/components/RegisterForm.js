import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        // console.log("its submits");

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
        if (response.ok) {
            window.location.href = "/";
            return;
        }

        try {
            const data = await response.json();
            setError(data.error);
        } catch (error) {
            console.log("Something is really broken");
        }
    }

    return (
        <section className="loginHome">
            <h2 className="loginTitle">Register</h2>
            <form onSubmit={onSubmit} className="loginHome">
                <label htmlFor="first_name" className="label">
                    Type Your First Name
                </label>
                <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    className="input"
                    required
                />

                <label htmlFor="last_name" className="label">
                    Type Your Last Name
                </label>
                <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    className="input"
                    required
                />

                <label htmlFor="email" className="label">
                    Type Your Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    className="input"
                    required
                />

                <label htmlFor="email" className="label">
                    Type Your Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="input"
                    required
                />
                <div className="loginButtons">
                    <button type="Submit" className="button">
                        Register
                    </button>
                    {error && <p className="">{error}</p>}
                    <Link to="/" className="button">
                        Click here to Login
                    </Link>
                </div>
            </form>
        </section>
    );
};

export default RegisterForm;
