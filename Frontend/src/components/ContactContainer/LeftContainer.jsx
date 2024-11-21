import axios from 'axios';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { USER_API_END_POINT } from '../utils/constant';
// import { useSelector } from 'react-redux';
const LeftContainer = ({ onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // const { user } = useSelector((state) => state.auth);


    // const u = useSelector((state) => state.auth.user);
    // console.log(u)

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setQuery(searchValue);

        if (searchValue.trim()) {
            fetchSearchResults(searchValue);
        } else {
            setSearchResults([]); // Clear results if the input is empty
        }
    };

    const fetchSearchResults = async (searchTerm) => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/searchUsers?searchTerm=${searchTerm}`,
                { withCredentials: true }
            );
            // console.log(res.data.data)
            if (res.data.success) {
                setSearchResults(res.data.data);
            } else {
                console.error("Error fetching search results");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleUserClick = async (user) => {
        try {
            const res = await axios.put(`${USER_API_END_POINT}/updateContacts`,
                {
                    contacts: [user._id]
                },
                { withCredentials: true }
            )
            // console.log(res.data.data)
            if (res.data.success) {
                console.log("User added to contacts successfully");
                onSelectUser(user); // Pass the selected user to the parent component
            } else {
                console.error("Failed to add user to contacts");
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
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
                            value={query}
                            onChange={handleChange}
                            placeholder="Search friends"
                            className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-y-auto">
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer border-b-2"
                            onClick={() => handleUserClick(user)}
                        >
                            <div className="relative">
                                <img
                                    src={user.avatar || "https://via.placeholder.com/150"}
                                    alt={user.fullName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.fullName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-sm text-gray-500">
                        {query ? "No results found" : "Start searching for friends"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LeftContainer;
