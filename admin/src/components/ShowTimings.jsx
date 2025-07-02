import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { motion } from 'framer-motion';


function ShowTimings({ showTimings, setShowTimings }) {
    const [opened, { open, close }] = useDisclosure(false);

    const [timing, setTiming] = useState("");
    const [upTime, setupTime] = useState("");

    function addTiming(ev) {
        ev.preventDefault();
        setShowTimings((prev) => [...prev, timing]);
        setTiming("");
    }

    function handleTiming(ev, each) {
        ev.preventDefault();
        setupTime(each);
        setTiming(each);
    }

    function updateTiming(ev, timing, upTime) {
        ev.preventDefault();

        setShowTimings(
            showTimings.map((time) => {
                if (time === timing) {
                    return upTime;
                }
                return time;
            })
        );

        setTiming("");
        setupTime("");
    }

    function removeTiming(ev, upTime) {
        ev.preventDefault();
        setShowTimings(showTimings.filter((time) => time !== upTime));
        setTiming("");
        setupTime("");
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }} className="mb-2">
            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    setCrew("");
                    setRole("");
                }}
                title="Add Timing"
                centered
            >
                {!!upTime == true && (
                    <form
                        onSubmit={(ev) => {
                            updateTiming(ev, timing, upTime), close();
                        }}
                    >
                        <input
                            type="text"
                            value={upTime}
                            onChange={(ev) => setupTime(ev.target.value)}
                            placeholder="New Timing"
                        />

                        <div className="flex gap-5 mx-1">
                            <button
                                onClick={(ev) => {
                                    updateTiming(ev, timing, upTime);
                                    close();
                                }}
                                className="primary"
                            >
                                Update
                            </button>

                            <button
                                onClick={(ev) => {
                                    removeTiming(ev, upTime);
                                    close();
                                }}
                                className="secondary"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                )}
                {!!upTime == false && (
                    <form onSubmit={addTiming}>
                        <input
                            type="text"
                            value={timing}
                            onChange={(ev) => setTiming(ev.target.value)}
                            placeholder="Enter the timing"
                            id="service-name"
                        />
                        <button
                            onClick={() => {
                                close();
                            }}
                            className="primary"
                        >
                            Add Timing
                        </button>
                    </form>
                )}
            </Modal>

            <div className="mt-2">
                <h2 className="text-xl">Timings</h2>
                <div className="flex flex-wrap mt-3 gap-4 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3 border-0 border-red-500">
                    {showTimings.length > 0 &&
                        showTimings.map((each, index) => (
                            <div
                                key={index}
                                onClick={(ev) => {
                                    handleTiming(ev, each);
                                    open();
                                }}
                                className="hover:bg-zinc-50 cursor-pointer border px-3 py-3.5 rounded-lg"
                            >
                                {each}
                            </div>
                        ))}
                    <label
                        onClick={open}
                        className="hover:bg-zinc-50 border flex rounded-md cursor-pointer py-3 px-[1.75em] sm:px-[1.6em] md:px-[1.6em] lg:px-[1.6em] xl:px-[1.6em] justify-center items-center"
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
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </label>
                </div>
            </div>
        </motion.div>
    );
}

export default ShowTimings;
