import React, { useState } from "react";
import socket from "../socket";

const AdminPanel = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const sentNotification = () => {
        if (!title.trim() || !message.trim()) {
            return alert("Title and Message are required!");
        }
        const notification = { title: title.trim(), message: message.trim() };
        socket.emit("sentNotification", notification);
        setTitle("");
        setMessage("");
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <div className="w-100">
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
                <button onClick={sentNotification}>Send Notification</button>
            </div>
        </div>
    );
};

export default AdminPanel;
