
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Movies from "../Movies";
import { motion } from "framer-motion";
import axios from "axios";
import { Image } from "@mantine/core";
import { AdminContext } from "../../AdminContext";
import spinner from '../../assets/spinner.gif';

function Available() {

    const [movies, setMovies] = useState([]);
    const [moviesReady, setMoviesReady] = useState(false);
    const { ready } = useContext(AdminContext);
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    useEffect(() => {
        axios.get('/getmovies').then(res => {
            setMovies(res.data);
            setMoviesReady(true);
        })
    }, [])

    if (!ready) {
        return;
        // return <div className="flex absolute h-screen w-screen justify-center items-center"><img className="w-14 mb-10" src={spinner} alt="" /></div>
    }

    return (
        <div>
            <Movies />
            <div className="border-0 border-red-500 px-5 mx-1 sm:mx-10 md:mx-10 lg:mx-10 xl:mx-10 py-2">
                {moviesReady && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-0 gap-6 border-red-500 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">

                        {/* <Link className="border mb-1 bg-zinc-50 rounded-[0.5em] w-[15.35em] px-6 py-[10.16em] flex justify-center items-center h-fit" to={'/movies/new'}>
                            <motion.button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-zinc-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </motion.button>
                        </Link> */}

                        <Link className="border mb-1 bg-zinc-50 rounded-[0.5em] h-[15em] sm:w-auto sm:h-[19em] md:w-auto md:h-[21em] lg:w-auto lg:h-[21em] xl:w-[15.35em] xl:h-[22.86em] flex justify-center items-center" to={'/movies/new'}>
                            <motion.button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-zinc-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </motion.button>
                        </Link>

                        {movies.length > 0 && movies.map((movie, index) => movie.category == 'Available' && (
                            <Link key={index} to={'/movies/' + movie._id} className="hover:bg-zinc-50 rounded-[0.5em] w-auto shadow-md shadow-zinc-300 h-[15em] sm:h-[19em] md:h-[21em] lg:h-[21em] xl:h-[22.86em] justify-center items-center overflow-hidden">
                                <div className="bg-black relative h-full object-cover">
                                    <Image className="hover:opacity-80 h-full object-cover" radius="md" src={`${serverBase}/uploads/` + movie.thumbnail} />
                                </div>

                            </Link>
                        ))}

                    </motion.div>
                )}

            </div >
        </div >
    );
}

export default Available;