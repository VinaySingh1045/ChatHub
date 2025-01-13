import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";

const Signup = () => {

    const [userData, setUserData] = useState(
        {
            fullName: "",
            email: "",
            password: "",
            avatar: "",
        }
    )
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "avatar") {
            setUserData({ ...userData, [e.target.name]: e.target.files[0] })
        }
        else {

            setUserData({ ...userData, [e.target.name]: e.target.value })
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData();
        formData.append("fullName", userData.fullName);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        if (userData.avatar) {
            formData.append("avatar", userData.avatar);
        }
        if(!userData.avatar){
            toast.error("Please select an avatar")
            return; 
        }
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("User created successfully");
                navigate('/login'); 
            }

            if (res.status === 201) {
                setUserData({
                    fullName: "",
                    email: "",
                    password: "",
                    avatar: "",
                })
            }

        } catch (error) {
            setLoading(false);
            if(error.response && error.response.status === 409) {
                toast.error("Email already exists")
            }
            console.error("Error Frontend",error);
        }
        finally {
            setLoading(false)
        }


    }

    return (
        <>
            <div className="flex justify-center items-center min-h-[90vh] bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-10">
                    <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={userData.fullName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                pattern="(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%!]).{8,}"
                                title="Password must have at Least one Capital letter and at Least eight letters and one special character"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

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
                        </div>


                        {
                            loading ? (<div className="mb-6">
                                <button
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Please wait
                                </button>
                            </div>) : (<div className="mb-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Signup
                                </button>
                            </div>)
                        }

                    </form>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account?
                            <Link to={"/login"} className="text-indigo-600 hover:text-indigo-800 ml-1">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
