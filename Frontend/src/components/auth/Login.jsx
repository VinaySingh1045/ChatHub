import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { USER_API_END_POINT } from "../utils/constant"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "@/features/authSlice"

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)


        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, userData, {
                withCredentials: true
            })

            // console.log(res.data.data)

            if (res.data.success) {
                // const userInfo = res.data.data.user
                const userInfo = res.data.data
                dispatch(setUser(userInfo))
                toast.success(res.data.message)
                navigate('/')
            } else {
                navigate("/login")
                toast.error(res.data.message)
            }

            if (res.status === 200) {
                setUserData({
                    email: "",
                    password: "",
                })
            }
        } catch (error) {
            // console.log(error)
            toast.error(error)

        }
        finally {
            setLoading(false)
        }

    }

    return (
        <>
            <div className="flex justify-center items-center min-h-[90vh] bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-10">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <form onSubmit={handleSubmit}>
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {
                            loading ? <div className="mb-6 flex items-center"> <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
                                Please wait </button>
                            </div> : <div className="mb-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Login
                                </button>
                            </div>
                        }


                    </form>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Not an account?
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 ml-1">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
