import { useContext } from "react";
import { AdminContext } from "../AdminContext";
import spinner from '../assets/spinner.gif';
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from "@tabler/icons-react";

function Admin() {

    const { admin, ready, setAdmin } = useContext(AdminContext);

    function kickOut() {
        axios.post('/admin/logout').then(response => {
            notifications.show({
                title: "Logged Out Successfully",
                radius: 'md',
                color: 'green',
                icon: <IconCheck />,
                withCloseButton: true,
                withBorder: true,
                autoClose: 1500,
                position: 'top-center'
            })
            setAdmin(null);
        })
    }

    if (!ready) {
        return;
        // return <div className="flex absolute h-screen w-screen justify-center items-center"><img className="w-14 mb-10" src={spinner} alt="" /></div>
    }

    if (ready && !admin) {
        return <Navigate to={'/admin/login'} />
    }

    const h1Class = "border flex items-center justify-center px-4 py-3 rounded-[0.4em] hover:bg-zinc-50 cursor-pointer"

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }} className="p-3">
                <h1 className="text-[1.8em] font-semibold">Welcome, <span className="text-primary">{admin.username}</span></h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className="flex justify-center p-2 gap-5 text-lg mt-2">

                <Link className={h1Class} to={'/movies/available'}>
                    <motion.h1 whileTap={{ scale: 0.96 }}>
                        Movies
                    </motion.h1>
                </Link>

                <motion.h1 whileTap={{ scale: 0.96 }} className={h1Class}>
                    <Link to={'/theatres'}>
                        Theatres
                    </Link>
                </motion.h1>

                <motion.h1 whileTap={{ scale: 0.96 }} className={h1Class}>Users</motion.h1>
                {/* <motion.h1 whileTap={{ scale: 0.96 }} className={h1Class}>Admins</motion.h1> */}
                {/* <h1 className={h1Class}></h1> */}
            </motion.div>

            <div className="w-28 mt-4">
                <motion.button whileTap={{ scale: 0.96 }} onClick={kickOut} className="primary">Logout</motion.button>
            </div>
        </div>
    );
}

export default Admin;