
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

    // friend related events
    socket.on("add_friend",(data)=> {
        // console.log('user joining room',data.friendId)
        io.in(data.friendId).emit("friend_request",data.message)
    })
    socket.on("remove_request",(data)=> {
        console.log(data.uid)
        io.in(data.uid).emit("friend_req_unsent",data.message)
    })

    //chat related events
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

    // call related events
    socket.on("callUser",(data)=> {
        const {profileData} = data;
        console.log(profileData)
        console.log("user called",data.userToCall)
        // console.log(data.signalData)
        io.to(data.userToCall).emit("incoming_call",{signalData:data.signalData,from:data.from,profileData},error=> {
            if(error) {
                console.log(error)
            }
            else {
                console.log("call sent")
            }
        })
    })
    socket.on("busyCall",(data)=> {
        // console.log({data})
        io.in(data.caller).emit("busy_call",data.me)
    })
    socket.on("rejectCall",(data)=> {
        // console.log("call rejected",data.caller)
        io.to(data.caller).emit("call_rejected",data.me)
    })
    socket.on("acceptCall", (data) => {
        console.log("chala")
        // console.log({data})
        io.to(data.caller).emit('call_accepted', data.signalData);
    })
    socket.on("endCall",friendId=> {
        console.log(friendId)
        socket.in(friendId).emit("call_ended")
    })
    socket.on("joinGroup",(data)=>{
        const {groupId} = data;
        socket.join(groupId);
    })
    socket.on('updateGroup',(data)=> {
        const {groupId,newName,newDp,newMembers} = data
        console.log({data})
        newMembers.forEach(member=> {
            console.log(member)
            io.in(member).emit("group_updated",{newName,newDp,newMembers,id:groupId})
            io.in(member).emit("group_list_updated",{newName,newDp,newMembers,id:groupId})
        })
        // socket.in(groupId).emit("group_updated",{newName,newDp,newMembers})
        
    })
    socket.on("removeMember",(data)=> {
        const {groupId,removedMemberId,newMembers} = data
        console.log({newMembers})
        io.to(groupId).except(removedMemberId).emit("member_removed",{newMembers})
        io.to(removedMemberId).emit("group_removed")
    })
    
  });
httpServer.listen(80);