import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/features/authSlice";
import { toast } from "sonner";
import { X } from "lucide-react";

const Profile = ({ open, setOpen }) => {
    const { user } = useSelector((state) => state.auth);
    console.log("User data updated:", user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullName: user?.user?.fullName || "",
        bio: user?.user?.bio || "",
    });

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const UserData = {
            fullName: input.fullName,
            bio: input.bio,
        };

        try {
            const res = await axios.put(
                `${USER_API_END_POINT}/updateProfile`,
                UserData,
                { withCredentials: true }
            );

            if (res.data.success) {
                //   dispatch(setUser(res.data.data)); // Update Redux store
                dispatch(setUser({
                    ...user,
                    user: {
                        ...user.user,
                        fullName: res.data.data.fullName || user.user.fullName,
                        bio: res.data.data.bio || user.user.bio,
                    }
                }));    

                toast.success(res.data.message); 
                setOpen(false); 
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to update profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
        >
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <button
                        type="button"
                        className="absolute top-2 right-5 text-gray-500"
                        onClick={() => setOpen(false)} // Close the dialog
                    >
                        <X className="h-4 w-4" />
                    </button>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="fullName"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={input.fullName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="bio"
                        >
                            Bio
                        </label>
                        <input
                            type="text"
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your bio"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`bg-blue-600 text-white font-bold py-2 px-4 rounded w-full ${loading ? "cursor-not-allowed opacity-50" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Update"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Profile;
