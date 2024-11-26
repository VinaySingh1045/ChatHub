import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { USER_API_END_POINT } from '../utils/constant';
import { useSelector } from 'react-redux';

const LeftContainer = ({ onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);
    
    // Console log to check the structure of the user object
    // console.log('User from Redux:', user);
    // console.log('Contacts from User:', user?.user?.contacts);

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setQuery(searchValue);

        if (searchValue.trim()) {
            fetchSearchResults(searchValue);
        } else {
            setSearchResults([]); // Clear search results if query is empty
        }
    };

    const fetchSearchResults = async (searchTerm) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${USER_API_END_POINT}/searchUsers?searchTerm=${searchTerm}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setSearchResults(res.data.data);
            } else {
                console.error("Error fetching search results");
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (selectedUser) => {
        try {
            const res = await axios.put(
                `${USER_API_END_POINT}/updateContacts`,
                { contacts: [selectedUser._id] },
                { withCredentials: true }
            );

            if (res.data.success) {
                console.log("User added to contacts successfully");
                onSelectUser(selectedUser); // Notify parent component
            } else {
                console.error("Failed to add user to contacts");
            }
        } catch (error) {
            console.error("Error updating contacts:", error);
        }
    };

    return (
        <div className="w-full lg:w-1/4 bg-white border-r">
            <div className="p-4 border-b">
                <h1 className="text-lg font-bold text-blue-600">Messaging</h1>
                <div className="mt-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500">
                        <Search className="text-gray-500" />
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
                {loading ? (
                    <div className="p-4 text-center flex gap-3">
                        <span className="loader"><Loader2/></span>
                        <p className="text-sm text-gray-500">Searching...</p>
                    </div>
                ) : query.trim() ? (
                    searchResults.length > 0 ? (
                        searchResults.map((us) => (
                            <div
                                key={us._id}
                                className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer border-b-2"
                                onClick={() => handleUserClick(us)}
                            >
                                <div className="relative">
                                    <img
                                        src={us.avatar || "https://via.placeholder.com/150"}
                                        alt={us.fullName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{us.fullName}</p>
                                    <p className="text-xs text-gray-500">{us.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-500">No results found</p>
                    )
                ) : user?.user?.contacts?.length > 0 ? (
                    user.user.contacts.map((contact) => (
                        <div
                            key={contact._id}
                            className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer border-b-2"
                            onClick={() => onSelectUser(contact)}
                        >
                            <div className="relative">
                                <img
                                    src={contact.avatar || "https://via.placeholder.com/150"}
                                    alt={contact.fullName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{contact.fullName}</p>
                                <p className="text-xs text-gray-500">{contact.email}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-sm text-gray-500">
                        You don’t have any contacts yet. Start searching to add new friends!
                    </p>
                )}
            </div>
        </div>
    );
};

export default LeftContainer;
