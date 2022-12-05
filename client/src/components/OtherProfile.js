import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const {id} = useParams();
    console.log("tests from id 😱😱", id);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("useEffect em açao");
        async function getUser() {
            const response = await fetch(`/api/users/${id}`);
            console.log("response teste", response);
            const data = await response.json();
            setUser(data);

            if (!data) {
                navigate("/", {replace: true});
            }
        }
        getUser();
    }, []);

    return (
        <section className="user-container">
            <img
                src={user.profile_picture_url}
                alt={`${user.first_name} $user.last_name}`}
                className="user-img"
            />
            <div className="user-content">
                <h2 className="homeTitle">
                    {user.first_name} {user.last_name}
                </h2>
                <h3 className="homeSubTittle">About me</h3>
                <p className="user-para">{user.bio}</p>
            </div>
        </section>
    );
}
