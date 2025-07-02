import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ShowTimings from "./ShowTimings";
import Screens from "./Screens";
import spinner from "../assets/spinner.gif";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconQuestionMark } from "@tabler/icons-react";
import { AdminContext } from "../AdminContext";
import { useContext } from "react";

function AddTheatre() {
    const { id } = useParams();

    const { admin, ready } = useContext(AdminContext);

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [timing, setTiming] = useState("");
    const [showTimings, setShowTimings] = useState([]);
    const [redirect, setRedirect] = useState(false);

    const [movies, setMovies] = useState([]);

    const [screw, setScrew] = useState([]);

    const [pageReady, setPageReady] = useState(false);

    const [screenInfo, setScreenInfo] = useState('');

    function toggle() {
        setPrivate(!isPrivate);
    }

    console.log(screenInfo)

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/getmovies').then(res => {
            // console.log(res.data);
            setMovies(res.data)
        })
        axios.get('/theatres/' + id).then(response => {
            const { data } = response;
            console.log(data);

            setName(data.name);
            setCity(data.city);
            setLatitude(data.location.coordinates[1])
            setLongitude(data.location.coordinates[0])
            setShowTimings(data.showTimings);
            setScreenInfo(data.screens)
            setPageReady(true)
        });

    }, [id]);

    function moviesList() {
        let moviesList = [];
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]?.category === "Available") {
                moviesList.push(movies[i]?.name);
            }
        }
        return moviesList;
    }

    async function goBack(ev) {
        ev.preventDefault();

        history.back();

        setName("");
        setCity("");
        setLatitude()
        setLongitude()
        setShowTimings([]);
        setMovieName("");
    }

    function addTiming(ev) {
        ev.preventDefault();
        setShowTimings((prev) => [...prev, timing]);

        // console.log(showTimings);
    }

    function findMovieID(moviePlaying) {
        for (let i = 0; i < movies.length; i++) {
            if (movies[i]?.name === moviePlaying) {
                return movies[i]?._id;
            }
        }
    }

    async function addTheatre(ev) {
        ev.preventDefault();

        if (latitude == "" || longitude == "") {
            notifications.show({
                title: "Please enter location details",
                radius: 'md',
                color: 'orange',
                icon: <IconQuestionMark />,
                withCloseButton: true,
                withBorder: true,
                autoClose: 2500,
                position: 'top-center'
            })

            return;
        }

        const theatreDetails = {
            name,
            city,
            latitude,
            longitude,
            showTimings,
            screenInfo,
        };

        if (id) {
            axios.put("/update-theatre", { id, ...theatreDetails }).then(res => {
                // console.log(res);
                notifications.show({
                    title: "Updated Details successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 1500,
                    position: 'top-center'
                })
            });
        } else {
            axios.post("/add-theatre", theatreDetails).then(res => {
                // console.log(res);
                notifications.show({
                    title: "Theatre Added Successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 1500,
                    position: 'top-center'
                })

            });
        }
        setRedirect(true);
    }

    async function deleteTheatre(ev) {
        ev.preventDefault();
        if (id) {
            axios.put("/delete-theatre/" + id).then(res => {
                console.log(res.data)
                notifications.show({
                    title: "Deleted theater successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 2500,
                    position: 'top-center'
                })
                setRedirect(true)
            })
        }
    }

    if (ready && !admin) {
        return <Navigate to={'/admin/login'} />
    }



    if (!pageReady) {
        return;
    }

    if (redirect) {
        return <Navigate to={"/theatres"} />;
    }

    return (
        <div className="mx-5 sm:mx-10 md:mx-10 lg:mx-32 xl:mx-64 my-12">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }} className="font-semibold text-4xl mb-5">
                Add <span className="text-primary">Theatre</span>
            </motion.h1>

            <form className="border-0 border-red-600" id="service-info">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} >
                    <h2 className="text-xl mt-2">Name</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        placeholder="Name of the Theatre"
                        id="theatre-name"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <h2 className="text-xl mt-2">City</h2>
                    <input
                        type="text"
                        value={city}
                        onChange={(ev) => setCity(ev.target.value)}
                        placeholder="Enter the city"
                        id="city-name"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <h2 className="text-xl mt-2">Coordinates</h2>
                    <div className="flex flex-wrap sm:gap-5 md:gap-5 lg:gap-5 xl:gap-5">

                        <input type="number"
                            step={0.00000000000001}
                            value={latitude}
                            onChange={(ev) => setLatitude(parseFloat(ev.target.value))}
                            placeholder="Latitude" />

                        <input type="number"
                            step={0.00000000000001}
                            value={longitude}
                            onChange={(ev) => setLongitude(parseFloat(ev.target.value))}
                            placeholder="Longitude" />

                    </div>
                </motion.div>

                <ShowTimings showTimings={showTimings} setShowTimings={setShowTimings} />

                <Screens screenInfo={screenInfo} setScreenInfo={setScreenInfo} city={city} id={id} />


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} title="Buttons" className="flex flex-wrap-reverse justify-between mt-4">
                    <div className="flex border-0 border-red-400 justify-start gap-5 items-center">
                        <motion.button
                            whileTap={{
                                scale: 0.96,
                            }}
                            onClick={addTheatre}
                            className="bg-primary p-2.5 rounded-[0.4em] justify-items-center text-white w-28 mt-5 ml-1 text-lg"
                        >
                            Save
                        </motion.button>

                        <motion.button
                            whileTap={{
                                scale: 0.96,
                            }}
                            whileHover={{}}
                            onClick={goBack}
                            className="bg-gray-400 bg-opacity-0 border border-gray-300 shadow-sm shadow-gray-100 p-2.5 rounded-[0.4em] justify-items-center hover:shadow-gray-200 hover:bg-opacity-5 w-28 mt-5 ml-1 text-lg"
                        >
                            Cancel
                        </motion.button>
                    </div>

                    {id && (
                        <button
                            onClick={deleteTheatre}
                            className="flex bg-gray-400 justify-center items-center bg-opacity-0 py-2 px-4 gap-1.5 border border-gray-200 text-red-600 shadow-sm shadow-gray-100 p-2.5 rounded-[0.4em] justify-items-center w-28 mt-5 ml-1 text-lg hover:shadow-sm hover:shadow-gray-200 hover:bg-opacity-5"
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                            Delete
                        </button>
                    )}
                </motion.div>
            </form>
        </div>
    );
}

export default AddTheatre;
