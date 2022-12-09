import ProfilePicture from "../components/ProfilePicture";
import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket;

// lazy initialise pattern!
// const connect = () => {
//     if (!socket) {
//         socket = io.connect();
//     }
//     return socket;
// };

// const disconnect = () => (socket = null);

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

        // listen to the recent messages on connect
        socket.on("recentMessages", (messages) => setMessages(messages));

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
            console.log("newMessage", newMessage);
            setMessages([...messages, newMessage]);
        });

        // cleanup function
        return () => {
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

    // useEffect(() => {
    //     socket = connect();
    //     socket.on("Brazil", (string) => {
    //         console.log(string);
    //     });
    // }, []);
    return (
        <section>
            <div>
                <h2>Chat</h2>

                {messages.length ? (
                    <ul>
                        {messages.map((message) => (
                            <li key={`chat-message-${message.id}`}>
                                <ProfilePicture
                                    profile_picture_url={
                                        message.profile_picture_url
                                    }
                                    first_name={message.first_name} 
                                    last_name={message.last_name}
                                />
                                <div>
                                    <div>
                                        <span
                                        >{`${message.first_name} ${message.last_name}`}</span>
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
                <form onSubmit={onSubmit}>
                    <input 
                        type="text"
                        name="text"
                        placeholder="Type something"
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </section>
    );
}
