import axios from "axios";
import { useState } from "react";
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconQuestionMark } from "@tabler/icons-react";

function PhotosUploader({ addedPics, setAddedPics }) {

    const [picLink, setPicLink] = useState('');
    const [hover, setHover] = useState(false);
    // const [pics, setPics] = useState([])
    const serverBase = import.meta.env.VITE_SERVER_BASE_URL

    function handleMouseEnter(ev) {
        setHover(true);
    }

    function handleMouseLeave(ev) {
        setHover(false);
    }

    async function addPicByLink(ev) {
        ev.preventDefault();
        if (picLink.length == 0) {
            notifications.show({
                title: "Link not provided",
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
        const { data: filename } = await axios.post('upload-by-link', { link: picLink });
        onChange(prev => {
            return [...prev, filename];
        });
        setPicLink('');
    }

    async function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();

        // const filesArray = Array.from(files)
        // const pics = await convertAll(filesArray)

        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/photos', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            setAddedPics(prev => {
                return [...prev, ...filenames];
            });
        })
    }

    function removePhoto(ev, filename) {
        ev.preventDefault();
        setAddedPics([...addedPics.filter(photo => photo != filename)])
    }

    function selectHero(ev, filename) {
        ev.preventDefault();
        const addedPicsNonHero = addedPics.filter(photo => photo != filename);
        const newHero = [filename, ...addedPicsNonHero];
        setAddedPics(newHero);
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    async function convertAll(files) {
        const base64Array = await Promise.all(
            files.map(file => convertToBase64(file))
        );
        return base64Array.map(base64 => ({ file: base64 }))
    }

    return (
        <div >
            <h2 className="text-xl mt-4">Photos</h2>
            <div className="flex gap-3 border-0 border-purple-700 items-center">
                <input className="border" type="text" value={picLink} onChange={ev => setPicLink(ev.target.value)} placeholder={'Paste image link here'} id="service-image-link" />
                <motion.button
                    whileTap={{
                        scale: 0.96
                    }}
                    onClick={addPicByLink}
                    className="border border-gray-300 shadow-sm shadow-gray-100 px-3 h-12 rounded-[0.5em] hover:shadow-gray-200">Add&nbsp;Photo</motion.button>
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2">
                {addedPics.length > 0 && addedPics.map((link, index) => (
                    <div className="h-28 sm:h-40 md:h-40 lg:h-40 xl:h-40 w-auto relative flex border-0 border-red-600 rounded-md" key={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                        <img className="rounded-2xl w-full object-cover" src={`${serverBase}/uploads/` + link} alt="" />
                        {hover && (
                            <>
                                <button onClick={ev => removePhoto(ev, link)} className="absolute top-2 right-1.5 text-white bg-black bg-opacity-50 rounded-full py-1 px-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <button onClick={ev => selectHero(ev, link)} className="absolute top-2 left-1.5 text-white bg-black bg-opacity-50 rounded-full py-1 px-1">
                                    {link == addedPics[0] && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {link != addedPics[0] && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                ))}

                <motion.label
                    whileTap={{
                        scale: 0.97
                    }}
                    className="bg-zinc-300 bg-opacity-0 h-28 sm:h-40 md:h-40 lg:h-40 xl:h-40 w-auto flex justify-center items-center gap-2 border border-gray-300 shadow-sm shadow-gray-100 rounded-2xl p-8 text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl hover:bg-opacity-[0.04] text-stone-900mt-1 cursor-pointer">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </motion.label>
            </div>
        </div>
    );
}

export default PhotosUploader