import { Search } from 'lucide-react'
// import React from 'react'

const LeftContainer = () => {
    return (
        <>
            <div className="w-full lg:w-1/4 bg-white border-r">
                <div className="p-4 border-b">
                    <h1 className="text-lg font-bold text-blue-600">Messaging</h1>
                    <div className="mt-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500">
                            {/* Search Icon */}
                            <Search className="text-gray-500" />

                            {/* Search Input */}
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search friends"
                                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto">
                    <div className="p-4">
                        {/* Contact Item */}
                        <div className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer border-b-2">
                            <div className="relative">
                                <img
                                    src="https://avatars.githubusercontent.com/u/124599?v=4"
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Eten Hunt</p>
                                <p className="text-xs text-gray-500">Thank you very much...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftContainer
