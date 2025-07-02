
function CastAndCrew({ screw }) {

    if (screw == null) {
        return;
    }

    return (
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-11 gap-2 md:gap-5 ml-2 mt-2 justify-center ">
            {screw.length > 0 && screw.map((each, index) => (
                <div key={index} className="flex relative flex-col items-center">
                    <div className="border relative flex justify-center items-center h-24 w-24 rounded-full overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-18 text-zinc-300 mt-7">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-[1.05em] font-medium mt-2 text-center">{each.crew}</h1>
                    <h2 className="text-center">{each.role}</h2>
                </div>
            ))}
        </div>
    );
}

export default CastAndCrew;