// src/components/NotificationBell.jsx
import React, { useState, useEffect } from "react";
import socket from "../socket";

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // server will emit { notifications, unreadCount } on connect
        const handleLoad = (payload) => {
            if (!payload) return;
            if (Array.isArray(payload)) {
                setNotifications(payload);
                setUnreadCount(payload.filter(n => !n.read).length);
            } else {
                setNotifications(payload.notifications || []);
                setUnreadCount(payload.unreadCount ?? (payload.notifications || []).filter(n => !n.read).length);
            }
        };

        // server emits { notification, unreadCount } on new notification
        const handleReceived = (payload) => {
            const newNotif = payload.notification || payload;
            setNotifications(prev => [newNotif, ...prev]);
            if (typeof payload.unreadCount === "number") {
                setUnreadCount(payload.unreadCount);
            } else {
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on("loadnotification", handleLoad);
        socket.on("receivedNotification", handleReceived);

        // cleanup on unmount
        return () => {
            socket.off("loadnotification", handleLoad);
            socket.off("receivedNotification", handleReceived);
        };
    }, []);

    const markedAsRead = () => {
        socket.emit("markAsRead");
        setUnreadCount(0);
        setOpen(false);
    };

    return (
        <div className="header">
            <div className="search-box">
                <input type="text" placeholder="Search Amazon.in" />
                <button className="search-btn">🔍</button>
            </div>

            <div className="icons">
                <span className="icon" onClick={() => setOpen(o => !o)}>
                    🔔
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </span>
                <span className="icon">🛒</span>

                {open && (
                    <div className="notification-modal">
                        <button className="mark-btn" onClick={markedAsRead}>Mark As Read</button>
                        {notifications.length === 0 && <h4>No notifications</h4>}
                        {notifications.map(ele => (
                            <div key={ele._id || ele.createdAt} className="notification-item">
                                <strong>{ele.title}</strong>:
                                <span>{' '}{ele.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationBell;
