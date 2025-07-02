import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconQuestionMark, IconX } from "@tabler/icons-react";
import { ErrorNotification, SuccessNotification, WarningNotification } from "../components/ShowNotifications";

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const { user, setUser, ready } = useContext(UserContext);

    async function Login(ev) {
        ev.preventDefault();
        notifications.clean()
        if (!email || !password) {
            WarningNotification("Enter Details First")
            return
        }
        try {
            const response = await axios.post('/login', { email, password })
            console.log(response.data);
            if (response.data === "Account Not Found") {
                WarningNotification("Account Not Found")
                return;
            }
            if (response.data === 'Wrong Password') {
                ErrorNotification("Wrong Password")
                return
            }
            setUser(response.data);
            SuccessNotification("Login Successful")
            setRedirect(true)
        }
        catch (e) {
            ErrorNotification("Login Failed")
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    if (!ready) {
        return;
    }

    if (ready && user) {
        return <Navigate to={'/user/profile'} />
    }

    return (
        <div className="flex grow justify-center items-center py-10 h-screen">
            <div className="mb-24 py-5 px-2 text-center">
                <h1 className="text-[2.2em] font-semibold mb-4">Welcome back</h1>
                <form className="gap-6 max-w-[22em] p-3"
                    onSubmit={Login}>

                    <input type="email"
                        placeholder="Email Address"
                        value={email}
                        className="!font-medium"
                        onChange={ev => setEmail(ev.target.value)} />

                    <input type="password"
                        placeholder="Password"
                        value={password}
                        className="!font-medium"
                        onChange={ev => setPassword(ev.target.value)} />

                    <button className="primary"> Login </button>

                </form>
                <div className="text-center py-3 mt-1.5 text-gray-500">
                    Don't have an account? <Link to={'/register'}>&nbsp;<span className='hover:underline text-primary'>Sign Up</span></Link>
                </div>

            </div>
        </div>
    );
}

export default LoginPage;