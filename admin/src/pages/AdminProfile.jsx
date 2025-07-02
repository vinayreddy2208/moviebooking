import { AdminContext } from "../AdminContext";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";

function AdminProfile() {

    const { admin, ready } = useContext(AdminContext);

    if (!ready) {
        return;
    }

    if (ready && !admin) {
        return <Navigate to={'/login'} />
    }


    return (
        <div className="flex justify-center text-lg mt-4">
            Logged in as <span className="text-primary cursor-pointer">&nbsp;{admin.username}</span>
        </div>
    );
}

export default AdminProfile;