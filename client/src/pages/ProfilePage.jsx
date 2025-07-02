
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";

import axios from "axios";

function ProfilePage() {

    const { user, ready } = useContext(UserContext);
    const [IP, setIP] = useState();
    const [cords, setCords] = useState({ lattitude: '', longitude: '' });
    const [location, setLocation] = useState(null);
    const [pready, setPReady] = useState(false);
    const APIkey = 'eeba75a85de0407ea62917eca750df62'
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    function success(pos) {
        var crd = pos.coords
        console.log(pos)
        setCords(crd.latitude, crd.longitude)
        console.log("Target current position: ")
        console.log(`Latitude: ${crd.latitude}`)
        console.log(`Longitude: ${crd.longitude}`)
        console.log(`More or less ${crd.accuracy} meters`)

        getLocationInfo(crd.latitude, crd.longitude);
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    function getLocationInfo(latitude, longitude) {
        const uRL = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`
        fetch(uRL)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status.code == 200) {
                    setLocation(data.results[0].components)
                    setPReady(true)
                } else {
                    console.log("Reverse Geocoding request failed")
                }
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                setIP(data.ip);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIp();
    }, []);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    
                    if (result.state == "granted") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state == "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state == "denied") {

                    }
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, [])

    if (!ready) {
        return;
    }

    if (ready && !user) {
        return <Navigate to={'/login'} />
    }

    if (!pready) {
        return;
    }


    return (
        <div className="flex flex-col items-center">
            <div className="text-lg mt-4">
                Logged in as<span className="text-primary cursor-pointer">&nbsp;{user.name}</span>&nbsp;( {user.email} )
            </div>
            <div className="text-lg mt-4">
                IP Address : {IP}
            </div>
            <div className="text-lg mt-4">
                Location : {location.neighbourhood}, {location.city} - {location.postcode}, {location.state_district} District, {location.state}
            </div>
        </div>

    );
}

export default ProfilePage;