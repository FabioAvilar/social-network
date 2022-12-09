import { useState, useEffect } from "react";

function getButtonLabel(status) {
    // determine the label to display based on the status
    if (status === "NO_FRIENDSHIP") {
        return "Send request";
    }
    if (status === "INCOMING_FRIENDSHIP") {
        return "Incoming request";
    }
    if (status === "OUTGOING_FRIENDSHIP") {
        return "Request sent";
    }
    if (status === "ACCEPTED_FRIENDSHIP") {
        return "Unfriend";
    }
    return "...";
}

export default function FriendshipButton({ user_id }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // make a GET to /api/friendships/:user_id
        // update the status based on the response
        async function getFriendship() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const friendship = await response.json();
            setStatus(friendship.status);
        }
        getFriendship();
    }, [user_id]);

    async function onClick() {
        // make a POST to /api/friendships/:user_id
        // update the status based on the response
        // console.log("friendshipButton onClick: 🎸🎸🎸", status);
        const reesponse = await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });
        const friendship = await reesponse.json();
        setStatus(friendship.status);
    }

    // disable the button if the friendship status is outgoing:
    return (
        <button
            className="friendship-button button"
            onClick={onClick}
            disabled={status === "OUTGOING_FRIENDSHIP"}
        >
            {getButtonLabel(status)}
        </button>
    );
}
