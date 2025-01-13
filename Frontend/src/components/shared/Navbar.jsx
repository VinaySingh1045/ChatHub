import { LogOutIcon, UserIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/features/authSlice";
import { toast } from "sonner";
import Profile from "../UserProfile/Profile";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = async () => {

        try {
            const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, {
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/login");
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error((error.response?.data?.message || "Logout failed"));
        }

    }

    return (
        <>
            <div className="shadow-2xl border-b-2">
                <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
                    <div className="font-bold text-3xl cursor-pointer">
                        <span className="text-4xl"></span> Chat
                        <span className="text-blue-600">Hub</span>
                    </div>

                    {user ? (
                        <div>
                            <Popover>
                                <PopoverTrigger>
                                    <div className="flex justify-center items-center gap-3 font-medium text-lg">
                                        <Avatar>
                                            <AvatarImage src={user?.user?.avatar} />
                                        </Avatar>
                                        <span>{user?.user?.fullName}</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex gap-4 items-center">
                                        <Avatar>
                                            <AvatarImage src={user?.user?.avatar} />
                                        </Avatar>
                                        <div>
                                            <h2>{user?.user?.fullName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.user?.bio || "No bio available"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <UserIcon className="h-6 w-6 text-gray-500 mt-4 mx-2" />
                                        <p className="mt-4">
                                            <button onClick={() => setIsProfileOpen(true)} className="text-[19px] ml-4">Your Profile</button>
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <LogOutIcon className="h-6 w-6 text-gray-500 mt-4 mx-3" />
                                        <p className="mt-4">
                                            <button onClick={handleLogout} className="text-[19px] ml-4">Logout</button>
                                        </p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) :
                        <>
                            <div className='flex gap-2'>
                                <Link to={"/login"}>
                                    <button className='bg-blue-500 text-white font-bold p-3 rounded-lg'>Login</button>
                                </Link>
                                <Link to={"/signup"}>
                                    <button className='bg-blue-500 text-white font-bold p-3 rounded-lg'>Signup</button>
                                </Link>
                            </div>

                        </>
                    }
                </div>
            </div>
            {isProfileOpen && <Profile open={isProfileOpen} setOpen={setIsProfileOpen} />}
        </>
    );
};

export default Navbar;
