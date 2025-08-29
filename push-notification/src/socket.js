// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
