import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
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
