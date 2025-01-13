import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { AsyncHandler } from "../utlis/AsyncHandler.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import duration from "dayjs/plugin/duration.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const sendMessage = AsyncHandler(async (req, res) => {
    
    const { receiver, content } = req.body;

    if (!receiver || !content) {
        throw new ApiError(400, "Receiver and content are required fields.");
    }

    const currentDate = dayjs().format("YYYY-MM-DDTHH:mm");

    const timeStartDate = dayjs(`${currentDate}`).tz("Asia/Kolkata");
    const formattedStartDate = timeStartDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");


    // Creating the message object to be sent to the receiver
    const newMessage = new Message({
        sender: req.user._id,
        receiver,
        content,
        timestamp: formattedStartDate,
    });

    // Save the message in the database
    const savedMessage = await newMessage.save();
    if (!savedMessage) {
        throw new ApiError(500, "Failed to save message in the database.");
    }

    // Add sender to receiver's contact list if not already added
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
        throw new ApiError(404, "Receiver not found.");
    }

    if (!receiverUser.contacts.includes(req.user._id)) {
        receiverUser.contacts.push(req.user._id);
        await receiverUser.save();

        // Emit a `newContact` event to the receiver
        const io = req.app.get('io'); // Get the io instance set in index.js
        if (!io) {
            throw new ApiError(500, "Socket.io instance not found.");
        }

        io.to(receiver).emit('newContact', {
            _id: req.user._id,
            fullName: req.user.fullName,
            avatar: req.user.avatar,
        });
    }

    // Emit the message to the receiver using Socket.io
    const io = req.app.get('io');
    if (!io) {
        throw new ApiError(500, "Socket.io instance not found.");
    }
    io.to(receiver).emit('sendChatMessage', savedMessage);

    // Return a success response
    return res.status(200).json(
        new ApiResponse(200, savedMessage, "Message sent successfully.")
    );
});



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
const updateMessageStatus = AsyncHandler(async (req, res) => {
    const { messageId, status } = req.body;

    try {
        const message = await Message.findByIdAndUpdate(messageId,
            {
                status,
            },
            {
                new: true
            }
        )

        return res.status(200).json(
            new ApiResponse(200, message, "Update Status Successfully")
        )

    } catch (error) {
        console.error('Error in generateAccessAndRefreshToken:', error);
        throw new ApiError(400, "Something went wrong while generating Refresh and Access Token ")
    }

})


export { sendMessage, getMessage, updateMessageStatus }