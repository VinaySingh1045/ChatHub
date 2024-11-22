import { Message } from "../models/Message.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { AsyncHandler } from "../utlis/AsyncHandler.js";


// Creating the SendApi to send the message
const sendMessage = AsyncHandler(async (req, res) => {
    // Extracting the necessary data from the request body

    const { receiver, content } = req.body
    console.log(receiver, "Content: ", content);

    // Check if all required fields are present
    if (!receiver || !content) {
        throw new ApiError(400, "receiver, and content are required fields");
    }

    // Creating the message object to be sent to the receiver

    const newMessage = new Message({
        sender: req.user._id,
        receiver,
        content,
        timestamp: new Date()
    })

    if (!newMessage) {
        throw new ApiError(500, "Failed to create message");
    }

    // Save the message in the database
    const savedMessage = await newMessage.save()

    if (!savedMessage) {
        throw new ApiError(500, "Failed to save message in database");
    }

    // Emit the message to the receiver using Socket.io
    const io = req.app.get('io'); // Get the io instance set in index.js

    if (!io) {
        throw new ApiError(500, "Socket.io instance not found");
    }

    // io.to(<socket_id>).emit() used to send events to specific client
    io.to(receiver).emit('sendChatMessage', savedMessage); // Emit to receiver

    return res.status(200).json(
        new ApiResponse(200, savedMessage, "Message sent successfully")
    )

})

// Creating the GetApi 
const getMessage = AsyncHandler(async (req, res) => {
    
    const sender = req.user?._id;
    const { receiver } = req.query;

    if (!sender || !receiver) {
        throw new ApiError(400, "Sender and receiver are required to fetch messages")
    }

    // Fetch the messages between the sender and receiver
    const messages = await Message.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    }).sort({ timestamp: 1 });

    return res.status(200).json(
        new ApiResponse(200, messages, "Message Fetch Successfully")
    )

})

// Creating a status Api that messages read from the user



export { sendMessage, getMessage }