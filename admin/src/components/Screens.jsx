import { useContext, useEffect, useState } from "react";
import { Modal, Button, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShowTimings from "./ShowTimings";
import axios from "axios";
import { DateInput } from '@mantine/dates';
import { motion } from 'framer-motion';
import { Checkbox } from '@mantine/core';

function Screens({ screenInfo, setScreenInfo, city, id }) {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get("/getmovies").then((res) => {
            setMovies(res.data);
        });
    }, []);

    const [opened, { open, close }] = useDisclosure(false);


    //! Originals
    const [screenName, setScreenName] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [movieName, setMovieName] = useState('');
    const [endDate, setEndDate] = useState(null);

    //! Temperory
    const [scrName, setSCRName] = useState("");
    const [tktPrice, setTKTPrice] = useState("");
    const [tempMovie, setTempMovie] = useState("");
    const [tempEnd, setTempEnd] = useState(null);

    const [timing, setTiming] = useState("");

    const [showTimings, setShowTimings] = useState([]);

    function moviesList() {
        let moviesList = [];
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]?.category === "Available" || movies[i]?.category === "Upcoming") {
                moviesList.push(movies[i]?.name);
            }
        }
        return moviesList;
    }

    function findMovieID(moviePlaying) {
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]?.name === moviePlaying) {
                return movies[i]?._id;
            }
        }
    }

    function addScreen(ev) {
        ev.preventDefault();
        const movieID = findMovieID(movieName)
        const currentMovie = { movieID, movieName, endDate }
        setScreenInfo((prev) => [
            ...prev,
            { screenName, ticketPrice, currentMovie },
        ]);
        setScreenName('');
        setTicketPrice('');
        setMovieName('');
        setEndDate(null)
    }

    function handlescrName(ev, each) {

        ev.preventDefault();
        setSCRName(each.screenName);
        setTKTPrice(each.ticketPrice);
        setTempMovie(each.currentMovie.movieName);

        setScreenName(each.screenName);
        setTicketPrice(each.ticketPrice);
        setMovieName(each.currentMovie.movieName)

        if (each.currentMovie.endDate) {
            const date = new Date(each.currentMovie.endDate)
            setTempEnd(date)
            setEndDate(date)
        } else {
            setTempEnd(null)
            setEndDate(null)
        }
    }

    function updatescrName(ev, { screenName, ticketPrice, movieName, endDate }, scrName, tktPrice, tempMovie, tempEnd) {
        ev.preventDefault();

        const movieID = findMovieID(tempMovie)

        setScreenInfo(
            screenInfo.map(star => {
                if (star.screenName === screenName && star.ticketPrice === ticketPrice && star.currentMovie.movieName === movieName) {
                    return { screenName: scrName, ticketPrice: tktPrice, currentMovie: { movieID, movieName: tempMovie, endDate: tempEnd } };
                }
                return star;
            })
        );
    }

    function removescrName(ev, { screenName, ticketPrice, movieName }) {
        ev.preventDefault();
        setScreenInfo(
            screenInfo.filter(
                (star) =>
                    !(star.screenName === screenName && star.ticketPrice === ticketPrice && star.currentMovie.movieName === movieName)
            )
        );
        setScreenName('');
        setTicketPrice('');
        setMovieName('');
        setEndDate(null)

        setSCRName('');
        setTKTPrice('');
        setTempMovie('');
        setTempEnd(null)
    } //! Working perfectly

    async function pushNotifications(ev) {
        ev.preventDefault()
        const mID = await findMovieID(movieName)
        console.log({ City: city, movieID: mID, theaterID: id })

        axios.post('/pushnotifications', { city, movieID: mID, theaterID: id }).then(res => {
            console.log(res.data)

        })

    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <Modal
                opened={opened}
                onClose={() => {
                    setSCRName("");
                    setTKTPrice("");
                    setTempMovie("");

                    setScreenName("");
                    setTicketPrice("");
                    setMovieName("")
                    close();
                }}
                title="Add Screen Details"
                centered
            >
                {!!scrName == true && (
                    <form
                        onSubmit={(ev) => {
                            updatescrName(ev, { screenName, ticketPrice, movieName, endDate }), close();
                        }}
                    >
                        <h2 className="">Screen Name</h2>
                        <input
                            type="text"
                            value={scrName}
                            onChange={(ev) => setSCRName(ev.target.value)}
                            placeholder="Name of Cast or scrName"
                            id="service-name"
                        />
                        <h2 className="mt-1">Ticket Price</h2>
                        <input
                            type="text"
                            value={tktPrice}
                            onChange={(ev) => setTKTPrice(ev.target.value)}
                            placeholder="Enter their tktPrice"
                            id="service-name"
                        />

                        <div>
                            <h2 className="text-md mt-2">
                                Current Movie Playing
                            </h2>
                            <Select
                                placeholder="Select a movie"
                                checkIconPosition="right"
                                withScrollArea={false}
                                value={tempMovie}
                                onChange={(ev) => setTempMovie(ev)}
                                styles={{
                                    dropdown: {
                                        maxHeight: 200,
                                        overflowY: "auto",
                                        borderRadius: "7px",
                                    },
                                    wrapper: {
                                        borderRadius: "10px",
                                        marginBottom: "px",
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
                                data={moviesList()}
                            />
                            <h2 className="text-md mt-2 mb-3">End Date</h2>
                            <DateInput
                                value={tempEnd}
                                onChange={setTempEnd}
                                clearable
                                placeholder="mm/dd/yyyy"
                                styles={{
                                    dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                                    wrapper: {
                                        borderRadius: '10px'
                                    },
                                    input: {
                                        fontSize: '16px',
                                        padding: '22px 13px',
                                        borderRadius: '7px',
                                        caretColor: 'transparent'
                                    },
                                    option: {
                                        fontSize: '16px',
                                        padding: '8px 15px',
                                        borderRadius: '5px'
                                    },

                                }}
                            />
                        </div>

                        <div className="flex justify-center mt-7 mb-4">
                            {/* <motion.button
                                whileTap={{
                                    scale: 0.96,
                                }}
                                whileHover={{}}
                                onClick={(ev) => {
                                    pushNotifications(ev);
                                }}
                                className="bg-gray-400 flex gap-2 justify-center items-center bg-opacity-0 border border-gray-300 shadow-sm shadow-gray-100 p-3 rounded-[0.4em] justify-items-center hover:shadow-zinc-50 hover:bg-opacity-5 w-fit mt-5 text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                </svg>

                                Push Notifications
                            </motion.button> */}

                            <Checkbox
                                label="Push Notifications"
                                styles={{
                                    label: {
                                        fontSize: '18px'
                                    }
                                }}
                            />
                        </div>





                        <div className="flex gap-5 mx-1">
                            <button
                                onClick={(ev) => {
                                    updatescrName(
                                        ev,
                                        { screenName, ticketPrice, movieName, endDate },
                                        scrName,
                                        tktPrice,
                                        tempMovie,
                                        tempEnd
                                    );
                                    close();
                                }}
                                className="primary"
                            >
                                Update
                            </button>





                            <button
                                onClick={(ev) => {
                                    removescrName(ev, { screenName, ticketPrice, movieName });
                                    close();
                                }}
                                className="secondary"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                )}
                {!!scrName == false && (
                    <form onSubmit={addScreen}>
                        <h2 className="">Screen Name</h2>
                        <input
                            type="text"
                            value={screenName}
                            onChange={(ev) => setScreenName(ev.target.value)}
                            placeholder="Name of screen"
                            id="service-name"
                        />
                        <h2 className="mt-1">Ticket Price</h2>
                        <input
                            type="text"
                            value={ticketPrice}
                            onChange={(ev) => setTicketPrice(ev.target.value)}
                            placeholder="Enter the price"
                            id="service-name"
                        />

                        <div>
                            <h2 className="text-md mt-4">
                                Current Movie Playing
                            </h2>
                            <Select
                                placeholder="Select a movie"
                                checkIconPosition="right"
                                withScrollArea={false}
                                value={movieName}
                                onChange={(ev) => setMovieName(ev)}
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
                                data={moviesList()}
                            />
                            <h2 className="text-md mt-2 mb-3">End Date</h2>
                            <DateInput
                                value={endDate}
                                onChange={setEndDate}
                                clearable
                                placeholder="mm/dd/yyyy"
                                styles={{
                                    dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                                    wrapper: {
                                        borderRadius: '10px'
                                    },
                                    input: {
                                        fontSize: '16px',
                                        padding: '22px 13px',
                                        borderRadius: '7px',
                                        caretColor: 'transparent'
                                    },
                                    option: {
                                        fontSize: '16px',
                                        padding: '8px 15px',
                                        borderRadius: '5px'
                                    }
                                }}
                            />
                        </div>

                        <button
                            onClick={() => {
                                close();
                            }}
                            className="primary"
                        >
                            Add Screen
                        </button>
                    </form>
                )}
            </Modal>

            <div>
                <h2 className="text-xl mt-4">Screens</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                    {screenInfo.length > 0 &&
                        screenInfo.map((each, index) => (
                            <div key={index} className="border-0 border-red-500">
                                <div
                                    onClick={(ev) => {
                                        handlescrName(ev, each);
                                        open();
                                    }}
                                    className="flex relative flex-col items-center"
                                >
                                    <div className="text-2xl border hover:cursor-pointer relative flex justify-center items-center h-20 w-20 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-24 lg:w-24 xl:h-24 xl:w-24 rounded-full overflow-hidden">
                                        {each.screenName}
                                    </div>
                                </div>
                            </div>
                        ))}

                    <label
                        onClick={open}
                        className=" hover:bg-zinc-50 cursor-pointer flex border p-4 rounded-full h-20 w-20 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-24 lg:w-24 xl:h-24 xl:w-24 justify-center items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </label>
                </div>
            </div>
        </motion.div>
    );
}

export default Screens;
