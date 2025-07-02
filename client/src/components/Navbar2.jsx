
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import spinner from '../assets/spinner.gif';
import { Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Cookies from 'js-cookie';
import { notifications } from "@mantine/notifications";
import { IconCheck, IconLogout } from "@tabler/icons-react";
import { SuccessNotification } from "./ShowNotifications";

function Navbar2() {

    const [opened, { open, close }] = useDisclosure(false);

    const { user, city, setCity, setUser, ready } = useContext(UserContext);
    let info = null;

    const getUserLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                info = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                axios.post('/getcity', { info }).then(res => {
                    setCity(res.data)
                });
            })
        }
    }

    useEffect(() => {
        if (!Cookies.get('city')) {
            getUserLocation()
        }
        if (Cookies.get('city')) {
            setCity(Cookies.get('city'))
        }
    }, [])

    function manualSetCity(city) {
        axios.post('/setcity', { city }).then(res => {
            setCity(res.data)
        })
    }

    function cityStyle(each) {
        if (city == each) {
            return "border cursor-pointer bg-primary text-white hover:bg-[#eb4157] text-center px-4 py-3 rounded-md"
        }
        return "border cursor-pointer hover:bg-zinc-100 text-center px-4 py-3 rounded-md"
    }

    const cities = ["Chennai", "Bengaluru", "Hyderabad", "Mumbai", "Kolkata"]

    function kickOut() {
        axios.post('/logout').then(response => {
            SuccessNotification("Successfully Logged Out")
            setUser(null);
        })
    }

    if (!ready) {
        return;
    }

    return (
        <div className="flex h-14 items-center justify-between px-4 xl:px-8 pb-3">

            <Modal transitionProps={{ duration: 250, transition: 'pop' }} opened={opened} onClose={close} size="auto" title="Select a city from the list">

                <div className="flex flex-col gap-4 px-4 py-5 items-center justify-center">
                    <div className="px-2 pb-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {cities.map((each, index) => (
                            <div key={index} onClick={() => {
                                manualSetCity(each)
                                close()
                            }} className={cityStyle(each)}>
                                {each}
                            </div>
                        ))}
                    </div>

                    <div onClick={() => {
                        getUserLocation()
                        close()
                    }} className="flex gap-2 items-center border cursor-pointer hover:bg-zinc-100 text-center px-4 py-3 rounded-md">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                        </svg>

                        Detect Location
                    </div>

                    <div>
                        <p className="text-gray-400">*Only a limited number of cities are added for testing</p>
                    </div>
                </div>

            </Modal>


            <Link className='' to={'/'}>
                <span className="text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl text-zinc-700 font-semibold">Booking <span className="text-primary">Application</span></span>
            </Link>

            <div className="flex items-center gap-4" >

                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={open}
                    className="flex gap-2 hover:bg-zinc-50 justify-between cursor-pointer items-center border py-2 px-4 rounded-lg">

                    <p className="font-normal">{city ? city : "Select a city"}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[2.35vh]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                </motion.div>

                {!!user == false && (
                    <Link to={'/login'} className='flex border justify-center items-center px-2 py-2 rounded-[0.35em] hover:bg-zinc-50'>
                        <span className='font-medium'>Sign in</span>
                    </Link>
                )}
                {user && (
                    <Menu position="bottom-end" shadow="sm" radius="md" width={180}>
                        <Menu.Target>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="px-2 py-2 border rounded-[0.4em] flex items-center gap-2 cursor-pointer">


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                </svg>

                            </motion.div>
                        </Menu.Target>

                        <Menu.Dropdown style={{ flex: 1, padding: '6px 7px' }}>
                            <Link to={'/user/profile'}>
                                <Menu.Item style={{ border: '1px solid #ddd' }}>
                                    <div className="flex items-center gap-2 py-0.5 md:text-xl xl:text-[1.15em]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>

                                        Profile
                                    </div>
                                </Menu.Item>
                            </Link>

                            <Link to={'/user/bookings'}>
                                <Menu.Item style={{ border: '1px solid #ddd', marginTop: '5px' }}>
                                    <div className="flex items-center gap-2 py-0.5 text-[1.15em]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                        </svg>

                                        My Bookings

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


        </div>
    );
}

export default Navbar2