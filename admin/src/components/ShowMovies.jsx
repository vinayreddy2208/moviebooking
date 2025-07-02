
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ShowMovies() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        
    }, [])

    return (
        <div className="border border-red-500 px-5 mx-10 py-2">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 h-80">
                <Link className="border hover:bg-zinc-50 rounded-[0.5em] p-6 flex justify-center items-center" to={'/movies/new'}>
                    <motion.button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-zinc-800">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </motion.button>
                </Link>


                {movies.length > 0 && movies.map((movie, index) => {
                    <Link key={index}>

                    </Link>
                })}

            </div>
        </div>
    );
}

export default ShowMovies;