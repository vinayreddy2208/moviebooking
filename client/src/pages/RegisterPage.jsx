import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorNotification, SuccessNotification, WarningNotification } from "../components/ShowNotifications";

function RegisterPage() {

    const [name, setName] = useState('');
    const [dob, setDOB] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [secondPhase, setSecondPhase] = useState('');
    const [redirect, setRedirect] = useState(false);

    function handleFirstPhase(ev) {
        ev.preventDefault();
        notifications.clean()
        if (!email || !password) {
            WarningNotification("Enter Details First")
            return
        }
        setSecondPhase(true);
    }

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name, email, dob, password
            })
            SuccessNotification("Successfully registered")
            setRedirect(true)
        }
        catch (e) {
            ErrorNotification("Registration failed")
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="flex grow justify-center items-center py-10 h-screen">
            <div className="mb-24 py-5 px-2 text-center">
                <h1 className="text-[2.2em] font-semibold mb-4"> Create an account </h1>
                {!!secondPhase == false && (
                    <motion.form
                        className="gap-6 max-w-[22em] p-3"
                        onSubmit={handleFirstPhase}>
                        <input type="email"
                            placeholder="Email Address"
                            className="!font-medium"
                            value={email}
                            onChange={ev => setEmail(ev.target.value)} />

                        <input type="password"
                            placeholder="Password"
                            className="!font-medium"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)} />

                        <button className="primary"> Continue </button>

                    </motion.form>

                )}

                {secondPhase == true && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}

                        onSubmit={registerUser}
                        className="gap-6 max-w-[22em] p-3">

                        <input type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={ev => setName(ev.target.value)} />

                        <input type="text"
                            placeholder="Date of Birth (dd-mm-yyyy)"
                            value={dob}
                            onChange={ev => setDOB(ev.target.value)} />

                        <button className="primary"> Sign Up </button>

                    </motion.form>
                )}
                <div className="text-center py-3 mt-1.5 text-gray-500">
                    Already have an account? <Link to={'/login'}>&nbsp;<span className='hover:underline text-primary'>Login</span></Link>
                </div>

            </div>
        </div>
    );
}

export default RegisterPage;