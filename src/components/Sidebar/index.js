import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { useContext } from "react";
import { FaUsers } from "react-icons/fa6";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null); // Change default to null
  const [submenus, setSubmenus] = useState({});
  const context = useContext(MyContext);
  const history = useNavigate();

  const handleToggleSubmenu = (index) => {
    setActiveTab(index);
    setSubmenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
const logout = () => {
    localStorage.clear();
    context.setIsLogin(false);
    context.setUser(null);
    history("/login");
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <Button
              className={`w-100 ${activeTab === 0 ? "active" : ""}`}
              onClick={() => handleToggleSubmenu(0)}
            >
              <span className="icon">
                <MdDashboard />
              </span>
              Dashboard
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        <li>
          <Button
            className={`w-100 ${
              activeTab === 1 && submenus[1] ? "active" : ""
            }`}
            onClick={() => handleToggleSubmenu(1)}
          >
            <span className="icon">
              <FaProductHunt />
            </span>
            Products
            <span className="arrow">
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${submenus[1] ? "colapse" : "colapsed"}`}
          >
            <ul className="submenu">
              <li>
                <Link to="/product-list">Product List</Link>
              </li>

              <li>
                <Link to="/product-upload">Product Upload</Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <Button
            className={`w-100 ${
              activeTab === 2 && submenus[2] ? "active" : ""
            }`}
            onClick={() => handleToggleSubmenu(2)}
          >
            <span className="icon">
              <FaProductHunt />
            </span>
            Category
            <span className="arrow">
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${submenus[2] ? "colapse" : "colapsed"}`}
          >
            <ul className="submenu">
              <li>
                <Link to="/category-list">Category List</Link>
              </li>

              <li>
                <Link to="/category-add">Add Category</Link>
              </li>
            </ul>
          </div>
        </li>{" "}
        <li>
          <Button
            className={`w-100 ${
              activeTab === 7 && submenus[7] ? "active" : ""
            }`}
            onClick={() => handleToggleSubmenu(7)}
          >
            <span className="icon">
              <FaProductHunt />
            </span>
            Sub Category
            <span className="arrow">
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${submenus[7] ? "colapse" : "colapsed"}`}
          >
            <ul className="submenu">
              <li>
                <Link to="/subcategory-list">Sub Category List</Link>
              </li>

              <li>
                <Link to="/subcategory-add">Add Sub Category</Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <Link to="/orders">
            <Button
              className={`w-100 ${activeTab === 3 ? "active" : ""}`}
              onClick={() => handleToggleSubmenu(3)}
            >
              <span className="icon">
                <FaCartArrowDown />
              </span>
              Orders
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/reviews">
            <Button
              className={`w-100 ${activeTab === 4 ? "active" : ""}`}
              onClick={() => handleToggleSubmenu(4)}
            >
              <span className="icon">
                <MdMessage />
              </span>
              Reviews
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/users">
            <Button
              className={`w-100 ${activeTab === 5 ? "active" : ""}`}
              onClick={() => handleToggleSubmenu(5)}
            >
              <span className="icon">
                <FaUsers />
              </span>
              Users
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/notifications-list">
            <Button
              className={`w-100 ${activeTab === 6 ? "active" : ""}`}
              onClick={() => handleToggleSubmenu(6)}
            >
              <span className="icon">
                <FaBell />
              </span>
              Notifications
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
          </Link>
        </li>
      </ul>
      <br />
      <div className="logoutWrapper">
        <div className="logoutBox">
          <Button variant="contained" onClick={logout}>
            <IoMdLogOut /> Logout{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
