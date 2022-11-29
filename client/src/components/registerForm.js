import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        console.log("its submits");

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

    // const [formData, setFormData] = useState({
    //     first_name: "",
    //     last_name: "",
    //     email_address: "",
    //     password: "",
    // });
    // const [error, setError] = useState("");

    // const onInputChange = (e) => {
    //     e.preventDefault();
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    // const onSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch("/api/users", {
    //             method: "POST",
    //             body: JSON.stringify(formData),
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });
    //         const result = response.json();
    //         if (result.error) {
    //             setError(result.error);
    //             return;
    //         }
    //         window.location.reload();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <section>
            <form onSubmit={onSubmit} className="">
                <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    // value={formData.first_name}
                    // onChange={onInputChange}
                    required
                />

                <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    // value={formData.last_name}
                    // onChange={onInputChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    // value={formData.email}
                    // onChange={onInputChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    // value={formData.password}
                    // onChange={onInputChange}
                    required
                />

                <button type="Submit">Register</button>
                {error && <p className="">{error}</p>}
            </form>
            <Link to="/">Click here to Login</Link>
        </section>
    );
};

export default RegisterForm;
