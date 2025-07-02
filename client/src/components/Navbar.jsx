
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import spinner from '../assets/spinner.gif';

function Navbar() {

    const [click, setClick] = useState(false);
    const { user, setUser, ready } = useContext(UserContext);

    function toggle() {
        setClick(!click)
    }

    function kickOut() {
        axios.post('/logout').then(response => {
            alert('Successfully logged out')
            setUser(null);
        })
    }

    if (!ready) {
        return;
    }

    return (
        <div className="flex h-14 items-center justify-between px-8 pb-3">
            <Link className='' to={'/'}>
                <span className="text-2xl text-zinc-700 font-semibold">Booking <span className="text-primary">Application</span></span>
            </Link>
            <div className='border border-red-500 relative'>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className='flex gap-3'
                >
                    {!!user == false && (
                        <Link to={'/login'} className='flex border justify-center items-center px-2 py-2 rounded-[0.35em] hover:bg-zinc-50'>
                            <span className='font-medium'>Sign in</span>
                        </Link>
                    )}

                    {user && (
                        <Link onClick={user ? toggle : null} to={user ? null : '/login'} className='px-1.5 py-1.5 border rounded-[0.4em] flex items-center gap-2 cursor-pointer'>

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg>

                        </Link>
                    )}

                </motion.div>
                {click && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.20 }}
                            className='flex-col absolute bg-white bg-opacity-100 right-0 justify-center items-center mt-2.5 border w-[10em] py-2 px-1.5 z-50 border-gray-200 rounded-[0.75em] text-md'>
                            <Link onClick={toggle} to={'/user/profile'} className='flex items-center gap-2 border rounded-[0.45em] px-2 py-1.5 hover:bg-zinc-50 hover:text-primary '>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                Profile

                            </Link>

                            <Link onClick={toggle} to={'/user/bookings'} className="flex items-center gap-2 border rounded-[0.45em] mt-1.5 px-2 py-1.5 hover:bg-zinc-50 hover:text-primary ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                </svg>

                                My Bookings

                            </Link>

                            <button onClick={() => { kickOut(), toggle() }} className='flex grow items-center gap-2 border w-full rounded-[0.45em] mt-1.5 px-2 py-1.5 hover:bg-zinc-50 hover:text-primary'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                </svg>

                                Logout

                            </button>
                        </motion.div>
                    </AnimatePresence>

                )}
            </div>
        </div>
    );
}

export default Navbar;