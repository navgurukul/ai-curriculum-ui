import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { assets } from "../../assets/assets";
import { Logout } from "../../utils/Logout";
import "./Navbar.css";
// import { Tooltip } from 'react-tooltip'

const Navbar = () => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const auth = JSON.parse(localStorage.getItem("AUTH"));
  const profilePicture = auth?.profile_picture || assets.Student;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="nav">
      <div className="text-wrapper" >
        <h3 className="curriculum-text">
          Curriculum <span>AI</span>{" "}
        </h3>
      </div>
      <div className="nav-options">
        <Link to="/mcq" style={{ textDecoration: "none" }}>
          <span className={location.pathname === "/mcq" ? "active" : ""}>
            MCQs
          </span>
        </Link>
        <Link to="/project" style={{ textDecoration: "none" }}>
          <span className={location.pathname === "/project" ? "active" : ""}>
            Projects
          </span>
        </Link>
        {/* <Link to={"/main"} style={{textDecoration:"none"}}><span>G-ni</span></Link> */}
        {/* <Link to={"/experi"} style={{ textDecoration: "none" }}>
          <span>Experi</span>
        </Link>  */}
      </div>
      <div className="profile-section">
        <img
          src={profilePicture}
          alt="Student"
          onClick={toggleDropdown}
          className="profile-picture"
        />
        {dropdownVisible && (
          <div className="dropdown-menu">
            <span onClick={Logout}>Logout</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
