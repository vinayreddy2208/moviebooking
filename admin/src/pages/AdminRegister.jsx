import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from "axios";

function AdminRegister() {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [redirect, setRedirect] = useState(false);

    async function registerAdmin(ev) {
        ev.preventDefault();
        try {
            await axios.post('/admin/register', {
                username, password,
            })
            alert('Successfully registered')
            setRedirect(true)
        }
        catch (e) {
            console.log(e)
            alert('Registration failed')
        }
    }

    if (redirect) {
        return <Navigate to={'/admin'} />
    }

    return (
        <div className="flex grow justify-center items-center py-10 h-screen">
            <div className="mb-24 py-5 px-2 text-center">
                <h1 className="text-[2.2em] font-semibold mb-4"> Welcome, New <span className="text-primary">Admin</span> </h1>
                <motion.form
                    className="gap-6 max-w-[22em] p-3"
                    onSubmit={registerAdmin}>
                    <input type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={ev => setUserName(ev.target.value)} />

                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} />

                    <button className="primary"> Sign Up </button>

                </motion.form>
            </div>
        </div>
    );
}

export default AdminRegister;