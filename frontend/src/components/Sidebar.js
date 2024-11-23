import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from 'react-router-dom';
import "../styles/Sidebar.css";
import { useUser } from "../context/UserContext";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const {user} = useUser();
  return (
    < div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <SlArrowLeft className='arrow-left'/> : <SlArrowRight className='arrow-right'/>}
      </button>
      <ul className="menu">
        <li>
          {isOpen? <span><Link to="/" className="link"> <FaHome/>Home</Link></span> : <FaHome/>}
        </li>
          {
              (user.username !== undefined) ?
                  <>
                      <li>
                          {isOpen ? <span><Link to={`/profile/${user.username}`} className="link"> <FaUser/>Profile</Link></span> :
                              <FaUser/>}
                      </li>
                      <li>
                          {isOpen? <span><Link to="/logout" className="link"> <FaSignOutAlt/>Logout</Link></span> : <FaSignOutAlt/>}
                     </li>
                  </> :
                  <>
                      <li>
                          {isOpen ? <span><Link to='/login' className="link"> <FaUser/>Login</Link></span> : <FaUser/>}
                      </li>
                      <li>
                          {isOpen? <span><Link to='/signup' className="link"> <FaUser/>Signup</Link></span> : <FaUser/>}
                      </li>
                    </>
          }
        <li>
          {isOpen? <span><Link to="/settings" className="link"> <FaCog/>Settings</Link></span> : <FaCog/>}
        </li>
      </ul>
    </div>

  );
};

export default Sidebar;
