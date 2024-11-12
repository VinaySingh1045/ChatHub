import { Message } from "../models/Message.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { AsyncHandler } from "../utlis/AsyncHandler.js";


// Creating the SendApi to send the message
const sendMessage = AsyncHandler(async (req, res) => {
    // Extracting the necessary data from the request body

    const { sender, receiver, content } = req.body

    // Check if all required fields are present
    if (!sender || !receiver || !content) {
        throw new ApiError(400, "Sender, receiver, and content are required fields");
    }

    // Creating the message object to be sent to the receiver

    const newMessage = new Message({
        sender,
        receiver,
        content,
        timestamp: new Date()
    })

    // Save the message in the database
    const savedMessage = await newMessage.save()

    // Emit the message to the receiver using Socket.io
    const io = req.app.get('io'); // Get the io instance set in index.js

    if (!io) {
        throw new ApiError(500, "Socket.io instance not found");
    }

    io.to(receiver).emit('newMessage', savedMessage); // Emit to receiver

    return res.status(200).json(
        new ApiResponse(200, savedMessage, "Message sent successfully")
    )

})

const getMessage = AsyncHandler(async (req, res) => {
    
    const {sender, receiver} = req.body;

    if(!sender || !receiver) {
        throw new ApiError(400, "Sender and receiver are required to fetch messages")
    }

    // Fetch the messages between the sender and receiver
    const messages = await Message.find({
        $or:[
            {sender, receiver},
            {sender: receiver , receiver: sender}
        ]
    }).sort({timestamp: 1});

    return res.status(200).json(
        new ApiResponse(200, messages, "Message Fetch Successfully")
    )

})

export { sendMessage, getMessage }