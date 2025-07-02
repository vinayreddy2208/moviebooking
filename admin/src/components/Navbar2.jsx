
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useState } from 'react';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import { Menu, Button, Text, rem } from '@mantine/core';
import { AdminContext } from "../AdminContext";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconQuestionMark } from "@tabler/icons-react";

function Navbar2() {

    const [click, setClick] = useState(false);
    const { admin, setAdmin, ready } = useContext(AdminContext);

    function kickOut() {
        axios.post('/admin/logout').then(response => {
            notifications.show({
                title: "Successfully Logged out",
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
    }

    return (
        <div className="flex h-14 items-center justify-between px-5 sm:px-8 md:px-8 lg:px-8 xl:px-8 pb-3">
            <Link className='' to={'/'}>
                <span className="text-2xl text-zinc-700 font-semibold">Admin <span className="text-primary">Portal</span></span>
            </Link>
            {!!admin == false && (
                <Link to={'/login'} className='flex border justify-center items-center px-2 py-2 rounded-[0.35em] hover:bg-zinc-50'>
                    <span className='font-medium'>Sign in</span>
                </Link>
            )}
            {admin && (
                <Menu position="bottom-end" shadow="sm" radius="md" width={167}>
                    <Menu.Target>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="px-1.5 py-1.5 border rounded-[0.4em] flex items-center gap-2 cursor-pointer">


                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg>

                        </motion.div>
                    </Menu.Target>

                    <Menu.Dropdown style={{ flex: 1, padding: '6px 6px' }}>

                        <Link to={'/'}>
                            <Menu.Item style={{ border: '1px solid #ddd' }}>
                                <div className="flex items-center gap-2 py-0.5 text-[1.15em]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                    </svg>

                                    Dashboard

                                </div>
                            </Menu.Item>
                        </Link>


                        <Link to={'/admin/profile'}>
                            <Menu.Item style={{ border: '1px solid #ddd', marginTop: '5px' }}>
                                <div className="flex items-center gap-2 py-0.5 text-[1.15em]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    Profile
                                </div>
                            </Menu.Item>
                        </Link>

                        <div onClick={() => kickOut()}>
                            <Menu.Item style={{ border: '1px solid #ddd', marginTop: '5px' }} color="red">
                                <div className="flex items-center gap-2 py-0.5 text-[1.15em]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    Logout

                                </div>
                            </Menu.Item>
                        </div>



                    </Menu.Dropdown>
                </Menu>
            )}

        </div>
    );
}

export default Navbar2