
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconQuestionMark } from "@tabler/icons-react";

function VerifyTicket() {

    const { id } = useParams();

    const [booking, setBooking] = useState('');
    const [ready, setReady] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/bookings/${id}`).then(res => {
            setBooking(res.data);
            setReady(true);
        })
    }, [id])

    function Verify() {
        axios.put('/verify-ticket', { id }).then(res => {
            if (res.data == 420) {
                alert('Invalid Ticket');
                notifications.show({
                    title: "Invalid Ticket",
                    radius: 'md',
                    color: 'green',
                    icon: <IconX />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 2500,
                    position: 'top-center'
                })
                return;
            } else {
                alert('Verified');
                notifications.show({
                    title: "Verified successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 1500,
                    position: 'top-center'
                })
                setRedirect(true);
            }
        })
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

    if (!ready) {
        return;
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    console.log(booking)

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="p-3">
                <h1 className="text-[1.8em] text-primary font-semibold">Ticket Verification</h1>
            </div>
            <div className="flex mt-4 text-xl flex-col gap-3 items-center justify-center">
                <h1> <span className="text-primary">Booking ID</span> : {id}</h1>
                <h1> <span className="text-primary">Movie ID</span> : {booking.movie}</h1>
                <h1> <span className="text-primary">Screen</span> : {booking.screen} </h1>
                <h1> <span className="text-primary">Show Date</span> : {formatDate(booking.bookingDate)} </h1>
                <h1> <span className="text-primary">Show Time</span> : {booking.showTime} </h1>
            </div>

            <div className="flex flex-col justify-center items-center mt-3 text-xl">
                <h1 className="text-primary">Reserved Tickets</h1>
                <div className="flex mt-4 gap-3">

                    {booking.seats.length > 0 && booking.seats.map((each, index) => (
                        <div key={index} className="border border-zinc-300 py-2 px-4 rounded-md">{each.replace("_", "")}</div>
                    ))}
                </div>
            </div>


            <button
                onClick={Verify}
                className="bg-primary mt-10 px-9 py-2.5 rounded-[0.36em] text-white w-auto text-[1.2em] hover:bg-[#eb4157]">
                Verify
            </button>
        </div>
    );
}

export default VerifyTicket;