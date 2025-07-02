
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import spinner from '../assets/spinner.gif';
import { Loader } from '@mantine/core';
import { UserContext } from "../UserContext";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import { WarningNotification } from "../components/ShowNotifications";

function SeatLayout() {

    const { id } = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const location = useLocation();
    const [cords, setCords] = useState({ lattitude: '', longitude: '' });
    const [theatreDist, setTheatreDist] = useState(0);
    const navigate = useNavigate();

    const { bookingDate, showTime, screen, tprice, theatreID, screenName } = location.state || {};

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [seatStatus, setSeatStatus] = useState();
    const [loadLayout, setLoadLayout] = useState(false);
    const { user, ready } = useContext(UserContext);
    const [allset, setAllSet] = useState(false)
    const API_KEY = "5b3ce3597851110001cf62482c5fe24766e14946bd9157abf0b212f4"

    // console.log({ bookingDate, showTime, selectedSeats, totalCost, theatreID })

    // useEffect(async () => {
    //     await axios.post('/getseatlayout', { id, screen, bookingDate, showTime }).then(response => {
    // console.log(response.data);
    //         setLoadLayout(true);
    //     });
    // }, [bookingDate, showTime, screen]);

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    async function success(pos) {
        var crd = pos.coords
        console.log(pos)
        setCords({ lattitude: crd.latitude, longitude: crd.longitude })
        console.log("Target current position: ")
        console.log(`Latitude: ${crd.latitude}`)
        console.log(`Longitude: ${crd.longitude}`)
        console.log(`More or less ${crd.accuracy} meters`)
        calculateDistance(crd.latitude, crd.longitude);
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    useEffect(() => {
        const fetchSeatLayout = async () => {
            try {
                const response = await axios.post('/getseatlayout', { id, screen, screenName, bookingDate, showTime });
                console.log("Seat layout fetched")
                console.log(response.data)
                setSeatStatus(response.data)
                setLoadLayout(true);
            } catch (error) {
                console.error("Error fetching seat layout:", error);
            }
        };
        fetchSeatLayout();

    }, [bookingDate, showTime, screen, screenName]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    // console.log(result)
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
    }, [])

    if (!loadLayout) {
        return;
        return <div className="flex absolute h-screen w-screen justify-center items-center"><img className="w-14 mb-10" src={spinner} alt="" /></div>
    }

    function calculateTotalCost(seats) {
        return seats.length * parseInt(tprice)
    }

    function isSeatBooked(seat_number) {
        let seatNum = seat_number.replace('_', ''); // Format seat number
        return seatStatus[seatNum]?.status === 'booked'; // Return true if booked
    }

    function fnSelectSeat(seat_number) {

        if (isSeatBooked(seat_number)) return;

        setSelectedSeats(prevSelectedSeats => {
            let updatedSeats;
            if (prevSelectedSeats.includes(seat_number)) {
                updatedSeats = prevSelectedSeats.filter(seat => seat !== seat_number)
            } else {
                if (prevSelectedSeats.length < 8) {
                    updatedSeats = [...prevSelectedSeats, seat_number]
                } else {
                    WarningNotification("Only a maximum of 8 seats is allowed")
                    return prevSelectedSeats
                }
            }
            setTotalCost(calculateTotalCost(updatedSeats));
            return updatedSeats;
        })
    }

    async function calculateDistance(latitude, longitude) {

        axios.post('/getcoords', { theatreID }).then(response => {
            console.log(latitude, longitude)
            console.log(response.data)
            const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

            const params = {
                api_key: API_KEY,
                start: `${longitude},${latitude}`,
                end: `${response.data[0]},${response.data[1]}`,
            };
            axios.get(url, { params, withCredentials: false }).then(response => {
                if (response.data) {
                    console.log(response.data.features[0])
                    const distance = response.data.features[0].properties.summary.distance;
                    setTheatreDist(distance)
                    setAllSet(true);
                    console.log(`Distance: ${distance / 1000} km`)
                }
            });
        })
    }

    function handleNext() {
        if (selectedSeats.length == 0) {
            WarningNotification("No Seats were selected.")
            return;
        }

        if (!user) {
            WarningNotification("User Not Logged in", "You have to login in order to book tickets")
            return;
        }

        open()
    }

    function checkOut() {
        navigate(`/checkout/seats/${id}`, { state: { bookingDate, showTime, screen, totalCost, selectedSeats, theatreID, screenName } })
    }

    const seatI = 'border border-gray-400 h-[2.5em] w-[2.3em] items-center flex text-[0.75em] justify-center cursor-pointer rounded-[0.25em] m-1'

    function getSeatClass(seat_number) {
        let seatNum = seat_number.replace('_', '');

        const isBooked = seatStatus[seatNum]?.status === 'booked';

        if (isBooked) {
            return `${seatI} bg-zinc-500 bg-opacity-80 text-white cursor-not-allowed disabled`;
        }

        return selectedSeats.includes(seat_number)
            ? `${seatI} bg-primary text-white hover:bg-primary hover:text-white`  // If selected, change background and text color
            : `${seatI} bg-white hover:bg-primary hover:text-white`;  // Default background for unselected seats
    }

    if (!allset) {
        return <Loader size={'xl'} type="dots" className="flex absolute h-3/4 w-screen justify-center items-center" color="#f24c62" />;
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col w-max items-center">
                <div className="flex justify-center items-center">
                    <h1 className="font-semibold text-2xl">{screen}</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 rotate-90">
                        <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-2xl">{screenName}</h1>
                </div>
                <h2 className="text-xl mt-1">{showTime}</h2>
            </motion.div>
            <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-10' cellSpacing={0}>
                <tbody className='border-0 border-red-500'>
                    <tr className=''>
                        <td>
                            <div>A</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='A_1' data-seat-type="4" onClick={() => fnSelectSeat('A_1')} className={getSeatClass('A_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='A_2' data-seat-type="4" onClick={() => fnSelectSeat('A_2')} className={getSeatClass('A_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='A_3' data-seat-type="4" onClick={() => fnSelectSeat('A_3')} className={getSeatClass('A_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='A_4' data-seat-type="4" onClick={() => fnSelectSeat('A_4')} className={getSeatClass('A_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='A_5' data-seat-type="4" onClick={() => fnSelectSeat('A_5')} className={getSeatClass('A_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='A_6' data-seat-type="4" onClick={() => fnSelectSeat('A_6')} className={getSeatClass('A_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='A_7' data-seat-type="4" onClick={() => fnSelectSeat('A_7')} className={getSeatClass('A_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='A_8' data-seat-type="4" onClick={() => fnSelectSeat('A_8')} className={getSeatClass('A_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='A_9' data-seat-type="4" onClick={() => fnSelectSeat('A_9')} className={getSeatClass('A_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='A_10' data-seat-type="4" onClick={() => fnSelectSeat('A_10')} className={getSeatClass('A_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='A_11' data-seat-type="4" onClick={() => fnSelectSeat('A_11')} className={getSeatClass('A_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='A_12' data-seat-type="4" onClick={() => fnSelectSeat('A_12')} className={getSeatClass('A_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='A_13' data-seat-type="4" onClick={() => fnSelectSeat('A_13')} className={getSeatClass('A_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='A_14' data-seat-type="4" onClick={() => fnSelectSeat('A_14')} className={getSeatClass('A_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                            <div id='A_15' data-seat-type="4" onClick={() => fnSelectSeat('A_15')} className={getSeatClass('A_15')}>
                                <a href="javascript:;" className="_available _best" >15</a>
                            </div>
                            <div id='A_16' data-seat-type="4" onClick={() => fnSelectSeat('A_16')} className={getSeatClass('A_16')}>
                                <a href="javascript:;" className="_available _best" >16</a>
                            </div>
                            <div id='A_17' data-seat-type="4" onClick={() => fnSelectSeat('A_17')} className={getSeatClass('A_17')}>
                                <a href="javascript:;" className="_available _best" >17</a>
                            </div>

                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>B</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='B_1' data-seat-type="4" onClick={() => fnSelectSeat('B_1')} className={getSeatClass('B_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='B_2' data-seat-type="4" onClick={() => fnSelectSeat('B_2')} className={getSeatClass('B_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='B_3' data-seat-type="4" onClick={() => fnSelectSeat('B_3')} className={getSeatClass('B_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='B_4' data-seat-type="4" onClick={() => fnSelectSeat('B_4')} className={getSeatClass('B_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='B_5' data-seat-type="4" onClick={() => fnSelectSeat('B_5')} className={getSeatClass('B_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='B_6' data-seat-type="4" onClick={() => fnSelectSeat('B_6')} className={getSeatClass('B_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='B_7' data-seat-type="4" onClick={() => fnSelectSeat('B_7')} className={getSeatClass('B_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='B_8' data-seat-type="4" onClick={() => fnSelectSeat('B_8')} className={getSeatClass('B_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='B_9' data-seat-type="4" onClick={() => fnSelectSeat('B_9')} className={getSeatClass('B_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='B_10' data-seat-type="4" onClick={() => fnSelectSeat('B_10')} className={getSeatClass('B_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='B_11' data-seat-type="4" onClick={() => fnSelectSeat('B_11')} className={getSeatClass('B_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='B_12' data-seat-type="4" onClick={() => fnSelectSeat('B_12')} className={getSeatClass('B_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='B_13' data-seat-type="4" onClick={() => fnSelectSeat('B_13')} className={getSeatClass('B_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='B_14' data-seat-type="4" onClick={() => fnSelectSeat('B_14')} className={getSeatClass('B_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                            <div id='B_15' data-seat-type="4" onClick={() => fnSelectSeat('B_15')} className={getSeatClass('B_15')}>
                                <a href="javascript:;" className="_available _best" >15</a>
                            </div>
                            <div id='B_16' data-seat-type="4" onClick={() => fnSelectSeat('B_16')} className={getSeatClass('B_16')}>
                                <a href="javascript:;" className="_available _best" >16</a>
                            </div>
                            <div id='B_17' data-seat-type="4" onClick={() => fnSelectSeat('B_17')} className={getSeatClass('B_17')}>
                                <a href="javascript:;" className="_available _best" >17</a>
                            </div>

                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>C</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='C_1' data-seat-type="4" onClick={() => fnSelectSeat('C_1')} className={getSeatClass('C_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='C_2' data-seat-type="4" onClick={() => fnSelectSeat('C_2')} className={getSeatClass('C_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='C_3' data-seat-type="4" onClick={() => fnSelectSeat('C_3')} className={getSeatClass('C_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='C_4' data-seat-type="4" onClick={() => fnSelectSeat('C_4')} className={getSeatClass('C_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='C_5' data-seat-type="4" onClick={() => fnSelectSeat('C_5')} className={getSeatClass('C_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='C_6' data-seat-type="4" onClick={() => fnSelectSeat('C_6')} className={getSeatClass('C_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='C_7' data-seat-type="4" onClick={() => fnSelectSeat('C_7')} className={getSeatClass('C_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='C_8' data-seat-type="4" onClick={() => fnSelectSeat('C_8')} className={getSeatClass('C_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='C_9' data-seat-type="4" onClick={() => fnSelectSeat('C_9')} className={getSeatClass('C_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='C_10' data-seat-type="4" onClick={() => fnSelectSeat('C_10')} className={getSeatClass('C_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='C_11' data-seat-type="4" onClick={() => fnSelectSeat('C_11')} className={getSeatClass('C_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='C_12' data-seat-type="4" onClick={() => fnSelectSeat('C_12')} className={getSeatClass('C_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='C_13' data-seat-type="4" onClick={() => fnSelectSeat('C_13')} className={getSeatClass('C_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='C_14' data-seat-type="4" onClick={() => fnSelectSeat('C_14')} className={getSeatClass('C_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                            <div id='C_15' data-seat-type="4" onClick={() => fnSelectSeat('C_15')} className={getSeatClass('C_15')}>
                                <a href="javascript:;" className="_available _best" >15</a>
                            </div>
                            <div id='C_16' data-seat-type="4" onClick={() => fnSelectSeat('C_16')} className={getSeatClass('C_16')}>
                                <a href="javascript:;" className="_available _best" >16</a>
                            </div>
                            <div id='C_17' data-seat-type="4" onClick={() => fnSelectSeat('C_17')} className={getSeatClass('C_17')}>
                                <a href="javascript:;" className="_available _best" >17</a>
                            </div>

                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>D</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='D_1' data-seat-type="4" onClick={() => fnSelectSeat('D_1')} className={getSeatClass('D_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='D_2' data-seat-type="4" onClick={() => fnSelectSeat('D_2')} className={getSeatClass('D_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='D_3' data-seat-type="4" onClick={() => fnSelectSeat('D_3')} className={getSeatClass('D_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='D_4' data-seat-type="4" onClick={() => fnSelectSeat('D_4')} className={getSeatClass('D_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='D_5' data-seat-type="4" onClick={() => fnSelectSeat('D_5')} className={getSeatClass('D_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='D_6' data-seat-type="4" onClick={() => fnSelectSeat('D_6')} className={getSeatClass('D_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='D_7' data-seat-type="4" onClick={() => fnSelectSeat('D_7')} className={getSeatClass('D_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='D_8' data-seat-type="4" onClick={() => fnSelectSeat('D_8')} className={getSeatClass('D_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='D_9' data-seat-type="4" onClick={() => fnSelectSeat('D_9')} className={getSeatClass('D_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='D_10' data-seat-type="4" onClick={() => fnSelectSeat('D_10')} className={getSeatClass('D_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='D_11' data-seat-type="4" onClick={() => fnSelectSeat('D_11')} className={getSeatClass('D_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='D_12' data-seat-type="4" onClick={() => fnSelectSeat('D_12')} className={getSeatClass('D_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='D_13' data-seat-type="4" onClick={() => fnSelectSeat('D_13')} className={getSeatClass('D_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='D_14' data-seat-type="4" onClick={() => fnSelectSeat('D_14')} className={getSeatClass('D_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                            <div id='D_15' data-seat-type="4" onClick={() => fnSelectSeat('D_15')} className={getSeatClass('D_15')}>
                                <a href="javascript:;" className="_available _best" >15</a>
                            </div>
                            <div id='D_16' data-seat-type="4" onClick={() => fnSelectSeat('D_16')} className={getSeatClass('D_16')}>
                                <a href="javascript:;" className="_available _best" >16</a>
                            </div>
                            <div id='D_17' data-seat-type="4" onClick={() => fnSelectSeat('D_17')} className={getSeatClass('D_17')}>
                                <a href="javascript:;" className="_available _best" >17</a>
                            </div>

                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>E</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='E_1' data-seat-type="4" onClick={() => fnSelectSeat('E_1')} className={getSeatClass('E_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='E_2' data-seat-type="4" onClick={() => fnSelectSeat('E_2')} className={getSeatClass('E_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='E_3' data-seat-type="4" onClick={() => fnSelectSeat('E_3')} className={getSeatClass('E_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='E_4' data-seat-type="4" onClick={() => fnSelectSeat('E_4')} className={getSeatClass('E_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='E_5' data-seat-type="4" onClick={() => fnSelectSeat('E_5')} className={getSeatClass('E_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='E_6' data-seat-type="4" onClick={() => fnSelectSeat('E_6')} className={getSeatClass('E_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='E_7' data-seat-type="4" onClick={() => fnSelectSeat('E_7')} className={getSeatClass('E_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='E_8' data-seat-type="4" onClick={() => fnSelectSeat('E_8')} className={getSeatClass('E_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='E_9' data-seat-type="4" onClick={() => fnSelectSeat('E_9')} className={getSeatClass('E_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='E_10' data-seat-type="4" onClick={() => fnSelectSeat('E_10')} className={getSeatClass('E_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='E_11' data-seat-type="4" onClick={() => fnSelectSeat('E_11')} className={getSeatClass('E_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='E_12' data-seat-type="4" onClick={() => fnSelectSeat('E_12')} className={getSeatClass('E_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='E_13' data-seat-type="4" onClick={() => fnSelectSeat('E_13')} className={getSeatClass('E_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='E_14' data-seat-type="4" onClick={() => fnSelectSeat('E_14')} className={getSeatClass('E_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                            <div id='E_15' data-seat-type="4" onClick={() => fnSelectSeat('E_15')} className={getSeatClass('E_15')}>
                                <a href="javascript:;" className="_available _best" >15</a>
                            </div>
                            <div id='E_16' data-seat-type="4" onClick={() => fnSelectSeat('E_16')} className={getSeatClass('E_16')}>
                                <a href="javascript:;" className="_available _best" >16</a>
                            </div>
                            <div id='E_17' data-seat-type="4" onClick={() => fnSelectSeat('E_17')} className={getSeatClass('E_17')}>
                                <a href="javascript:;" className="_available _best" >17</a>
                            </div>

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="seatR Setrow1"></div>
                        </td>
                        <td className='flex'>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>F</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='F_1' data-seat-type="4" onClick={() => fnSelectSeat('F_1')} className={getSeatClass('F_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='F_2' data-seat-type="4" onClick={() => fnSelectSeat('F_2')} className={getSeatClass('F_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='F_3' data-seat-type="4" onClick={() => fnSelectSeat('F_3')} className={getSeatClass('F_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='F_4' data-seat-type="4" onClick={() => fnSelectSeat('F_4')} className={getSeatClass('F_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='F_5' data-seat-type="4" onClick={() => fnSelectSeat('F_5')} className={getSeatClass('F_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='F_6' data-seat-type="4" onClick={() => fnSelectSeat('F_6')} className={getSeatClass('F_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='F_7' data-seat-type="4" onClick={() => fnSelectSeat('F_7')} className={getSeatClass('F_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='F_8' data-seat-type="4" onClick={() => fnSelectSeat('F_8')} className={getSeatClass('F_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='F_9' data-seat-type="4" onClick={() => fnSelectSeat('F_9')} className={getSeatClass('F_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='F_10' data-seat-type="4" onClick={() => fnSelectSeat('F_10')} className={getSeatClass('F_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='F_11' data-seat-type="4" onClick={() => fnSelectSeat('F_11')} className={getSeatClass('F_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='F_12' data-seat-type="4" onClick={() => fnSelectSeat('F_12')} className={getSeatClass('F_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='F_13' data-seat-type="4" onClick={() => fnSelectSeat('F_13')} className={getSeatClass('F_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='F_14' data-seat-type="4" onClick={() => fnSelectSeat('F_14')} className={getSeatClass('F_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>G</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='G_1' data-seat-type="4" onClick={() => fnSelectSeat('G_1')} className={getSeatClass('G_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='G_2' data-seat-type="4" onClick={() => fnSelectSeat('G_2')} className={getSeatClass('G_2')}>
                                <a href="javascript:;" className="_available _best" >2</a>
                            </div>
                            <div id='G_3' data-seat-type="4" onClick={() => fnSelectSeat('G_3')} className={getSeatClass('G_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='G_4' data-seat-type="4" onClick={() => fnSelectSeat('G_4')} className={getSeatClass('G_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='G_5' data-seat-type="4" onClick={() => fnSelectSeat('G_5')} className={getSeatClass('G_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='G_6' data-seat-type="4" onClick={() => fnSelectSeat('G_6')} className={getSeatClass('G_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='G_7' data-seat-type="4" onClick={() => fnSelectSeat('G_7')} className={getSeatClass('G_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='G_8' data-seat-type="4" onClick={() => fnSelectSeat('G_8')} className={getSeatClass('G_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='G_9' data-seat-type="4" onClick={() => fnSelectSeat('G_9')} className={getSeatClass('G_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='G_10' data-seat-type="4" onClick={() => fnSelectSeat('G_10')} className={getSeatClass('G_10')}>
                                <a href="javascript:;" className="_available _best" >10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="seatI">&nbsp;</div>
                            <div id='G_11' data-seat-type="4" onClick={() => fnSelectSeat('G_11')} className={getSeatClass('G_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='G_12' data-seat-type="4" onClick={() => fnSelectSeat('G_12')} className={getSeatClass('G_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='G_13' data-seat-type="4" onClick={() => fnSelectSeat('G_13')} className={getSeatClass('G_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='G_14' data-seat-type="4" onClick={() => fnSelectSeat('G_14')} className={getSeatClass('G_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                        </td>
                    </tr>
                    <tr className=''>
                        <td>
                            <div>H</div>
                        </td>
                        <td className='flex gap-3'>
                            <div className="seatI">&nbsp;</div>
                            <div id='H_1' data-seat-type="4" onClick={() => fnSelectSeat('H_1')} className={getSeatClass('H_1')}>
                                <a href="javascript:;" className="_available _best" >1</a>
                            </div>
                            <div id='H_2' data-seat-type="4" onClick={() => fnSelectSeat('H_2')} className={getSeatClass('H_2')}>
                                <a href="javascript:;" className="_available _best">2</a>
                            </div>
                            <div id='H_3' data-seat-type="4" onClick={() => fnSelectSeat('H_3')} className={getSeatClass('H_3')}>
                                <a href="javascript:;" className="_available _best" >3</a>
                            </div>
                            <div id='H_4' data-seat-type="4" onClick={() => fnSelectSeat('H_4')} className={getSeatClass('H_4')}>
                                <a href="javascript:;" className="_available _best" >4</a>
                            </div>
                            <div id='H_5' data-seat-type="4" onClick={() => fnSelectSeat('H_5')} className={getSeatClass('H_5')}>
                                <a href="javascript:;" className="_available _best" >5</a>
                            </div>
                            <div id='H_6' data-seat-type="4" onClick={() => fnSelectSeat('H_6')} className={getSeatClass('H_6')}>
                                <a href="javascript:;" className="_available _best" >6</a>
                            </div>
                            <div id='H_7' data-seat-type="4" onClick={() => fnSelectSeat('H_7')} className={getSeatClass('H_7')}>
                                <a href="javascript:;" className="_available _best" >7</a>
                            </div>
                            <div id='H_8' data-seat-type="4" onClick={() => fnSelectSeat('H_8')} className={getSeatClass('H_8')}>
                                <a href="javascript:;" className="_available _best" >8</a>
                            </div>
                            <div id='H_9' data-seat-type="4" onClick={() => fnSelectSeat('H_9')} className={getSeatClass('H_9')}>
                                <a href="javascript:;" className="_available _best" >9</a>
                            </div>
                            <div id='H_10' data-seat-type="4" onClick={() => fnSelectSeat('H_10')} className={getSeatClass('H_10')}>
                                <a href="javascript:;" className="_available _best">10</a>
                            </div>
                            <div className="seatI">&nbsp;</div>
                            <div className="getSeatClass('H_1')">&nbsp;</div>
                            <div id='H_11' data-seat-type="4" onClick={() => fnSelectSeat('H_11')} className={getSeatClass('H_11')}>
                                <a href="javascript:;" className="_available _best" >11</a>
                            </div>
                            <div id='H_12' data-seat-type="4" onClick={() => fnSelectSeat('H_12')} className={getSeatClass('H_12')}>
                                <a href="javascript:;" className="_available _best" >12</a>
                            </div>
                            <div id='H_13' data-seat-type="4" onClick={() => fnSelectSeat('H_13')} className={getSeatClass('H_13')}>
                                <a href="javascript:;" className="_available _best" >13</a>
                            </div>
                            <div id='H_14' data-seat-type="4" onClick={() => fnSelectSeat('H_14')} className={getSeatClass('H_14')}>
                                <a href="javascript:;" className="_available _best" >14</a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </motion.table>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center">
                <div className='border h-1.5 bg-black rounded-xl border-black w-64 mt-20'></div>
                <div className='mt-4 text-[0.95em] text-gray-500'>Screen This Way</div>
            </motion.div>


            <div className="flex items-center gap-2 mt-10">
                {selectedSeats.length > 0 && selectedSeats.map((seat, index) => (
                    <div key={index} className="flex gap-2 border p-3 rounded-[0.3em]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                        <span>{seat.replace("_", "")}</span>
                    </div>
                ))}
            </div>

            <Modal opened={opened}
                centered
                title="Theatre Location Alert"
                onClose={() => {
                    close()
                }}
            >

                <div className="text-center text-lg">
                    Selected theatre, <span className="font-semibold">{screen}</span> is more than <span className="font-semibold">{theatreDist / 1000} km</span> from your location.
                </div>



                <button
                    onClick={() => {
                        close();
                        checkOut();
                    }}
                    className="primary"
                >
                    Got it
                </button>

            </Modal>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-28 mt-5">
                <button onClick={handleNext} className="primary">Next</button>
            </motion.div>
        </div>
    );
}

export default SeatLayout;