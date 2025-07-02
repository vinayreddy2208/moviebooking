
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import nearest from '../assets/nearest.svg'
import { SegmentedControl } from '@mantine/core';
import spinner from '../assets/spinner.gif';
import { Loader } from '@mantine/core';
import MovieDate from "../components/MovieDate";

function BookTicket() {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingDate, setBookingDate] = useState(null);
    const [showTime, setShowTime] = useState('');
    const [screen, setScreen] = useState('');
    const [tprice, setTPrice] = useState('');
    const [theatreID, setTheatreID] = useState('');
    const [theatres, setTheatres] = useState([]);
    const [tReady, setTReady] = useState(false);
    const [today, setToday] = useState('')
    const [endDate, setEndDate] = useState('');
    const [screenName, setScreenName] = useState('');
    const { user, city, ready } = useContext(UserContext);

    const [cords, setCords] = useState({ lattitude: '', longitude: '' });
    let info = null;

    const [movieScreens, setMovieScreens] = useState([])

    function timingStyle(time, theatre) {
        let style = "cursor-pointer border p-3 rounded-md text-[1.1em] ";
        if (showTime == time && screen == theatre) {
            style += "bg-primary text-white"
        }
        return style;
    }

    useEffect(() => {

        // const fetchSort = async () => {
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition((position) => {

        //             console.log("That took time eh?")

        //             info = {
        //                 latitude: position.coords.latitude,
        //                 longitude: position.coords.longitude
        //             };

        //             console.log("About to print user location")

        //             console.log({ id, info });

        //             axios.post('/getsortedscreens', { id, info, city }).then(res => {
        //                 setTheatres(res.data);
        //                 setTReady(true);
        //             })

        //         }, null,
        //             {
        //                 maximumAge: 30000,
        //                 timeout: 5000,
        //                 enableHighAccuracy: false
        //             });

        //     } else {
        //         console.log("Geolocation is not supported by this browser.");
        //     }

        //     // axios.get(`/getscreens/${id}`).then(res => {
        //     //     setTheatres(res.data);
        //     //     setTReady(true)
        //     // })

        //     const today = new Date();
        //     const formattedDate = today.toISOString().split('T')[0];
        //     const formattedEndDate = movie.endDate?.split('T')[0];
        //     setToday(formattedDate)
        //     setEndDate(formattedEndDate)
        // }

        const fetchSort = async () => {
            if (navigator.geolocation) {
                navigator.permissions
                    .query({ name: "geolocation" })
                    .then(function (result) {
                        if (result.state == "granted") {
                            navigator.geolocation.getCurrentPosition(success, errors, options);
                        } else if (result.state == "prompt") {
                            navigator.geolocation.getCurrentPosition(success, errors, options);
                        } else if (result.state == "denied") {

                        }
                    });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }

        if (city) {
            fetchSort();
        }

    }, [city]);

    function success(pos) {

        info = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        };

        axios.post('/getsortedscreens', { id, info, city }).then(res => {
            setTheatres(res.data);
            setMovieScreens(res.data)
            setTReady(true);
        })
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 30000
    }

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.permissions
    //             .query({ name: "geolocation" })
    //             .then(function (result) {
    //                 // console.log(result)
    //                 if (result.state == "granted") {
    //                     navigator.geolocation.getCurrentPosition(success, errors, options);
    //                 } else if (result.state == "prompt") {
    //                     navigator.geolocation.getCurrentPosition(success, errors, options);
    //                 } else if (result.state == "denied") {

    //                 }
    //             });
    //     } else {
    //         console.log("Geolocation is not supported by this browser.");
    //     }
    // }, [])

    function selectSeats() {
        // console.log({ bookingDate, showTime, screen, tprice, theatreID, screenName })
        navigate(`/book/seats/${id}`, { state: { bookingDate, showTime, screen, tprice, theatreID, screenName } })
    }

    if (!tReady) {
        // return <Loader size={'xl'} type="dots" className="flex absolute h-3/4 w-screen justify-center items-center" color="#f24c62" />;
        return;
    }

    return (
        <div className="flex flex-col mx-56 gap-1">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2">
                <h2 className="font-semibold text-2xl">Date</h2>
                {/* <input className="border p-3 rounded-md mt-3" type="date" min={today} max={endDate} value={bookingDate} onChange={ev => setBookingDate(ev.target.value)} /> */}
                <MovieDate movieScreens={movieScreens} setBookingDate={setBookingDate} setTheaters={setTheatres} id={id} />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex border-0 border-red-500 flex-col gap-5 p-2">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-2xl">Theatres</h2>
                </div>

                {theatres.length > 0 && (
                    <div className="relative inline-block rounded-3xl rounded-b-md">
                        <svg style={{
                            filter: 'drop-shadow(1px 2px 10px rgba(242, 76, 98, 0.7))',
                        }} xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ddd" strokeWidth="0.05" viewBox="0.95 -14.05 56.1 11.1"><path d="M17-11H57v8H1V-14H13c2 0 1 3 4 3"></path></svg>

                        <div className="absolute -translate-y-44">
                            <div className="ml-3 -mt-1">
                                <h1 className="font-sans flex items-center text-2xl italic font-bold text-primary">
                                    <span className="font-bold italic text-[1.25rem]">NEAREST THEATRE</span>
                                    &nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 -mt-1">
                                        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                                    </svg>
                                </h1>
                            </div>
                            {theatres.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-4 py-6">

                                    <h1 className="font-semibold -mt-1 text-[1.45em]">{theatres[0].name}</h1>
                                    <div className="flex gap-3 mt-3">
                                        {theatres[0].showTimings.length > 0 && theatres[0].showTimings.map((time, index) => (

                                            <div key={index}>
                                                {/* {theatres[0].screens.filter(screen => screen.currentMovie.movieID === id).map((screen, screenIndex) => (
                                                    <div key={screenIndex}>
                                                        <div key={index} onClick={() => {
                                                            setScreen(theatres[0].name)
                                                            setTPrice(theatres[0].screens[0].ticketPrice)
                                                            setTheatreID(theatres[0]._id)
                                                            setShowTime(time)
                                                            setScreenName(screen.screenName)
                                                        }} className={timingStyle(time, theatres[0].name)}>
                                                            {time}
                                                        </div>
                                                    </div>
                                                ))} */}

                                                {theatres[0].screens.filter(screen => screen.currentMovie.movieID === id).map((screen, screenIndex) => {
                                                    // const [hours, minutes] = time.split(':').map(Number);
                                                    // console.log(hours, minutes)
                                                    // const showDate = new Date();
                                                    // showDate.setHours(hours, minutes, 0, 0);

                                                    // const now = new Date();
                                                    // const isPast = showDate < now;

                                                    const parseTimeString = (timeStr) => {
                                                        const [timePart, modifier] = timeStr.split(' ');
                                                        let [hours, minutes] = timePart.split(':').map(Number);

                                                        if (modifier === 'PM' && hours !== 12) hours += 12;
                                                        if (modifier === 'AM' && hours === 12) hours = 0;

                                                        const date = new Date();
                                                        date.setHours(hours, minutes, 0, 0);
                                                        return date;
                                                    };

                                                    const showDate = parseTimeString(time);
                                                    const now = new Date();
                                                    console.log(showDate, now)
                                                    const isPast = showDate < now;

                                                    return (
                                                        <div key={screenIndex}>
                                                            <div key={index} onClick={() => {
                                                                if (isPast) return
                                                                setScreen(theatres[0].name)
                                                                setTPrice(theatres[0].screens[0].ticketPrice)
                                                                setTheatreID(theatres[0]._id)
                                                                setShowTime(time)
                                                                setScreenName(screen.screenName)
                                                            }} className={`${timingStyle(time, theatres[0].name)} ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                {time}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>

                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}



                {theatres.length > 1 && theatres.slice(1).map((theatre, indextop) => (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={indextop} className="border mt-2 px-4 py-6 rounded-sm shadow-md">
                        <h1 className="font-semibold -mt-2 text-[1.45em]">{theatre.name}</h1>

                        <div className="flex gap-3 mt-3">
                            {theatre.showTimings.length > 0 && theatre.showTimings.map((time, index) => (

                                <div key={index}>
                                    {theatre.screens.filter(screen => screen.currentMovie.movieID === id).map((screen, screenIndex) => (
                                        <div key={screenIndex}>
                                            <div key={index} onClick={() => {
                                                setScreen(theatre.name)
                                                setTPrice(theatre.screens[indextop].ticketPrice)
                                                setTheatreID(theatre._id)
                                                setShowTime(time)
                                                setScreenName(screen.screenName)
                                            }}
                                                className={timingStyle(time, theatre.name)}>
                                                {time}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            ))}
                        </div>
                    </motion.div>
                ))}

            </motion.div>

            {(!!bookingDate && !!showTime) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-2.5 flex">
                    <button onClick={selectSeats} className="bg-primary px-12 py-3 rounded-[0.42em] text-white mt-3.5 w-auto text-lg">Next</button>
                </motion.div>
            )}

        </div>
    );
}

export default BookTicket;