import { useContext, useEffect, useState } from "react";
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function CastAndCrew({ screw, setScrew }) {

    const [opened, { open, close }] = useDisclosure(false);
    const [crew, setCrew] = useState('');
    const [role, setRole] = useState('');

    const [editMode, setEditMode] = useState(false);

    const [upcrew, setupCrew] = useState('');
    const [uprole, setupRole] = useState('');


    function addCrew(ev) {
        ev.preventDefault();
        setScrew(prev => [...prev, { crew, role }]);
        setCrew('')
        setRole('')
    }

    function handleCrew(ev, each) {
        ev.preventDefault();
        setupCrew(each.crew)
        setupRole(each.role)
        setCrew(each.crew)
        setRole(each.role)

        setEditMode(true)

    }

    function updateCrew(ev, { crew, role }, upcrew, uprole) {
        ev.preventDefault();

        setScrew(screw.map(star => {
            if (star.crew === crew && star.role === role) {
                return { crew: upcrew, role: uprole };
            }
            return star;
        }));

        setCrew('')
        setRole('')
        setupCrew('')
        setupRole('')
        setEditMode(false)

    }

    function removeCrew(ev, { crew, role }) {
        ev.preventDefault();
        setScrew(screw.filter(star => !(star.crew === crew && star.role === role)));

        setCrew('')
        setRole('')
        setupCrew('')
        setupRole('')
        setEditMode(false)

    }

    return (
        <div>
            <Modal opened={opened} onClose={() => {
                close()
                setCrew('')
                setRole('')
                setupCrew('')
                setupRole('')

                setEditMode(false)

            }} title="Add Cast and Crew" centered>
                {editMode == true && (
                    <form onSubmit={ev => { updateCrew(ev, { crew, role }), close() }}>
                        <h2 className="">Name</h2>
                        <input type="text" value={upcrew} onChange={ev => setupCrew(ev.target.value)} placeholder="Name of Cast or Crew" />
                        <h2 className="mt-1">Role</h2>
                        <input type="text" value={uprole} onChange={ev => setupRole(ev.target.value)} placeholder="Enter their Role" />

                        <div className="flex gap-5 mx-1">
                            <button onClick={ev => {
                                updateCrew(ev, { crew, role }, upcrew, uprole)
                                close()
                            }} className="primary">Update</button>

                            <button onClick={ev => {
                                removeCrew(ev, { crew, role })
                                close()
                            }} className="secondary">Delete</button>
                        </div>

                    </form>
                )}
                {editMode == false && (
                    <form onSubmit={addCrew}>
                        <h2 className="">Name</h2>
                        <input type="text" value={crew} onChange={ev => setCrew(ev.target.value)} placeholder="Name of Cast or Crew" id="service-name" />
                        <h2 className="mt-1">Role</h2>
                        <input type="text" value={role} onChange={ev => setRole(ev.target.value)} placeholder="Enter their Role" id="service-name" />

                        <button onClick={() => {
                            close()
                        }} className="primary">Add Crew</button>
                    </form>
                )}

            </Modal>

            <div className="mt-5">
                <h2 className="text-xl mb-4">Cast And Crew</h2>
                <div className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-8 gap-5 ml-4 justify-center">

                    {screw.length > 0 && screw.map((each, index) => (


                        <div key={index} className="">

                            <div onClick={ev => {
                                handleCrew(ev, each)
                                open()
                            }} className="flex relative flex-col items-center">

                                <div className="border hover:cursor-pointer relative flex justify-center items-center h-24 w-24 rounded-full overflow-hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-18 text-zinc-300 mt-7">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <h1 className="text-[1.05em] font-medium mt-2 text-center">{each.crew}</h1>
                                <h2>{each.role}</h2>
                            </div>

                        </div>

                    ))}

                    <label onClick={open} className=" hover:bg-zinc-50 cursor-pointer flex border p-4 rounded-full h-24 w-24 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default CastAndCrew;