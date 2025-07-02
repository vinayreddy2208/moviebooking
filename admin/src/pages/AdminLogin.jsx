import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../AdminContext";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from "@tabler/icons-react";

function AdminLogin() {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const { setAdmin } = useContext(AdminContext);

    const [redirect, setRedirect] = useState(false);

    async function Login(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/admin/login', { username, password })
            console.log(response.data);
            if (response.data == "Admin Not Found") {
                notifications.show({
                    title: "Admin Not Found",
                    message: "Contact the Accounts Manager.",
                    radius: 'md',
                    color: 'orange',
                    icon: <IconX />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 2500,
                    position: 'top-center'
                })
                return;
            }
            setAdmin(response.data);
            notifications.show({
                title: "Login Successful",
                radius: 'md',
                color: 'green',
                icon: <IconCheck />,
                withCloseButton: true,
                withBorder: true,
                autoClose: 1500,
                position: 'top-center'
            })
            setRedirect(true)
        }
        catch (e) {
            notifications.show({
                title: "Login Failed",
                radius: 'md',
                color: 'red',
                icon: <IconX />,
                withCloseButton: true,
                withBorder: true,
                autoClose: 2500,
                position: 'top-center'
            })
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="flex grow justify-center items-center py-10 h-screen">
            <div className="mb-24 py-5 px-2 text-center">
                <h1 className="text-[2.2em] font-semibold mb-4">Login as <span className="text-primary">Admin</span></h1>
                <form className="gap-6 max-w-[22em] p-3"
                    onSubmit={Login}>

                    <input type="text"
                        placeholder="Enter Username"
                        className="!font-medium"
                        value={username}
                        onChange={ev => setUserName(ev.target.value)} />

                    <input type="password"
                        placeholder="Password"
                        className="!font-medium"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} />

                    <button className="primary"> Login </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;