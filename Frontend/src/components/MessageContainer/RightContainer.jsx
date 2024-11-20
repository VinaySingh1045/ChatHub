const RightContainer = () => {
    return (
        <>
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white border-b">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://avatars.githubusercontent.com/u/124599?v=4"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-medium">Eten Hunt</p>
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
                        {/* Received Message */}
                        <div className="flex items-start gap-4">
                            <img
                                src="https://avatars.githubusercontent.com/u/124599?v=4"
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="bg-gray-200 p-3 rounded-lg">
                                <p className="text-sm">
                                    Morning Eten Hunt, I have a question...
                                </p>
                            </div>
                        </div>
                        {/* Sent Message */}
                        <div className="flex justify-end">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <p className="text-sm">Of course. Thank you so much...</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                        <button className="p-2 bg-blue-500 text-white rounded-lg">
                            <i> <img src="/send_image.png" alt="" className="h-10" /> </i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RightContainer
