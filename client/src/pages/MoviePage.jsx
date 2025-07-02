
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Image } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Select } from '@mantine/core';
import axios from "axios";
import CastAndCrew from "../components/CastAndCrew";
import { UserContext } from "../UserContext";
import Gallery from '../components/Gallery';
import { motion } from 'framer-motion'
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SuccessNotification, WarningNotification } from "../components/ShowNotifications";

function MoviePage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState('');
    const [photos, setPhotos] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [redirect, setRedirect] = useState(false);
    const [embedLink, setEmbedLink] = useState('');
    const [playing, setPlaying] = useState(false)
    const { user, city } = useContext(UserContext);
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    //  Reminder States
    const [rTheater, setRTheater] = useState('')
    const [theaters, setTheaters] = useState('');

    let info = null;

    useEffect(() => {
        if (!id || !city) {
            return;
        }
        axios.get(`/movies/${id}`).then(res => {
            const movieDoc = res.data
            setMovie(movieDoc);
            setPhotos(movieDoc.photos);
        })

        axios.post(`/playingornot/`, { id, city }).then(res => {
            setPlaying(res.data)
        })

    }, [id, city])

    async function Notify() {

        if (!user) {
            notifications.clean()
            WarningNotification("User Not Logged in", "You have to log in in order to subscribe to notifications")
            return;
        }

        open()

        const fetchSort = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    info = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    console.log(info)

                    axios.post(`/theaters/city`, { info, city }).then(res => {
                        setTheaters(res.data)
                    })

                })
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }

        await fetchSort()
    }

    function Subscribe(ev) {
        ev.preventDefault();

        axios.post('/subscribe', { uid: user._id, id, rTheater, city }).then(res => {
            const response = res.data
            if (response == 200 || response == 120) {
                SuccessNotification("Added reminder")
            } else if (response == 240) {
                WarningNotification("Alert already added")
            }
        })
        setRTheater('')
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);

        const day = date.getDate();
        const suffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${suffix(day)} ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
    }

    function theatersList() {
        let listofT = []
        if (movie.category == 'Upcoming' || !playing) {
            listofT.push("Any Theater")
        }

        for (let i = 0; i < theaters.length; i++) {
            listofT.push(theaters[i]?.name);
        }
        return listofT;
    }

    function bookTicket(ev) {
        ev.preventDefault();
        setRedirect(true);
    }

    function trailerLink(link) {
        const trailerArr = link.split('=');
        return `https://www.youtube.com/embed/${trailerArr[1]}`
    }

    if (movie == '') {
        return <Loader size={'xl'} type="dots" className="flex absolute h-3/4 w-screen justify-center items-center" color="#f24c62" />;
    }

    if (redirect) {
        navigate(`/book/${id}`, { state: { movie } })
    }

    return (
        <div className="mx-14 my-4">

            <Modal
                opened={opened}
                onClose={close}
                title="Subscribe to receive notification"
                overlayProps={{
                    backgroundOpacity: 0.55,
                }}
                styles={{
                    body: {
                        padding: '0px 20px 30px 20px'
                    }
                }}
            >

                <form onSubmit={(ev) => { Subscribe(ev) }}>
                    <div>

                        <h2 className="text-md mt-4">
                            Select Preferred Theater
                        </h2>

                        <Select
                            placeholder="Select a theater"
                            checkIconPosition="right"
                            withScrollArea={false}
                            value={rTheater}
                            onChange={setRTheater}
                            styles={{
                                dropdown: {
                                    maxHeight: 200,
                                    overflowY: "auto",
                                    borderRadius: "7px",
                                },
                                wrapper: {
                                    borderRadius: "10px",
                                    marginBottom: "6px",
                                },
                                input: {
                                    fontSize: "16px",
                                    padding: "22px 13px",
                                    borderRadius: "7px",
                                    cursor: "pointer",
                                },
                                option: {
                                    fontSize: "16px",
                                    padding: "8px 15px",
                                    borderRadius: "5px",
                                },
                            }}
                            mt="md"
                            data={theatersList()}
                        />
                    </div>

                    <p className="text-zinc-400 text-center mt-4 text-sm">Showing only theaters of current selected city</p>

                    <div className="flex gap-5 mt-2">
                        <button
                            onClick={(ev) => {
                                close()
                                Subscribe(ev)
                            }}
                            className="primary"
                        >
                            Subscribe
                        </button>
                    </div>
                </form>

            </Modal>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-opacity-35 bg-zinc-100 rounded-2xl flex gap-4 mx-4 px-6 py-6">
                <div>
                    <motion.div
                        whileTap={{ scale: 0.99 }}
                        transition={{
                            duration: 0.2
                        }}
                        className="sm:w-[6.4em] sm:h-[9.3em] md:w-[9.6em] md:h-[13.95] lg:w-[12.8em] lg:h-[18.6em] xl:w-[14.4em] xl:h-[20.925em] 2xl:w-[16em] 2xl:h-[23.25]"
                    >
                        <Image className="w-full h-full object-cover shadow-md shadow-zinc-300" radius="md" src={`${serverBase}/uploads/` + movie.thumbnail} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-0 flex flex-col border-black p-2">

                    <div className="border-0 border-red-500 p-2 w-fit">
                        <span className="lg:text-3xl md:text-2xl font-bold">{movie.name}</span>
                    </div>

                    <div className="border-0 leading-7 lg:text-lg md:text-md border-purple-600 p-2">
                        {movie.synopsis}
                    </div>

                    <div className="border-0 border-red-500 w-fit">
                        {movie.category == 'Available' && (
                            <div className="px-2.5 py-3">
                                {playing == true && (
                                    <div className="mt-2">
                                        <div className="flex w-44">
                                            <button onClick={bookTicket} className="bg-primary px-2 py-3 rounded-[0.56em] text-white w-full text-lg hover:bg-[#eb4157]">Book Tickets</button>
                                        </div>
                                    </div>
                                )}
                                {playing == false && (
                                    <div className="">
                                        <h2 className="text-red-500 text-[1.1em] font-[450]">Not Available In Your Location</h2>

                                        <div className="flex gap-5 mt-1.5">
                                            <div className="flex w-44">
                                                <button disabled className="bg-zinc-400 disabled rounded-[0.56em] text-white text-lg">Book Tickets</button>
                                            </div>

                                            <div onClick={() => {
                                                Notify();
                                            }} className="cursor-pointer flex rounded-[0.56em] bg-primary w-44 items-center gap-0.5 py-3 mt-3 border hover:bg-[#eb4157] justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                                </svg>

                                                <p className="xl:text-lg text-white">Notify</p>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}
                        {movie.category == 'Upcoming' && (
                            <div className="flex flex-col w-auto p-2">
                                <div className="flex flex-col">
                                    <span className="lg:text-md md:text-md">In Theatres</span>
                                    <span className="lg:text-xl md:text-xl">{formatDate(new Date(movie.releaseDate))}</span>
                                </div>

                                <div className="flex gap-5 mt-1.5">
                                    <div className="flex w-44">
                                        <button disabled className="bg-zinc-400 disabled rounded-[0.56em] text-white text-lg">Book Tickets</button>
                                    </div>

                                    <div onClick={() => {
                                        Notify();
                                    }} className="cursor-pointer flex rounded-[0.56em] bg-primary w-44 items-center gap-0.5 py-3 mt-3 border hover:bg-[#eb4157] justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                        </svg>

                                        <p className="xl:text-lg text-white">Notify</p>
                                    </div>
                                </div>


                            </div>
                        )}
                    </div>

                </motion.div>
            </motion.div>

            <div className="flex">
                <Gallery movie={movie} photos={photos} />

                <motion.div
                    className="border-0 border-red-500 mt-3 px-6 py-4">
                    <h2 className="text-[1.6em] font-semibold">Trailer</h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-5 mb-4">
                        <iframe width="560" height="315" src={trailerLink(movie.trailer)} title="YouTube video player" allow="accelerometer; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                    </motion.div>
                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-2 mx-4 px-6 py-4 ">
                <h2 className="text-[1.6em] font-semibold">Cast & Crew</h2>
                <CastAndCrew screw={movie.castAndcrew} />
            </motion.div>

        </div >


    );
}

export default MoviePage;