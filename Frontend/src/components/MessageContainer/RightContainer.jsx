const RightContainer = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
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
                    <p className="text-gray-500 text-center">Start chatting with {user.fullName}</p>
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-600"
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-lg">
                        <i> <img src="/send_image.png" alt="" className="h-10" /> </i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightContainer;
