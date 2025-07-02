import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

export const UserContext = createContext({});

function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [city, setCity] = useState(null);
    const [ready, setReady] = useState(false);

    let info = null;

    const getUserLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                info = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                axios.post('/getcity', { info }).then(res => {
                    setCity(res.data)
                });
            })
        }
    }

    useEffect(() => {

        if (!Cookies.get('city')) {
            getUserLocation()
        }

        if (Cookies.get('city')) {
            setCity(Cookies.get('city'))
        }

    }, [])

    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(response => {
                setUser(response.data);
                setReady(true);
            });
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, city, setCity, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider