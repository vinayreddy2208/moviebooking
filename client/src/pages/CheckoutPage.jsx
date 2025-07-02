
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Image } from "@mantine/core";
import axios from "axios";
import { motion } from 'framer-motion'
import spinner from '../assets/spinner.gif';
import { UserContext } from "../UserContext";

function CheckoutPage() {

    const { id } = useParams();
    const location = useLocation();
    const { user, ready } = useContext(UserContext);
    const { bookingDate, showTime, screen, totalCost, selectedSeats, theatreID, screenName } = location.state || {};
    const [movie, setMovie] = useState('');
    const [redirect, setRedirect] = useState(false);
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/movies/${id}`).then(res => {
            const movieDoc = res.data
            setMovie(movieDoc);
        })
    }, [id])

    if (!ready) {
        return <div className="flex absolute h-screen w-screen justify-center items-center"><img className="w-14 mb-10" src={spinner} alt="" /></div>
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);

        // Get the day with suffix
        const day = date.getDate();
        const suffix = (day) => {
            if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${suffix(day)} ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
    }


    function confirmTickets(ev) {

        ev.preventDefault();
        const bookingDetails = { id, email: user.email, bookingDate, screen, screenName, showTime, selectedSeats, totalCost }
        console.log(bookingDetails)
        axios.post('/confirm', bookingDetails).then(res => {
            notifications.show({
                title: "Tickets booked successfully",
                radius: 'md',
                color: 'orange',
                icon: <IconCheck />,
                withCloseButton: true,
                withBorder: true,
                autoClose: 2500,
                position: 'top-center'
            })
        })

        axios.put('/reserve', bookingDetails).then(res => {
            console.log(res)
        })

        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/user/bookings'} />
    }

    // console.log(theatreID)
    console.log({ id, user: user._id, email: user.email, bookingDate, screen, showTime, selectedSeats, totalCost })

    return (
        <div className="flex flex-col gap-4">

            <div className="flex justify-center">
                <h1 className="font-semibold text-3xl">Checkout</h1>
            </div>

            <div className="mt-3 border border-opacity-15 bg-zinc-100 rounded-2xl flex gap-4 mx-52 px-6 py-6">
                <motion.div
                    whileTap={{ scale: 0.99 }}
                    transition={{
                        duration: 0.2
                    }}
                    className="sm:w-[6.4em] sm:h-[9.3em] md:w-[9.6em] md:h-[13.95em] lg:w-[12.8em] lg:h-[18.6em] xl:w-[14.4em] xl:h-[20.925em] 2xl:w-[16em] 2xl:h-[23.25]"
                >
                    <Image className="w-full h-full object-cover shadow-md shadow-zinc-300" radius="md" src={`${serverBase}/uploads/` + movie.thumbnail} />
                </motion.div>

                <div className="flex flex-col pl-2 gap-3.5">
                    <div className="border-0 border-red-500 w-fit">
                        <span className="lg:text-3xl md:text-2xl font-semibold">{movie.name}</span>
                    </div>
                    <div className="border-0 border-red-500 w-fit">
                        <span className="text-[1.15em]">Booking Date: <span className="font-semibold">{formatDate(bookingDate)}</span></span>
                    </div>
                    <div className="border-0 border-red-500 w-fit">
                        <span className="text-[1.15em]">Screen: <span className="font-semibold">{screenName}, {screen}</span></span>
                    </div>
                    <div className="border-0 border-red-500 w-fit">
                        <span className="text-[1.15em]">Selected Seats:</span>
                    </div>
                    <div className="flex gap-3 border-0 border-red-500 w-fit">
                        {selectedSeats.length > 0 && selectedSeats.map((seat, index) => (
                            <div key={index} className="flex gap-2 border bg-white py-2.5 px-2.5 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                </svg>
                                <span>{seat.replace("_", "")}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 border-0 border-red-500 w-fit">
                        <span className="text-[1.15em]">Total Cost:</span>
                        <span className="text-[1.15em] font-bold mt-[0.05em]">₹{totalCost}</span>
                    </div>

                    <div className="ml-1.5 border-0 border-red-500 w-40">
                        <button onClick={confirmTickets} className="primary">Confirm Tickets</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;