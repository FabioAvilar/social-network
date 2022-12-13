import { Link } from "react-router-dom";
import { useState } from "react";

export default function UpdateProfile({first_name, last_name, email}) {
    const [update, setUpdate] = useState("");
    const [name, setName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [emaill, setEmail] = useState(email);

    async function onSubmit(event) {
        event.preventDefault();
        // console.log("its submits");

        const response = await fetch("/api/edit", {
            method: "POST",
            body: JSON.stringify({
                // first_name: event.target.first_name.value,
                // last_name: event.target.last_name.value,
                // email: event.target.email.value,

                first_name: name,
                last_name: lastName,
                email: emaill,
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
            setUpdate(data.error);
        } catch (error) {
            console.log("We were unable to change the data");
        }
    }

    return (
        <section className="loginHome">
            <h2 className="loginTitle">Update</h2>
            <form onSubmit={onSubmit} className="loginHome">
                <label htmlFor="first_name" className="label">
                    Type Your First Name
                </label>
                <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={name}
                    className="input"
                    onChange={(event) => setName(event.target.value)}
                />

                <label htmlFor="last_name" className="label">
                    Type Your Last Name
                </label>
                <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={lastName}
                    className="input"
                    onChange={(event) => setLastName(event.target.value)}
                />

                <label htmlFor="email" className="label">
                    Type Your Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={emaill}
                    className="input"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <div className="loginButtons">
                    <button type="Submit" className="button">
                        Update
                    </button>
                    {update && <p className="">{update}</p>}
                    <Link to="/" className="button">
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
}
