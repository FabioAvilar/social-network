import ProfilePicture from "../components/ProfilePicture";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

let socket;

export default function NewComponent() {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;
    };

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // connect to the socket here
        if (!socket) {
            socket = io.connect();
        }
        console.log("socket", socket);

        // listen to the recent messages on connect
        socket.on("recentMessages", (messages) => {
            setMessages(messages);
            // console.log("messages", messages);
        });

        // cleanup function
        return () => {
            socket.off("recentMessages");
            socket.disconnect();
            socket = null;
        };
    }, []);

    useEffect(() => {
        // listen to an new incoming message
        socket.on("newMessage", (newMessage) => {
            // console.log("newMessage", newMessage);
            setMessages([...messages, newMessage]);
        });

        // cleanup function
        return () => {
            if (!socket) {
                return;
            }
            socket.off("newMessage");
        };
    }, [messages]);

    function onSubmit(event) {
        event.preventDefault();
        console.log("teste da funcao onSubmit", event.target.text.value);
        socket.emit("sendMessage", {
            text: event.target.text.value,
        });
    }

    return (
        <section>
            <h2 className="homeSubTittle chatTittle">Chat</h2>
            <div className="chatMessages">
                {messages.length ? (
                    <ul className="chatUl">
                        {messages.map((message) => (
                            <li
                                id="elemento"
                                className="chatLi"
                                key={`chat-message-${message.id}`}
                            >
                                <Link to={`/user/${message.sender_id}`}>
                                    <ProfilePicture
                                        profile_picture_url={
                                            message.profile_picture_url
                                        }
                                        first_name={message.first_name}
                                        last_name={message.last_name}
                                    />
                                </Link>
                                <div>
                                    <div>
                                        <Link to={`/user/${message.sender_id}`}>
                                            <span>{`${message.first_name} ${message.last_name} `}</span>
                                        </Link>
                                        <span>
                                            {formatDate(message.created_at)}
                                        </span>
                                    </div>
                                    {message.text}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>It is very silent here.</div>
                )}
                <form className="chatForm" onSubmit={onSubmit}>
                    <textarea
                        type="text"
                        name="text"
                        placeholder="Type something"
                        className="chatInput"
                        id="elemento"
                    />
                    <button className="button" type="submit">
                        Send
                    </button>
                </form>
            </div>
        </section>
    );
}
