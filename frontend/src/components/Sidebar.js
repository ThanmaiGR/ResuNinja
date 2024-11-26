import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from 'react-router-dom';
import "../styles/Sidebar.css";

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(true);

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
          {isOpen ? <span><Link to="/" className="link"> <FaHome /> Home</Link></span> : <FaHome />}
        </li>
        {
          (props.user.username !== undefined) ?
            <li>
              {isOpen ? <span><Link to={`/profile/${props.user.username}`} className="link"> <FaUser /> Profile</Link></span> : <FaUser />}
            </li> :
            <>
              <li>
                {isOpen ? <span><Link to='/login' className="link"> <FaUser /> Login</Link></span> : <FaUser />}
              </li>
              <li>
                {isOpen ? <span><Link to='/signup' className="link"> <FaUser /> Signup</Link></span> : <FaUser />}
              </li>
            </>
        }
        <li>
          {isOpen ? <span><Link to="/settings" className="link"> <FaCog /> Settings</Link></span> : <FaCog />}
        </li>
        <li>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
