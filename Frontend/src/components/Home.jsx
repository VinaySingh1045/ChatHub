import { useEffect, useState } from "react";
import LeftContainer from "./ContactContainer/LeftContainer";
import RightContainer from "./MessageContainer/RightContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [activeChatUser, setActiveChatUser] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [navigate, user]);

    const handleUserSelect = (user) => {
        setActiveChatUser(user);
    };

    return (
        <>
            <div className="flex flex-col h-[90vh] bg-gray-100 lg:flex-row">
                {/* Sidebar */}
                <LeftContainer onSelectUser={handleUserSelect} />

                {/* Chat Area */}
                {activeChatUser ? (
                    <RightContainer activeUser={activeChatUser} />
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
