const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    // console.log(socket.id);
    
    socket.on("test",(data)=> {
        console.log(data)
    
    })
    socket.on("disconnect", (reason) => {
      console.log("user disconnected",reason);
    });
    socket.on("join_room",(data)=> {
        socket.join(data.uid);
        // console.log(data.uid," user joined room")
        socket.emit("joined_room",data)
    })
    socket.on("add_friend",(data)=> {
        // console.log('user joining room',data.friendId)
        io.in(data.friendId).emit("friend_request",data.message)
    })
    socket.on("remove_request",(data)=> {
        console.log(data.uid)
        io.in(data.uid).emit("friend_req_unsent",data.message)
    })
  });
httpServer.listen(80);