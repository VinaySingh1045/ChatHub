import { LogOutIcon, UserIcon } from "lucide-react"
// import { Link } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Avatar, AvatarImage } from "../ui/avatar"

const Navbar = () => {
    return (
        <>
            <div className='shadow-2xl border-b-2'>
                <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                    <div className='font-bold text-3xl cursor-pointer'>
                        <span className='text-4xl'></span> Chat<span className='text-red-500'>Hub</span>
                    </div>

                    <div className="">
                        <Popover>
                            <PopoverTrigger>
                                <Avatar>
                                    <AvatarImage src={"https://avatars.githubusercontent.com/u/124599?v=4"}
                                    />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className='flex gap-4 items-center'>
                                    <Avatar>
                                        <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4"
                                        />
                                    </Avatar>
                                    <div>
                                        <h2>Vinay Singh</h2>
                                        <p className='text-sm text-muted-foreground'>
                                            Bio: I am a Coder and I make errors
                                        </p>
                                    </div>

                                </div>
                                <div className='flex items-center'>
                                    <UserIcon className="h-6 w-6 text-gray-500 mt-4 mx-2" />
                                    <p className='mt-4'>
                                        <button className='text-[19px] ml-4'>
                                            Your Profile
                                        </button>
                                    </p>
                                </div>
                                <div className='flex items-center'>
                                    <LogOutIcon className="h-6 w-6 text-gray-500 mt-4 mx-3" />
                                    <p className='mt-4'>
                                        <button className='text-[19px] ml-4'>Logout</button>
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>

                    </div>


                </div>
            </div>

        </>
    )
}

export default Navbar
