import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <SlArrowLeft /> : <SlArrowRight />}
      </button>
      <ul className="menu">
        <li>
          <FaHome/>
          {isOpen && <span><Link to="/home" className="link">Home</Link></span>}
        </li>
        <li>
          <FaUser/>
          {isOpen && <span><Link to="/profile" className="link">Profile</Link></span>}
        </li>
        <li>
          <FaCog/>
          {isOpen && <span>Settings</span>}
        </li>
        <li>
          <FaSignOutAlt/>
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
