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
    socket.on("send_message",(data)=> {
        console.log(data.message)
        io.in(data.uid).emit("add_message",data.message)
    })
    socket.on("isTyping",(data)=> {
        // console.log("typing")
        // console.log(data.uid)
        io.in(data.uid).emit("typing")
    })
    socket.on("notTyping",(data)=> {
        // console.log(data.uid)
        io.in(data.uid).emit("not_typing")
    })
  });
httpServer.listen(80);