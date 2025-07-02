
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Skeleton, Image } from "@mantine/core";
import { useEffect, useContext, useMemo, useState, useRef } from "react";
import spinner from '../assets/spinner.gif';
import poster from '../assets/poster.jpg';
import { Loader } from '@mantine/core';
import { UserContext } from '../UserContext';

function MainPage() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { ready } = useContext(UserContext);

    const [movies, setMovies] = useState([])
    const [result, setResult] = useState([])
    const [query, setQuery] = useState("")
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    useEffect(() => {
        axios.get('/showmovies').then(res => {
            setMovies(res.data);
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        const search = async () => {
            try {
                if (!query.trim()) {
                    setResult([])
                    return;
                }

                const res = await axios.get('/searchmovies', { params: { key: query, limit: 4 } })
                setResult(res.data)

            } catch (error) {
                console.log(error)
            }
        }
        search()
    }, [query])

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' }); // Adjust scroll amount as needed
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' }); // Adjust scroll amount as needed
        }
    };

    const randos = useMemo(() => {

        if (movies.length === 0) return;

        let a = Math.floor(Math.random() * movies.length)
        // let b = Math.floor(Math.random() * movies.length)
        // let c = Math.floor(Math.random() * movies.length)

        let d = Math.floor(Math.random() * movies[a].photos.length)
        let e = Math.floor(Math.random() * movies[a].photos.length)
        // let f = Math.floor(Math.random() * 4)

        while (d == e) {
            d = Math.floor(Math.random() * 4)
        }

        // while (a == b) {
        //     b = Math.floor(Math.random() * movies.length);
        // }

        // while (a == c || b == c) {
        //     c = Math.floor(Math.random() * movies.length);
        // }

        // return { a, b, c, d, e, f };
        return { a, d, e };

    }, [movies])

    // if (movies.length == 0) {
    //     return;
    // }

    if (!randos) {
        return <Loader className="flex absolute h-5/6 w-screen items-center justify-center" color="#f24c62" />;
    }

    if (!ready) {
        return <Loader className="flex absolute h-3/4 w-screen items-center justify-center" color="#f24c62" />;
    }

    console.log(randos)
    console.log(movies)

    return (
        <div className="flex flex-col gap-2 border-0 border-red-500 mt-2 h-full">

            <motion.div
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.25
                }}
                className="border-0 relative bottom-2.5 border-red-500 mx-[2vh] xl:mx-[12vh] flex justify-center xl:h-[49vh] p-3"
            >

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.992 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => { navigate('/movies/' + movies[randos.a]._id) }}
                    style={{
                        filter: 'drop-shadow(1px 8px 20px rgba(242, 76, 98, 0.35))',
                    }} className="cursor-pointer relative border-0 border-orange-500 flex flex-row justify-center rounded-[1.25em] overflow-hidden">

                    <div className="bg-[#65202020]  mix-blend-lighten absolute inset-0"></div>

                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-primary/65"></div>

                    <div className="border-0 border-blue-500">
                        <img className="object-cover w-[210vh] h-full" src={`${serverBase}/uploads/` + movies[randos.a].photos[randos.d]} alt="" />
                    </div>

                    <div className="border-0 border-blue-500">
                        <img className="object-cover w-[210vh] h-full" src={`${serverBase}/uploads/` + movies[randos.a].photos[randos.e]} alt="" />
                    </div>

                    {/* <div className="border-0 border-blue-500">
                        <img className="object-cover w-[210vh] h-full" src={`${serverBase}/uploads/` + movies[randos.a].photos[0]} alt="" />
                    </div> */}

                </motion.div>

                <div className="absolute flex flex-col bottom-12 lg:bottom-24 xl:bottom-[8vh]">
                    {/* <h1 style={{ textShadow: '1px 3px 20px black' }} className="sm:text-[4.75vh] lg:text-[2.5vh] xl:text-[4vh] text-center text-white font-semibold italic">{movies[randos.a].name} </h1> */}
                    <h1 style={{ textShadow: '1px 3px 20px black' }} className="xl:text-[5.5vh] text-center text-white font-semibold italic">Skip the Lines. Book Your Movie Tickets Now!</h1>
                    {/* <h1 className="text-[6vh] text-center text-white font-semibold italic">Shut the fuck up and book movie tickets now!</h1> */}
                </div>

                <motion.div
                    transition={{ duration: 0.4 }}
                    style={{
                        filter: 'drop-shadow(0px 5px 50px rgba(242, 76, 98, 0.25))',
                    }} className="flex justify-center absolute bg-white w-4/6 sm:w-3/6 lg:w-3/6 xl:w-5/12 rounded-xl h-[6vh] xl:h-[6.5vh] px-4 items-center -bottom-3 shadow-md shadow-primary/30">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 xl:size-7 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input
                        className="md:!text-[2.25vh] xl:!text-[2.5vh] !bg-transparent !border-none !shadow-none !font-medium !w-full !focus:outline-none !focus:border-none "
                        type="text"
                        placeholder="Search movies"
                        value={query}
                        onChange={ev => setQuery(ev.target.value)}
                    />
                </motion.div>

                {result && result.length > 0 && (
                    <motion.div
                        initial={{ scale: 0.99 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col bg-white rounded-xl absolute z-40 top-[25vh] xl:top-[51.5vh] w-4/6 sm:w-3/6 lg:w-1/3 xl:w-5/12 max-h-[35vh] overflow-scroll border px-2 py-2">
                        {result.map(movie => (
                            <Link to={'/movies/' + movie._id} className="cursor-pointer hover:bg-zinc-200/60 flex gap-4 bg-white items-center rounded-xl px-3 py-2.5" key={movie._id}>

                                <div className="flex flex-shrink-0 justify-center w-auto h-[3.45rem] xl:h-[5.67rem]">
                                    <Image radius="sm" w={60} src={`${serverBase}/uploads/` + movie.thumbnail} />
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className="text-md md:text-lg xl:text-xl font-semibold line-clamp-1">{movie.name}</p>
                                    <p className="line-clamp-2 italic text-gray-500 text-sm">{movie.synopsis}</p>
                                </div>

                            </Link>
                        ))}
                    </motion.div>
                )}

            </motion.div>

            {/* //! New releases */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                title="New Releases" className="border-0 border-green-600 px-4 mx-3 xl:mx-10 py-2">
                <div>
                    <h1 className="text-[1.4em] sm:text-[1.55em] md:text-[1.55em] lg:text-[1.55em] xl:text-[1.55em] font-semibold mb-5">New Releases</h1>
                </div>
                <div className="border-0 sm:mx-4 md:mx-4 lg:mx-4 xl:mx-4 gap-6 border-red-500 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-flow-cols-6 h-auto">
                    {movies.length > 0 && movies.map((movie, index) => movie.category == 'Available' && (
                        <div key={index} className="flex flex-col gap-3">
                            <Link to={'/movies/' + movie._id} className="hover:bg-zinc-50 rounded-[0.5em] w-auto shadow-md shadow-zinc-300 h-[15em] sm:h-[22.86em] md:h-[22.86em] lg:h-[22.86em] xl:h-[22.86em] justify-center items-center overflow-hidden">
                                <motion.div
                                    initial={{ scale: 1.05 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.09 }}
                                    className="bg-black relative h-full object-cover rounded-xl">
                                    <Image className="hover:opacity-80 h-full object-cover" radius="md" src={`${serverBase}/uploads/` + movie.thumbnail} />
                                </motion.div>

                            </Link>
                            <div>
                                <p className="pl-1 line-clamp-1 text-[1.9vh] sm:text-[2.35vh] md:text-[1.1em] lg:text-[2.35vh] xl:text-[2.35vh] font-semibold">{movie.name} </p>
                            </div>

                        </div>

                    ))}
                </div>
            </motion.div>

            {/* //! Coming soon */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                title="Upcoming" className="border-0 border-green-600 px-4 mx-3 xl:mx-10 py-2">
                <div>
                    <h1 className="text-[1.4em] sm:text-[1.55em] md:text-[1.55em] lg:text-[1.55em] xl:text-[1.55em] font-semibold mb-5">Coming Soon</h1>
                </div>

                <div className="flex relative">

                    <button onClick={scrollLeft} className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 bg-white hover:bg-zinc-100 p-2 rounded-full shadow-md focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <div ref={scrollContainerRef} className="border-0 rounded-[0.5em] mx-4 gap-6 border-red-500 flex flex-nowrap no-scrollbar overflow-y-hidden overflow-x-scroll h-auto">
                        {movies.length > 0 && movies.map((movie, index) => movie.category == 'Upcoming' && (
                            <div key={index} className="flex flex-col gap-3">
                                <Link to={'/movies/' + movie._id} className="hover:bg-zinc-50 min-w-[10em] md:min-w-[26.65vh] xl:min-w-[15em] rounded-[0.5em] w-auto shadow-md shadow-zinc-300 h-[15em] lg:h-[22.86em] xl:h-[22.86em] justify-center items-center overflow-hidden">
                                    <motion.div
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.09 }}
                                        className="bg-black h-full object-cover rounded-xl">
                                        <Image className="hover:opacity-85 h-full object-cover" radius="md" src={`${serverBase}/uploads/` + movie.thumbnail} fallbackSrc={poster} />
                                    </motion.div>
                                </Link>
                                <div>
                                    <p className="px-1 line-clamp-1 text-[1.9vh] sm:text-[2.35vh] md:text-[2.35vh] ;g:text-[2.35vh] xl:text-[2.35vh] font-semibold">{movie.name} </p>
                                </div>
                            </div>

                        ))}
                    </div>

                    <button onClick={scrollRight} className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 bg-white hover:bg-zinc-100 p-2 rounded-full shadow-md focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                </div>
            </motion.div>

        </div>
    );
}

export default MainPage;