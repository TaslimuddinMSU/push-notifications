const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const connectDB = require('./config/database');
const Notifications = require('./config/notification-schema');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
});

// DB Connection 
connectDB();
// Middleware
app.use(cors());
app.use(express.json());

app.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notifications.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error ", error: error });
    }
});

// Socket connections
io.on('connection', async (socket) => {
    console.log("New client connected:", socket.id);

    // send initial notifications + unread count to the connected client
    try {
        const notifications = await Notifications.find().sort({ createdAt: -1 });
        const unreadCount = await Notifications.countDocuments({ read: false });
        socket.emit("loadnotification", { notifications, unreadCount });
    } catch (err) {
        console.error("Error loading notifications for new connection", err);
    }

    // Listen for clients sending a notification
    socket.on('sentNotification', async (data) => {
        try {
            const newNotification = new Notifications(data);
            await newNotification.save();

            // Broadcast to all connected clients (including sender)
            io.emit('receivedNotification', newNotification)
        } catch (error) {
            console.log('Error on sending Notification', error);
        }
    });

    socket.on("markAsRead", async () => {
        try {
            await Notifications.updateMany({ read: false }, { $set: { read: true } });
            const notifications = await Notifications.find().sort({ createdAt: -1 });
            io.emit("loadnotification", { notifications, unreadCount: 0 });
        } catch (err) {
            console.error("Error marking notifications as read", err);
        }
    });
    
    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
});

// Start the http server (Socket.IO is attached to this server)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

