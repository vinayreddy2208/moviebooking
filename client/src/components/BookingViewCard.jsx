import QRCode from 'qrcode';
import { useContext, useEffect, useState } from "react";
import { motion } from 'framer-motion'

function BookingViewCard({ bookings }) {

    const [bready, setBready] = useState(false)
    const [codes, setCodes] = useState([]);

    useEffect(() => {
        if (bookings.length > 0) {
            let qrcodes = []
            for (let i = 0; i < bookings.length; i++) {
                QRCode.toDataURL(`http://localhost:5174/verify/${bookings[i]?._id}`).then((val) => qrcodes.push(val))
            }
            setCodes(qrcodes)
            setBready(true)
        }
    }, [bookings]);

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

    async function downloadTicket(ticketID) {

        try {
            const element = document.getElementById(ticketID)
            await html2canvas(element, { logging: true, letterRendering: 1, useCORS: true, allowTaint: true }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                var doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: 'a4',
                })

                const width = doc.internal.pageSize.getWidth();
                const height = (canvas.height * width) / canvas.width;

                doc.addImage(imgData, "JPEG", 0, 0, width, height);
                doc.save(`${ticketID}.pdf`);
            })

        } catch (error) {
            console.log(error)
        }
    }

    console.log(bready)

    if (!bready) {
        return;
        return <div className="flex absolute h-screen w-screen justify-center items-center"><img className="w-14 mb-10" src={spinner} alt="" /></div>
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-7" >
            {bookings.length > 0 && bookings.map((each, index) => {
                <div key={index} className="flex justify-between gap-7 p-5 border shadow-sm shadow-gray-200 rounded-md bg-zinc-50" id={each._id}>
                    <div className="flex border-0 border-red-500 gap-2">
                        <motion.div
                            whileTap={{ scale: 0.99 }}
                            transition={{
                                duration: 0.2
                            }}
                            className="border-0 border-red-500 sm:w-[6.4em] sm:h-[9.3em] md:w-[9.6em] md:h-[13.95em] lg:w-[12.8em] lg:h-[1.6em] xl:w-[10.2em] xl:h-[15em] 2xl:w-[16em] 2xl:h-[23.25]"
                        >
                            <img className="w-full h-full object-cover shadow-md shadow-zinc-300 rounded-[0.4em]" src={'https://amtbs-server.onrender.com/uploads/' + each.movie.thumbnail} />
                        </motion.div>

                        <div className="border-0 border-red-500 flex flex-col gap-2">
                            <div className="border-0 border-red-500 pl-2 w-fit">
                                <h1 className="lg:text-2xl md:text-2xl font-semibold">{each.movie.name}</h1>
                            </div>
                            <div className="border-0 ml-1 border-red-500 pl-2 w-fit">
                                <h2 className="text-[1em]">Booking Date: <span className="font-semibold">{formatDate(each.bookingDate)}</span></h2>
                            </div>
                            <div className="border-0 ml-1 border-red-500 pl-2 w-fit">
                                <span className="text-[1em]">Screen: <span className="font-semibold">{each.screen}</span></span>
                            </div>
                            <div className="border-0 ml-1 border-red-500 pl-2 w-fit">
                                <span className="text-[1em]">Show Time: <span className="font-semibold">{each.showTime}</span></span>
                            </div>
                            <div className="border-0 ml-1 border-red-500 pl-2 w-fit">
                                <span className="text-[1em]">Booked Seats:</span>
                            </div>
                            <div className="flex gap-3 -mt-2 ml-2 border-0 border-red-500 p-2 w-fit">
                                {each.seats.length > 0 && each.seats.map((seat, index) => (
                                    <div key={index} className="flex gap-2 text-[0.95em] items-center border bg-white py-2 px-2 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                        </svg>
                                        <span>{seat.replace("_", "")}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 -mt-2.5 border-0 ml-1 border-red-500 p-2 w-fit">
                                <span className="text-[1em]">Total Cost:</span>
                                <span className="text-[1em] font-bold mt-[0.05em]">₹{each.cost}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center border-0 border-red-600 ">
                        <motion.img
                            whileTap={{ scale: 0.99 }}
                            transition={{
                                duration: 0.2
                            }}
                            className="border rounded-md shadow-sm shadow-zinc-50" src={codes[index]} />
                        <p className="mt-2 text-[0.9em]">Booking ID</p>
                        <p className="text-[0.6em] text-gray-700">{each._id}</p>

                        <button onClick={() => downloadTicket(each._id)} className="bg-primary px-4 py-1.5 rounded-[0.31em] text-white mt-3.5 w-auto text-[0.9em] hover:bg-[#eb4157]">
                            Download
                        </button>

                        {/* <DownloadButton
                            ticketID={each._id}
                            movieThumbnail={each.movie.thumbnail}
                            movieTitle={each.movie.name}
                            showtime={each.showTime}
                            bookingDate={each.bookingDate}
                            screen={each.screen}
                            price={each.cost}
                            qrindex={index}
                        /> */}

                    </div>
                </div>
            })}
        </motion.div>
    );
}

export default BookingViewCard;