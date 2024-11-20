import { Outlet } from "react-router-dom"
import Navbar from "./shared/Navbar"

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}

export default Layout
