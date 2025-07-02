import { useContext, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../AdminContext";
import { motion, AnimatePresence } from "framer-motion";

function Theatres() {

    const { admin, ready } = useContext(AdminContext);

    const [theatres, setTheatres] = useState([]);
    const [theatresReady, setTheatresReady] = useState(false);

    const [query, setQuery] = useState('');
    let [result, setResult] = useState([]);

    const MotionLink = motion(Link);

    useEffect(() => {
        axios.get('/gettheatres').then(res => {
            setTheatres(res.data);
            setTheatresReady(true);
        })
    }, [])

    useEffect(() => {
        const search = async () => {
            try {
                // if (!query.trim()) {
                //     setResult([])
                //     return;
                // }
                const res = await axios.get('/searchtheaters', { params: { key: query } })
                setResult(res.data)

            } catch (error) {
                console.log(error)
            }
        }
        search()
    }, [query])


    if (!ready) {
        return;
    }

    if (ready && !admin) {
        return <Navigate to={'/admin/login'} />
    }

    if (query === '') {
        result = theatres
    }

    return (

        <div className="border-0 border-red-600 w-full py-4 flex flex-col items-center">

            <div className="flex border-0 py-2 border-red-500 flex-col gap-5 items-center w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }} className="border-0 py-1.5 border-black flex items-center">
                    <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl font-semibold text-primary">Theaters</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }} className="flex justify-center bg-white w-9/12 sm:w-2/6 md:w-3/6 lg:w-3/6 xl:w-2/6 rounded-xl h-[6vh] sm:h-[5.5vh] md:h-[6vh] lg:h-[6vh] xl:h-[6.5vh] px-4 items-center border">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input
                        className="!text-[2.2vh] sm:!text-[2.2vh] md:!text-[2.2vh] lg:!text-[2.2vh] xl:!text-[2.4vh] !bg-transparent !border-none !shadow-none !font-medium !w-full !focus:outline-none !focus:border-none "
                        type="text"
                        placeholder="Search theaters"
                        value={query}
                        onChange={ev => setQuery(ev.target.value)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-primary text-white mt-1 py-3 px-3.5 rounded-[1.25vh]">
                    <Link className="flex gap-1" to={'/theatres/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Theatre
                    </Link>

                </motion.div>


            </div>



            <div className="border-0 border-red-500">


                <div className='sm:mx-4 md:mx-4 lg:mx-20 xl:mx-36 mt-2 px-5 py-2'>

                    <AnimatePresence>
                        {query && (

                            <div className={`mt-2 pb-6 flex flex-wrap justify-center gap-5 sm:gap-7 md:gap-7 lg:gap-7 xl:gap-7`}>
                                {result.length > 0 && result.map((theatre, index) => (
                                    <motion.div
                                        className="border w-[165px] h-[95px] sm:w-[180px] sm:h-[90px] md:w-[245px] md:h-[115px] lg:w-[245px] lg:h-[115px] xl:w-[245px] xl:h-[115px] py-3 px-3 hover:bg-zinc-100 rounded-md shadow-sm shadow-gray-200">
                                        <Link
                                            key={index} className="" to={'/theatres/' + theatre._id}>
                                            <div>
                                                <h2 className='font-semibold line-clamp-2 sm:text-[0.9em] md:text-[1.20em] lg:text-[1.20em] xl:text-[1.20em]'>{theatre.name}</h2>
                                            </div>
                                            <div>
                                                <h2 className='text-[0.95em] sm:text-[0.95em] md:text-[1.05em] lg:text-[1.05em] xl:text-[1.05em] text-zinc-500'>{theatre.city}</h2>
                                            </div>
                                        </Link>
                                    </motion.div>

                                ))}
                            </div>
                        )}

                        {!query && (

                            <div className={`mt-2 pb-6 flex flex-wrap justify-center gap-5 sm:gap-7 md:gap-7 lg:gap-7 xl:gap-7`}>
                                {theatres.length > 0 && theatres.map((theatre, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="border w-[165px] h-[95px] sm:w-[180px] sm:h-[90px] md:w-[245px] md:h-[115px] lg:w-[245px] lg:h-[115px] xl:w-[245px] xl:h-[115px] py-3 px-3 hover:bg-zinc-100 rounded-md shadow-sm shadow-gray-200">
                                        <Link key={index} className='' to={'/theatres/' + theatre._id}>
                                            <div className="border-0 border-red-500">
                                                <div>
                                                    <h2 className='font-semibold line-clamp-2 sm:text-[0.9em] md:text-[1.20em] lg:text-[1.20em] xl:text-[1.20em]'>{theatre.name}</h2>
                                                </div>
                                                <div className="flex">
                                                    <h2 className='text-[0.95em] sm:text-[0.95em] md:text-[1.05em] lg:text-[1.05em] xl:text-[1.05em] text-zinc-500'>{theatre.city}</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>


                                ))}
                            </div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>


    );
}

export default Theatres;