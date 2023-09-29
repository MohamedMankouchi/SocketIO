const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);

  socket.on("joinRoom", (number) => {
    socket.join(number);
    console.log(`User with id ${socket.id} joined the room number ${number}`);
  });

  socket.on("writing", (data) => {
    console.log(data);
    socket.to(data.roomId).emit("showWriting", data);
  });

  socket.on("WritingStatus", (data) => {
    socket.to(data.roomId).emit("showStatus", data.status);
  });
  socket.on("sendMessage", (data) => {
    console.log(data);
    socket.to(data.roomId).emit("getMessages", data);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
