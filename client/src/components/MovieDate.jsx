import axios from "axios"
import { useEffect, useState } from "react"

function MovieDate({ movieScreens, setBookingDate, setTheaters, id }) {

    const today = new Date()
    today.setHours(0, 0, 0, 0);
    const [endDate, setEndDate] = useState(null)
    const [dateRange, setDateRange] = useState([])
    const [selectedDate, setSelectedDate] = useState(today)

    useEffect(() => {
        if (movieScreens.length < 1) {
            return
        }

        const screens = movieScreens.filter(theater =>
            theater.screens.some(screen => {
                const theaterEndDate = new Date(screen.currentMovie.endDate);
                theaterEndDate.setDate(theaterEndDate.getDate() + 1)
                return screen.currentMovie.movieID === id && selectedDate < theaterEndDate
            })
        )
        setTheaters(screens)

    }, [selectedDate])

    function selectDate(date) {
        if (movieScreens.length < 1) {
            return
        }

        console.log(date)

        const screens = movieScreens.filter(theater =>
            theater.screens.some(screen => {
                const theaterEndDate = new Date(screen.currentMovie.endDate);
                theaterEndDate.setDate(theaterEndDate.getDate() + 1)
                return screen.currentMovie.movieID === id && date < theaterEndDate
            })
        )
        setTheaters(screens)
    }

    function dateStyle(date) {
        let dateClass = "cursor-pointer border flex justify-center shadow-gray-100 shadow-sm items-center px-2.5 py-1 min-w-24 h-[6.5vh] rounded-md"
        if (selectedDate === date) {
            dateClass += " bg-primary text-white"
        } else {
            dateClass += " bg-zinc-50"
        }
        return dateClass
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);

        // Get the day with suffix
        const day = date.getDate();
        const suffix = (day) => {
            if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${suffix(day)} ${date.toLocaleString('default', { month: 'short' })}`;
    }

    useEffect(() => {
        function farthestEndDate(theaters) {

            if (theaters.length < 1) {
                return
            }

            let lastDate = theaters[0].screens.filter(screen => screen.currentMovie.movieID === id)[0].currentMovie.endDate
            if (theaters.length < 2) {
                setEndDate(lastDate)
            }
            for (let i = 0; i < theaters.length; i++) {
                if (lastDate < theaters[i].screens.filter(screen => screen.currentMovie.movieID === id)[0].currentMovie.endDate) {
                    lastDate = theaters[i].screens.filter(screen => screen.currentMovie.movieID === id)[0].currentMovie.endDate
                }
            }
            setEndDate(lastDate)

            const finalDate = new Date(lastDate)
            const diff = finalDate - today
            const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))

            const dates = []

            for (let i = 0; i <= diffInDays; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i)
                dates.push(currentDate)
            }

            setDateRange(dates)
        }
        farthestEndDate(movieScreens)

    }, [endDate])

    console.log(dateRange)
    console.log(today)

    return (
        <div className="border-0 p-1 mt-4 flex flex-row gap-3 border-red-500 overflow-scroll no-scrollbar" >
            {dateRange.length > 0 && dateRange.map((date, index) => (
                <div onClick={() => {
                    selectDate(date)
                    setBookingDate(date)
                    setSelectedDate(date)
                }} key={index} className={dateStyle(date)}>
                    <p className="font-medium">{formatDate(date)}</p>
                </div>
            ))}
        </div>
    )
}

export default MovieDate