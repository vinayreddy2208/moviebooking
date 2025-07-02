import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from "@mantine/core";

function TestPage() {

    const [movies, setMovies] = useState([])
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    useEffect(() => {
        axios.get('/getmovies').then(res => {
            setMovies(res.data);
        })
    }, [])

    if (movies == '') {
        return;
    }

    return (
        <div className="flex justify-center items-center h-full border border-red-500 p-2">
            {movies && movies.length > 0 && (
                <div className="border border-red-500 flex flex-col gap-1 max-h-[45vh] overflow-scroll p-4">
                    {movies.map(movie => (

                        <div className="flex gap-3.5 items-center border-b hover:bg-zinc-100 cursor-pointer p-2.5 rounded-md">

                            <div className="flex flex-shrink-0 justify-center border-red-500 w-auto h-[5.67rem]">
                                <Image w={60} src={`${serverBase}/uploads/` + movie.thumbnail} />
                            </div>

                            <div>
                                <p className="text-xl font-semibold line-clamp-1">{movie.name}</p>
                                <p className="line-clamp-2">{movie.synopsis}</p>
                            </div>

                        </div>



                    ))}
                </div>
            )}
        </div>
    );
}

export default TestPage;