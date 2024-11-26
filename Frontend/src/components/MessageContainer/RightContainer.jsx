import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import { MESSAGE_API_END_POINT } from "../utils/constant";

const socket = io("http://localhost:3000", { withCredentials: true });

const RightContainer = ({ activeUser }) => {
    const { user } = useSelector((state) => state.auth);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (user?.user?._id) {
            socket.emit("joinRoom", user?.user?._id); // Join user's room
        }
    }, [user]);

    useEffect(() => {
        getMessage();

        // Listen for real-time messages and update messages for both sender and receiver
        socket.on("sendChatMessage", (newMessage) => {
            if (newMessage.sender === activeUser?._id || newMessage.receiver === activeUser?._id) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        // Cleanup listener on component unmount
        return () => {
            socket.off("sendChatMessage");
        };
    }, [activeUser]);

    const getMessage = async () => {
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}/getMessage`, {
                params: {
                    receiver: activeUser?._id,
                },
                withCredentials: true,
            });
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${MESSAGE_API_END_POINT}/sendMessage`,
                {
                    receiver: activeUser?._id,
                    content: message,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                // Update messages for the sender
                const newMessage = res.data.data; // This is the message returned after sending

                setMessages((prev) => [...prev, newMessage]); // Add the sender's message to the state
                setMessage(""); // Reset the input field
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center gap-4">
                    <img
                        src={activeUser?.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-medium">{activeUser?.fullName}</p>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 bg-gray-200 rounded-full">
                        <i className="fas fa-video"></i>
                    </button>
                    <button className="p-2 bg-gray-200 rounded-full">
                        <i className="fas fa-phone"></i>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === user?.user?._id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`${
                                    msg.sender === user?.user?._id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-black"
                                } px-4 py-2 rounded-lg max-w-xs`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-600"
                        name="message"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg">
                        <i>
                            <img src="/send_image.png" alt="" className="h-10" />
                        </i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightContainer;
