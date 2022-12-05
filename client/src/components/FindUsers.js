import { useState, useEffect } from "react";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // console.log("useEffect running");
        console.log("query: ", query);
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

    return (
        <div className="find-users">
            <h2>Find Users</h2>
            <input type="text" placeholder="search" onChange={handleChange} />
            {users.map((user) => (
                <div key={user.profile_picture_url}>
                    {user.first_name}
                    <img className="image" src={user.profile_picture_url} />
                </div>
            ))}
        </div>
    );
}
