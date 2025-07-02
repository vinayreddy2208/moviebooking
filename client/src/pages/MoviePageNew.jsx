
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

function MoviePageNew() {

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
        <div className="flex justify-center border-0 border-red-400">
            <div className="border-0 border-purple-400 bg-zinc-100 rounded-2xl w-11/12 h-[60vh]">
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
        </div>
    );
}

export default MoviePageNew;