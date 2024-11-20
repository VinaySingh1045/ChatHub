import LeftContainer from "./ContactContainer/LeftContainer";
import RightContainer from "./MessageContainer/RightContainer";

const Home = () => {
    return (

        <>
            <div className="flex flex-col h-[90vh] bg-gray-100 lg:flex-row">
                {/* Sidebar */}
                <LeftContainer />

                {/* Chat Area */}
                <RightContainer />
            </div>
        </>
    );
};

export default Home;
