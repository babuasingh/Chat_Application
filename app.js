const express=require('express');
const app= express();
const port= process.env.PORT || 4000;
const path=require('path')
const users=new Set();
const server = app.listen(port,()=>{
    console.log(`Server is running on port at port ${port}`);
})
const io=require('socket.io')(server)


app.use(express.static(path.join(__dirname,'public')))


io.on('connection',Onconnect)


function Onconnect(socket){
    console.log(socket.id +' Joined')
    users.add(socket.id)
    io.emit('update',users.size)



    socket.on('disconnect',()=>{
        console.log(socket.id +' left')
        users.delete(socket.id)
        io.emit('update',users.size)
    })


    socket.on('message',data=>{
        // console.log(data)
        socket.broadcast.emit('chat-message',data)
    })


    socket.on('feedback',data=>{
        socket.broadcast.emit('feedall',data)
    })

}