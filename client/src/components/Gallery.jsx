
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion'
import { Image } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import { Modal } from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

function Gallery({ movie, photos }) {

    const [opened, { open, close }] = useDisclosure(false);
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-0 border-red-700 flex flex-col gap-2 mt-3 mx-4 px-6 py-4 ">
            <h2 className="text-[1.6em] font-semibold mb-2">Gallery</h2>
            {photos.length == 0 && (
                <div className="text-lg mx-4 text-zinc-400">
                    Photos Unavailable
                </div>
            )}

            <div className="border-0 border-purple-500 grid gap-2.5 grid-cols-[2fr_1fr] w-[40em] rounded-2xl overflow-hidden">
                {movie.photos?.[0] && (
                    <img className="aspect-square cursor-pointer object-cover shadow-lg shadow-gray-400"
                        src={`${serverBase}/uploads/` + movie.photos[0]}
                        onClick={open}
                    />
                )}
                <div className="grid">
                    {movie.photos?.[1] && (
                        <img className="aspect-square cursor-pointer object-cover shadow-md shadow-gray-300"
                            src={`${serverBase}/uploads/` + movie.photos[1]}
                            onClick={open}
                        />
                    )}
                    <div className="overflow-hidden border-0 border-red-500">
                        {movie.photos?.[2] && (
                            <div className="relative">
                                <img className="aspect-square cursor-pointer object-cover relative top-2 shadow-md shadow-gray-300"
                                    src={`${serverBase}/uploads/` + movie.photos[2]}
                                />
                                <div onClick={open} className="flex hover:cursor-pointer absolute top-2 bg-opacity-70 text-white items-center justify-center text-[1.8em] font-light h-full w-full bg-black">
                                    + More
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                opened={opened}
                onClose={close}
                size={'auto'}
                title={<h2 className="text-2xl font-medium">Gallery</h2>}
                closeButtonProps={{
                    size: 40
                }}
                transitionProps={{
                    transition: 'fade',
                    duration: 200,
                    timingFunction: 'linear'
                }}
                centered>
                {photos.length > 0 && (
                    <Carousel
                        draggable
                        previousControlIcon={<IconArrowLeft style={{ width: 36, height: 36, padding: 5 }} />}
                        nextControlIcon={<IconArrowRight style={{ width: 36, height: 36, padding: 5 }} />}
                        withIndicators withKeyboardEvents height={600}>
                        {photos.map(photo => (
                            <Carousel.Slide key={photo}>
                                <Image className="object-contain h-full w-full" src={`${serverBase}/uploads/` + photo} />
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                )}
            </Modal>
        </motion.div>
    );
}

export default Gallery;