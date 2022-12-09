import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // console.log("useEffect running");
        // console.log("query: ", query);
        (async () => {
            const response = await fetch(`/api/users?q=${query}`);
            const data = await response.json();
            // console.log("data: ", data);
            setUsers(data);
        })();


    }, [query]);

    async function handleChange(event) {
        setQuery(event.target.value);
        // const response = await fetch(`/api/users?q=${event.target.value}`);
        // const data = await response.json();
        // // console.log("data: ", data);
        // setUsers(data);
    }
    console.log(users);
    return (
        <section className="find-users">
            <h2 className="homeTitle">Find Users</h2>
            <input
                type="text"
                className="input"
                placeholder="search"
                onChange={handleChange}
            />
            <div className="find-grid">
                {users.map((user) => (
                    <div key={user.id} className="find-block">
                        <Link className="find-para" to={`/user/${user.id}`}>
                            <img
                                className="image find-img"
                                src={user.profile_picture_url}
                            />
                            <p className="find-paragraphy">{user.first_name}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
