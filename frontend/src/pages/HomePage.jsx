import React, {useEffect} from "react";
import "../styles/HomePage.css";
import axios from "axios";
import {useUser} from "../context/UserContext";
const HomePage = () => {
    const { user, setUser } = useUser();
    const verifyToken = async () => {
        try
        {
            const response = await axios.request({
                method: "GET",
                url: "http://localhost:8000/auth/verify/",
                withCredentials: true,
            })
        }
        catch (error)
        {
            if (error.response && error.response.status === 401) {
                try {
                    await axios.request({
                        method: "POST",
                        url: "http://localhost:8000/auth/refresh/",
                        withCredentials: true,
                    })
                }catch (error) {
                    if (error.response && error.response.status === 401) {
                        setUser({});
                }
            }
            }
        }
    }

    useEffect(() => {
        verifyToken();
    }, [setUser]);
    return (
        <div className="hero">
            <div className="slides">
                <div className="slide">
                    <img src="1.png" alt="Slide 1" />
                </div>
                <div className="slide">
                    <img src="2.png" alt="Slide 2" />
                </div>
                <div className="slide">
                    <img src="3.png" alt="Slide 3" />
                </div>
                <div className="slide">
                    <img src="4.png" alt="Slide 4" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
