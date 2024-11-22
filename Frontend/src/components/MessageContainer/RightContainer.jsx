import axios from "axios";
import { useEffect, useState } from "react";
import { MESSAGE_API_END_POINT } from "../utils/constant";
import { useSelector } from "react-redux";

const RightContainer = ({ activeUser }) => {

    const { user } = useSelector(state => state.auth)
    // console.log(user?.user?._id)

    // console.log(activeUser?._id)
    const [message, setMessage] = useState("")
    // console.log(message);

    const [messages, setMessages] = useState([])
    // console.log(messages)

    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    useEffect(() => {
      getMessage()
    }, [])
    

    const getMessage = async () => {
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}/getMessage`, {
                params: {
                    receiver: activeUser?._id
                },
                withCredentials: true
            })
            if (res.data.success) {
                // console.log("Fetched messages:", res.data.data);
                // Update your state with the fetched messages
                setMessages((prev)=> res.data.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        // console.log(message)

        try {
            const res = await axios.post(`${MESSAGE_API_END_POINT}/sendMessage`,
                {
                    receiver: activeUser?._id,
                    content: message,
                },
                {
                    withCredentials: true
                }
            )

            if (res.data.success) {
                console.log("Message sent successfully:", res.data.data);
                // Optionally reset the input field after sending
                setMessages((prev) => [...prev, res.data.data]);
                setMessage("");
            }

        } catch (error) {
            console.log(error)
        }


    }

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
                            className={`flex ${msg.sender === user?.user?._id ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`${msg.sender === user?.user?._id
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
                        onChange={handleChange}
                    />
                    <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg">
                        <i> <img src="/send_image.png" alt="" className="h-10" /> </i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightContainer;
