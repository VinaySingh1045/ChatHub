
const setupSocketIo = (io) => {
    io.on("connection", (socket) => {

        socket.on("joinRoom", (userId) => {
            socket.join(userId);
        })

        socket.on("sendChatMessage", ({ reciever, message }) => {
            io.to(reciever).emit("sendChatMessage", message)
        })
        
    })

}

export default setupSocketIo;