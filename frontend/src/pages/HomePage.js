import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
    return (
        <div className="hero">
            <div className="slides">
                <div className="slide">
                    <img src="A.jpg" alt="Slide 1" />
                </div>
                <div className="slide">
                    <img src="B.jpg" alt="Slide 2" />
                </div>
                <div className="slide">
                    <img src="C.jpg" alt="Slide 3" />
                </div>
                <div className="slide">
                    <img src="D.jpg" alt="Slide 4" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
