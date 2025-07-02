import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navbar2 from "./components/Navbar2";

function Layout() {
    return(
        <div className="pt-3">
            <Navbar2 />
            <Outlet />
        </div>
    );
}

export default Layout;