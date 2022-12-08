import { useState, useEffect } from "react";
import ProfilePicture from "../components/ProfilePicture";
import { Link } from "react-router-dom";

export default function Friends() {
    const [friends, setFriends] = useState([]);
    const [wannabes, setWannabes] = useState([]);

    useEffect(() => {
        async function getUsers() {
            // console.log("App:getUsers");
            const response = await fetch("/api/friendships");
            const data = await response.json();

            setFriends(data.filter((user) => user.accepted));
            setWannabes(data.filter((user) => !user.accepted));
        }
        getUsers();
    }, []);

    console.log("teste do friends usestates", friends);
    async function onUserClick(id, action) {
        // console.log("App:onUserClick", id, action);
        if (action === "unfriend") {
            const newFriends = friends.filter((x) => x.user_id !== id);
            setFriends(newFriends);

            await fetch(`/api/friendships/${id}`, {
                method: "POST",
            });
        }
        if (action === "accept") {
            // console.log("teste do id: ", id);
            const currentWannabe = wannabes.find((x) => x.user_id === id);
            // console.log("teste currentWannabe", currentWannabe);
            // console.log("teste wannbes", wannabes);
            const newWannabes = wannabes.filter((x) => x.user_id !== id);
            // console.log("teste newWannabes", newWannabes);
            const newFriends = [...friends, currentWannabe];
            setWannabes(newWannabes);
            setFriends(newFriends);
            await fetch(`/api/friendships/${id}`, {
                method: "POST",
            });
        }
    }

    return (
        <div>
            <h1 className="homeTitle">Friendships</h1>
            <section>
                <h2 className="homeSubTittle friendTitle">Friends</h2>
                <ul className="userContainer">
                    {friends.map((x) => (
                        <li key={x.user_id}>
                            <UserView
                                {...x}
                                id={x.user_id}
                                onClick={onUserClick}
                                action="unfriend"
                            />
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2 className="homeSubTittle friendTitle">Pending Invitations</h2>
                <ul className="userContainer">
                    {wannabes.map((x) => (
                        <li key={x.user_id}>
                            <UserView
                                {...x}
                                id={x.user_id}
                                onClick={onUserClick}
                                action="accept"
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

function UserView({
    first_name,
    last_name,
    profile_picture_url,
    id,
    onClick,
    selected,
    action,
}) {
    return (
        <article className={`user ${selected ? "selected" : ""}`}>
            <Link className="find-para" to={`/user/${id}`}>
                <ProfilePicture
                    first_name={first_name}
                    last_name={last_name}
                    profile_picture_url={profile_picture_url}
                    // className="user-img"
                />
                <p className="homeSubtitle find-paragraphy">
                    {first_name} {last_name}
                </p>
            </Link>
            <button className="button" onClick={() => onClick(id, action)}>{action}</button>
        </article>
    );
}
