
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { Image, Select } from '@mantine/core';
import PhotosUploader from "./PhotosUploader";
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import LanguageSelect from "./LanguageSelect";
import CastAndCrew from "./CastAndCrew";
import GenreSelect from "./GenreSelect";
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconQuestionMark } from "@tabler/icons-react";
import { useContext } from "react";
import { AdminContext } from "../AdminContext";

function AddMovie() {

    const { id } = useParams();

    const { admin, ready } = useContext(AdminContext);

    const [name, setName] = useState('');
    const [syn, setSyn] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [lang, setLang] = useState([]);

    const [trailer, setTrailer] = useState('');
    const [embedLink, setEmbedLink] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [addedPics, setAddedPics] = useState([]);

    const [censor, setCensor] = useState('');

    const [releaseDate, setReleaseDate] = useState(null)
    const [endDate, setEndDate] = useState(null);

    const [avail, setAvail] = useState('');
    const [genre, setGenre] = useState([]);

    const [screw, setScrew] = useState([]);

    const [isPrivate, setPrivate] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    function toggle() {
        setPrivate(!isPrivate);
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        name, syn, lang, thumbnail, addedPics, trailer, censor, screw
        axios.get('/movies/' + id).then(response => {
            const { data } = response;
            console.log(data)
            setName(data.name);
            setSyn(data.synopsis);
            setLang(data.lang);
            setThumbnail(data.thumbnail);
            setAddedPics(data.photos);
            trailerLink(data.trailer)
            setCensor(data.censor);

            if (data.releaseDate) {
                const reldate = new Date(data.releaseDate)
                setReleaseDate(reldate)
            }

            setAvail(data.category)
            setGenre(data.genre)
            setScrew(data.castAndcrew);

            if (data.endDate) {
                const edate = new Date(data.endDate)
                setEndDate(edate)
            }

        });

    }, [id]);

    async function goBack(ev) {
        ev.preventDefault();

        history.back()

        setName('')
        setSyn('')
        setLang([])
        setThumbnail('')
        setAddedPics([])
        setTrailer('')
        setCensor('')
        setEndDate(null)
        setAvail('')
        setGenre([])
        setScrew([])
    }

    function trailerLink(link) {
        setTrailer(link);
        const trailerArr = link.split('=');
        setEmbedLink(trailerArr[1]);
    }

    async function uploadThumb(ev) {
        const files = ev.target.files;
        const data = new FormData();
        data.append('thumbnail', files[0]);

        await axios.post('/thumbnail', data, {
            headers: { 'Content-Type': 'multi-part/form-data' }
        }).then(response => {
            const { data: filename } = response;
            setThumbnail(filename);
            console.log(filename);
        })
    }

    function addMovie(ev) {
        ev.preventDefault()

        if (avail.length == 0) {
            notifications.show({
                title: "Enter Details First",
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

        const movieDetails = { name, syn, lang, thumbnail, addedPics, trailer, censor, releaseDate, endDate, avail, genre, screw }
        console.log(movieDetails)
        if (id) {
            axios.put('/update-movie', { id, ...movieDetails }).then(res => {
                console.log(res);
                notifications.show({
                    title: "Updated Details Successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 1500,
                    position: 'top-center'
                })
            })
        } else {
            axios.post('/add-movie', movieDetails).then(res => {
                console.log(res);
                notifications.show({
                    title: "Movie Added Successfully",
                    radius: 'md',
                    color: 'green',
                    icon: <IconCheck />,
                    withCloseButton: true,
                    withBorder: true,
                    autoClose: 1500,
                    position: 'top-center'
                })
            })
        }
        setRedirect(true);
    }

    async function deleteMovie(ev) {
        ev.preventDefault();
        await axios.put('/delete-movie/' + id);
        notifications.show({
            title: "Deleted successfully",
            radius: 'md',
            color: 'orange',
            icon: <IconCheck />,
            withCloseButton: true,
            withBorder: true,
            autoClose: 1500,
            position: 'top-center'
        })
        setRedirect(true);
    }

    if (ready && !admin) {
        return <Navigate to={'/admin/login'} />
    }

    if (redirect) {
        return <Navigate to={'/movies/available'} />
    }

    return (

        <div className="mx-5 sm:mx-10 md:mx-10 lg:mx-32 xl:mx-64 my-12">

            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-4xl mb-5">Add <span className="text-primary">Movie</span></motion.h1>

            <form className="border-0 border-red-600" id="service-info">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <h2 className="text-xl mt-2">Name</h2>
                    <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Name of the Movie" id="service-name" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <h2 className="text-xl mt-2">Synopsis</h2>
                    <textarea className="h-36"
                        value={syn}
                        onChange={ev => {

                            setSyn(ev.target.value)

                        }}
                        placeholder="Enter movie synopsis"
                        draggable="false"
                        maxLength={500}
                        id="service-description"
                    />
                </motion.div>

                <LanguageSelect lang={lang} onChange={setLang} />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} title="Thumbnail" className="w-64">
                    <h2 className="text-xl mt-6">Thumbnail</h2>

                    {!!thumbnail == false && (
                        <motion.label
                            whileTap={{
                                scale: 0.97
                            }}
                            className="bg-zinc-300 mt-4 w-auto bg-opacity-0 h-36 flex justify-center items-center gap-2 border border-gray-300 shadow-sm shadow-gray-100 rounded-2xl p-8 text-lg hover:bg-opacity-[0.04] text-stone-900mt-1 cursor-pointer">
                            <input type="file" className="hidden" onChange={uploadThumb} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload Thumbnail

                        </motion.label>
                    )}

                    {!!thumbnail && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative mt-4">
                            <div onClick={() => setThumbnail('')} className="absolute right-2 cursor-pointer top-2 bg-black bg-opacity-50 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <Image radius="lg" src={`${serverBase}/uploads/` + thumbnail} />
                        </motion.div>
                    )}
                </motion.div>

                <PhotosUploader addedPics={addedPics} setAddedPics={setAddedPics} />

                <div title="Trailer" className="mt-5">
                    <h2 className="text-xl mt-2">Trailer Link</h2>
                    <input type="text" value={trailer} onChange={ev => trailerLink(ev.target.value)} placeholder="Paste the trailer link" id="service-name" />
                    {!!embedLink && (
                        <div className="mt-2 ml-1 mb-4">
                            <iframe className="w-[327px] h-[184px] sm:w-[560px] sm:h-[315px] md:w-[560px] md:h-[315px] lg:w-[560px] lg:h-[315px] xl:w-[560px] xl:h-[315px]" src={`https://www.youtube.com/embed/${embedLink}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"></iframe>
                        </div>
                    )}
                </div>

                <div title="Censor" className="mt-5">
                    <h2 className="text-xl mb-3">Certificate / Censor</h2>
                    <Select
                        placeholder="Select a certificate"
                        searchable
                        checkIconPosition="right"
                        withScrollArea={false}
                        value={censor}
                        onChange={ev => setCensor(ev)}
                        styles={{
                            dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                            wrapper: {
                                borderRadius: '10px'
                            },
                            input: {
                                fontSize: '16px',
                                padding: '22px 13px',
                                borderRadius: '7px',
                                cursor: 'pointer',
                                caretColor: 'transparent'
                            },
                            option: {
                                fontSize: '16px',
                                padding: '8px 15px',
                                borderRadius: '5px'
                            },
                        }}
                        mt="md"
                        data={['Yet to be Specified', 'U - Unrestricted', 'U/A - Parental Discretion Advisory', 'A - Adult', 'R - Restricted', 'S - Specialized']} />
                </div>

                <div className="mt-5">
                    <h2 className="text-xl mt-2">Release Date</h2>

                    <div className="flex items-center gap-4 mt-3">

                        <DateInput
                            value={releaseDate}
                            onChange={setReleaseDate}
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
                                    cursor: 'pointer',
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

                </div>

                <div title="End Date">
                    <h2 className="text-xl mt-4">End Date</h2>
                    <div className="flex items-center gap-4 mt-3">

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
                                },

                            }}
                        />
                    </div>
                </div>

                <div title="Category">
                    <h2 className="text-xl mt-4">Category</h2>

                    <div className="w-64">
                        <Select
                            placeholder="Select Availability"
                            searchable
                            checkIconPosition="right"
                            withScrollArea={false}
                            value={avail}
                            onChange={ev => setAvail(ev)}
                            styles={{
                                dropdown: { maxHeight: 200, overflowY: 'auto', borderRadius: '7px' },
                                wrapper: {
                                    borderRadius: '10px'
                                },
                                input: {
                                    fontSize: '16px',
                                    padding: '22px 13px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    caretColor: 'transparent'
                                },
                                option: {
                                    fontSize: '16px',
                                    padding: '8px 15px',
                                    borderRadius: '5px'
                                },
                            }}
                            mt="md"
                            data={['Available', 'Upcoming', 'Private']} />
                    </div>

                </div>

                <GenreSelect genre={genre} onChange={setGenre} />

                <CastAndCrew screw={screw} setScrew={setScrew} />

                <div title="Buttons" className="flex flex-wrap-reverse justify-between mt-4">
                    <div className="flex border-0 border-red-400 justify-start gap-5 items-center">
                        <motion.button
                            whileTap={{
                                scale: 0.96
                            }}
                            onClick={addMovie} className="bg-primary p-2 rounded-[0.4em] justify-items-center text-white w-28 mt-5 ml-1 text-lg">Save</motion.button>
                        <motion.button
                            whileTap={{
                                scale: 0.96
                            }}
                            whileHover={{

                            }}
                            onClick={goBack}
                            className="bg-gray-400 bg-opacity-0 border border-gray-300 shadow-sm shadow-gray-100 p-2 rounded-[0.4em] justify-items-center hover:shadow-gray-200 hover:bg-opacity-5 w-28 mt-5 ml-1 text-lg">Cancel</motion.button>
                    </div>

                    {id && (

                        <button onClick={deleteMovie} className="flex bg-gray-400 bg-opacity-0 py-2 px-4 gap-1.5 border border-gray-200 text-red-600 shadow-sm shadow-gray-100 p-2 rounded-[0.4em] justify-items-center w-28 mt-5 ml-1 text-lg hover:shadow-sm hover:shadow-gray-200 hover:bg-opacity-5">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                        </button>

                    )}
                </div>
            </form>
        </div>
    );
}

export default AddMovie
