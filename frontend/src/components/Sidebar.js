import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from 'react-router-dom';
import "../styles/Sidebar.css";
import {useUser} from "../context/UserContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {user} = useUser()
    console.log("user: " + user.username)

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <SlArrowLeft /> : <SlArrowRight />}
      </button>
      
      {/* Logo Image */}
      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

        <ul className="menu">
            <li>
                {isOpen ? <span><Link to="/" className="link"> <FaHome/> Home</Link></span> : <FaHome/>}
            </li>
            {
                (user.username) ?
                    <>
                        <li>
                            {isOpen ? <span><Link to={`/profile/${user.username}`}
                                                  className="link"> <FaUser/> Profile</Link></span> :
                                <FaUser/>}
                        </li>
                        <li>
                            {isOpen ? <span><Link to="/settings" className="link"> <FaCog/> Settings</Link></span> :
                                <FaCog/>}
                        </li>
                        <li>
                            {isOpen ? <span><Link to="/logout" className="link"> <FaSignOutAlt/> LogOut</Link></span> :
                                <FaSignOutAlt/>}
                        </li>
                    </> :
                    <>
                        <li>
                            {isOpen ? <span><Link to='/login' className="link"> <FaUser/> Login</Link></span> :
                                <FaUser/>}
                        </li>
                        <li>
                            {isOpen ? <span><Link to='/signup' className="link"> <FaUser/> Signup</Link></span> :
                                <FaUser/>}
                        </li>
                    </>
            }
        </ul>
    </div>
  );
};

export default Sidebar;
