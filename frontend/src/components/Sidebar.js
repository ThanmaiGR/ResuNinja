import React, { useState, useEffect } from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaFileUpload, FaBlackTie  } from "react-icons/fa";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { Link } from 'react-router-dom';
import "../styles/Sidebar.css";
import { useUser } from "../context/UserContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useUser();
  const [colorSchemeFlag, setColorSchemeFlag] = useState(1); 

  useEffect(() => {
    document.documentElement.setAttribute("data-flag", colorSchemeFlag);
  }, [colorSchemeFlag]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleColorScheme = () => {
    setColorSchemeFlag((prevFlag) => {
      const newFlag = prevFlag === 1 ? 0 : 1;
      document.documentElement.setAttribute("data-flag", newFlag); 
      return newFlag;
    });
  };

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
          {isOpen ? (
            <span>
              <Link to="/" className="link"> <FaHome /> Home</Link>
            </span>
          ) : (
            <FaHome />
          )}
        </li>
        {user.username ? (
            <>
                <li>
                    {isOpen ? (
                        <span>
                  <Link to={`/profile/${user.username}`} className="link">
                    <FaUser/> Profile
                  </Link>
                </span>
                    ) : (
                        <FaUser/>
                    )}
                </li>
                <li>
                    {isOpen ? (
                        <span>
                  <Link to="/settings" className="link">
                    <FaCog/> Settings
                  </Link>
                </span>
                    ) : (
                        <FaCog/>
                    )}
                </li>

                <li>
                    {isOpen ? (
                        <span>
              <Link to="/resume" className="link"> <FaFileUpload/> Upload Resume</Link>
            </span>
                    ) : (
                        <FaFileUpload/>
                    )}
                </li>
                <li>
                    {isOpen ? (
                        <span>
                  <Link to="/interview" className="link">
                    <FaBlackTie/> Interview
                  </Link>
                </span>
                    ) : (
                        <FaBlackTie/>
                    )}
                </li>
                <li>
                    {isOpen ? (
                        <span>
                  <Link to="/logout" className="link">
                    <FaSignOutAlt/> LogOut
                  </Link>
                </span>
                    ) : (
                        <FaSignOutAlt/>
                    )}
                </li>
            </>
        ) : (
            <>
                <li>
                    {isOpen ? (
                        <span>
                  <Link to="/login" className="link"> <FaUser/> Login</Link>
                </span>
                    ) : (
                        <FaUser/>
                    )}
                </li>
                <li>
                {isOpen ? (
                <span>
                  <Link to="/signup" className="link"> <FaUser /> Signup</Link>
                </span>
              ) : (
                <FaUser />
              )}
            </li>
          </>
        )}

      </ul>
      {/* Color Scheme Toggle Button */}
      <button className="toggle-color-btn" onClick={toggleColorScheme}>
        {colorSchemeFlag === 1 ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default Sidebar;
