import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

export default function NewComponent() {
    useEffect(() => {
        socket = connect();
        socket.on("Brazil", (string) => {
            console.log(string);
        });
    }, []);
    return <p>Chat</p>;
}
