import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/features/authSlice";
import { toast } from "sonner";


const Profile = ({ open, setOpen }) => {

    const { user } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        fullName: user?.user?.fullName || "",
        bio: user?.user?.bio || "",
    })

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    // }

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    // const handleUpdateProfile = async () => {
    //     // e.preventDefault();
    //     const UserData = {
    //         fullName: input.fullName,
    //         bio: input.bio,
    //     }
    //     setLoading(true);

    //     try {
    //         const res = await axios.put(`${USER_API_END_POINT}/updateProfile`, UserData, {
    //             withCredentials: true,
    //         })

    //         if (res.status.success) {
    //             dispatch(setUser(res.data.data))
    //             toast.success(res.data.message);
    //             setOpen(false);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }

    // }

    // const handleUpdateProfile = async (e) => {
    //     e.preventDefault(); // Prevent the default form submission behavior

    //     const UserData = {
    //         fullName: input.fullName,
    //         bio: input.bio,
    //     };
    //     setLoading(true);

    //     try {
    //         const res = await axios.put(`${USER_API_END_POINT}/updateProfile`, UserData, {
    //             withCredentials: true,
    //         });

    //         if (res.data.success) {
    //             dispatch(setUser(res.data.data)); // Update Redux store
    //             toast.success(res.data.message); // Show success message
    //             setOpen(false); // Close the dialog after successful update
    //         } else {
    //             toast.error("Update failed. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data?.message || "Something went wrong.");
    //     } finally {
    //         setLoading(false); // Reset loading state
    //     }
    // };

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Prevents page reload
        setLoading(true);

        const UserData = {
            fullName: input.fullName,
            bio: input.bio,
        };

        try {
            const res = await axios.put(`${USER_API_END_POINT}/updateProfile`, UserData, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.data)); // Update Redux store
                toast.success(res.data.message); // Show success toast
                setOpen(false); // Close the dialog on success
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
       
    };
    

    useEffect(() => {
        console.log("Dialog open state:", open);
        console.log("User state:", user);
    }, [open, user]);
    

    return (
        <>
            <Dialog open={open}
                onInteractOutside={() => {
                    if (!loading) setOpen(false); // Only close when not loading
                }} >
                <DialogContent className=""  onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                        {/* <button onClick={() => setOpen(false)}
                         className="absolute top-4 right-4 bg-blue-600">X</button> */}
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={input.fullName || ""}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                                Bio
                            </label>
                            <input
                                type="text"
                                id="bio"
                                name="bio"
                                value={input.bio || ""}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your Bio"
                            />
                        </div>


                        {/* 
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                            />
                        </div> */}

                        {
                            loading ? (<div className="mb-6">
                                <button
                                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Please wait...
                                </button>
                            </div>) : (<div className="mb-6">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Update
                                </button>
                            </div>)
                        }

                    </form>

                </DialogContent>
            </Dialog>

        </>
    )
}

export default Profile
