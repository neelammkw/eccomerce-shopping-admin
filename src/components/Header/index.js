import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Button from "@mui/material/Button";
import {
  MdMenuOpen,
  MdOutlineMenu,
  MdOutlineLightMode,
} from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../SearchBox";
import { IoCartOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { MyContext } from "../../App";
import { fetchDataFromApi, updateNotificationStatus } from "../../utils/api";
import { OrdersContext } from "../../App";
import { NotificationsContext } from "../../App";

const Header = () => {
  const { orders, setOrders, updateOrderStats } =
    useContext(OrdersContext);
  const {
    notifications,
    setNotifications,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  } = useContext(NotificationsContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNotifEl, setAnchorNotifEl] = useState(null); // For notifications
  const [anchorOrderEl, setAnchorOrderEl] = useState(null); // For orders
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const history = useNavigate();
  const context = useContext(MyContext);

  const open = Boolean(anchorEl);
  const openNotifications = Boolean(anchorNotifEl);
  const openOrder = Boolean(anchorOrderEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpennotifications = (event) => {
    setAnchorNotifEl(event.currentTarget);
  };

  const handleClosenotifications = () => {
    setAnchorNotifEl(null);
  };

  const handleOpenorder = (event) => {
    setAnchorOrderEl(event.currentTarget);
  };

  const handleCloseorder = () => {
    setAnchorOrderEl(null);
  };

  const logout = () => {
    localStorage.clear();
    context.setIsLogin(false);
    context.setUser(null);
    setAnchorEl(null);
    history("/login");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetchDataFromApi(`/api/notifications`);
        const unreadNotifications = res.filter(
          (notification) => notification.status === "unread"
        );
        console.log(unreadNotifications);
        setNotifications(res); // Set all notifications
        setUnreadNotificationsCount(unreadNotifications.length); // Set unread count
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [setNotifications]);

  // Fetch pending orders
  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      try {
        const res = await fetchDataFromApi("/api/order");
        if (JSON.stringify(orders) !== JSON.stringify(res)) {
          // Update only if there's a change
          setOrders(res);
          updateOrderStats(res);

          // Calculate pending orders count
          const pendingorders = res.filter(
            (order) => order.orderStatus === "pending"
          );
          setPendingOrdersCount(pendingorders.length);
          setPendingOrders(pendingorders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    // Polling every 10 seconds
    intervalId = setInterval(fetchOrders, 10000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [orders, updateOrderStats]);

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center">
            <div className="col-2 part1">
              <Link
                to={"/"}
                className="d-flex align-items-center logo logohead"
              >
                <img src={logo} className="logo" alt="fashion" />
              </Link>
            </div>
            <div className="col-8 part2 d-flex align-items-center">
              <Button
                className="rounded-circle mr-3"
                onClick={() =>
                  context.setIsToggleSidebar(!context.isToggleSidebar)
                }
              >
                {context.isToggleSidebar === false ? (
                  <MdMenuOpen />
                ) : (
                  <MdOutlineMenu />
                )}
              </Button>
              <SearchBox />
            </div>
            <div className="col-2 part3 d-flex justify-content-end align-items-center">
              <Button
                className="rounded-circle"
                onClick={() => context.setThemeMode(!context.themeMode)}
              >
                <MdOutlineLightMode />
              </Button>

              {/* Orders Button */}
              <div className="dropdownWraper position-relative">
                <Button
                  className="rounded-circle header-icon"
                  onClick={handleOpenorder}
                >
                  <IoCartOutline />
                  {/* Display the pending orders count */}
                  {pendingOrdersCount > 0 && (
                    <sup className="primary">{pendingOrdersCount}</sup>
                  )}
                </Button>
                <Menu
                  anchorEl={anchorOrderEl}
                  open={openOrder}
                  onClose={handleCloseorder}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* Dropdown Header */}
                  <div className="mc-header-dropdown-group">
                    <div className="mc-card-header">
                      <h4 className="mc-card-title">
                        Orders ({pendingOrdersCount})
                      </h4>
                    </div>
                    <ul className="mc-header-dropdown-list thin-scrolling">
                      {pendingOrders.length > 0 ? (
                        pendingOrders.map((order, index) => (
                          <li key={index} className="mc-header-dropdown-item">
                            <a
                              className="mc-header-dropdown-content"
                              href={`/order-details/${order._id}`}
                            >
                              <div className="mc-header-dropdown-meta">
                                <h4>
                                  <cite>{order.name}</cite>
                                  <time>
                                    {new Date(order.createdAt).toLocaleString()}
                                  </time>
                                </h4>
                                <p>total price - Rs.{order.totalAmount} </p>
                              </div>
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>No pending orders</li>
                      )}
                    </ul>
                    <a
                      className="mc-btn primary mc-header-dropdown-button"
                      href="/orders"
                    >
                      View all orders
                    </a>
                  </div>
                </Menu>
              </div>

              {/* Notifications Button */}
              <div className="dropdownWraper position-relative">
                <Button
                  className="rounded-circle header-icon"
                  onClick={handleOpennotifications}
                >
                  <FaRegBell />
                  {unreadNotificationsCount > 0 && (
                    <sup className="primary">{unreadNotificationsCount}</sup>
                  )}
                </Button>
                <Menu
                  anchorEl={anchorNotifEl}
                  open={openNotifications}
                  onClose={handleClosenotifications}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <div className="mc-header-dropdown-group">
                    <div className="mc-card-header">
                      <h4 className="mc-card-title">
                        Notifications ({unreadNotificationsCount})
                      </h4>
                    </div>

                    <ul className="mc-header-dropdown-list thin-scrolling">
                      {notifications
                        .filter(
                          (notification) => notification.status === "unread"
                        )
                        .map((notification) => (
                          <li
                            key={notification._id}
                            className="mc-header-dropdown-item"
                          >
                            <a
                              href={`/notifications-details/${notification._id}`}
                              className="mc-header-dropdown-content"
                            >
                              <div className="mc-header-dropdown-meta">
                                <h4>{notification.message}</h4>
                                <p>
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </a>
                          </li>
                        ))}
                    </ul>
                    <a
                      className="mc-btn  mc-header-dropdown-button"
                      href="/notifications-list"
                    >
                      View all Notifications
                    </a>
                  </div>
                </Menu>{" "}
              </div>

              {/* User Account Section */}
              {context.isLogin !== true ? (
                <Link to={"/login"}>
                  <Button className="btn-blue btn-lg">Sign In</Button>
                </Link>
              ) : (
                <div className="myAccWrapper d-flex align-items-center">
                  <Button
                    className="myAcc d-flex align-items-center"
                    onClick={handleClick}
                  >
                    <div className="userImg">
                      <span className="rounded-circle">
                        <img
                          src={`https://ecommerce-shopping-server.onrender.com/uploads/${context.user?.profilePhoto}`}
                          alt="avatar"
                        />
                      </span>
                    </div>
                    <div className="userInfo">
                      <h4 className="mb-0">{context.user?.name}</h4>
                      <p className="mb-0">{context.user?.email}</p>
                    </div>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      <Link to="/my-account" className="link underline-none">
                        My Account
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
