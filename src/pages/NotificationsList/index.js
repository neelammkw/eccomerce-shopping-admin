import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  fetchDataFromApi,
  updateNotificationStatus,
  deleteNotification,
} from "../../utils/api";
import { MyContext } from "../../App";
import { OrdersContext } from "../../App";
import { NotificationsContext } from "../../App";

const NotificationsList = () => {
  const context = useContext(MyContext);
  const { setUnreadNotificationsCount } =
    useContext(NotificationsContext);
  const [notifications, setNotification] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showBy] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch only unread notifications
  useEffect(() => {
    context.setProgress(40);
    fetchDataFromApi("/api/notifications")
      .then((res) => {
        console.log(res);
        context.setProgress(100);
        setNotification(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        setNotification([]);
        context.setProgress(100);
      });
  }, [context]);

  // Handle notification read status change
  const handleMarkAsRead = async (Id) => {
    context.setProgress(40);
    try {
      await updateNotificationStatus(`/api/notifications/${Id}`, {
        status: "read",
      });
      setNotification((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === Id ? { ...notif, status: "read" } : notif
        )
      );
      setUnreadNotificationsCount((prevCount) => prevCount - 1);
      context.setProgress(100);
      setSnackbarMessage("Notification marked as read");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      context.setProgress(100);
      setSnackbarMessage("Error marking notification as read");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle notification deletion
  const handleDeleteNotification = async (Id) => {
    context.setProgress(40);
    try {
      await deleteNotification(`/api/notifications/${Id}`);
      setNotification((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== Id)
      );
      context.setProgress(100);
      setSnackbarMessage("Notification deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      context.setProgress(100);
      setSnackbarMessage("Error deleting notification");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filter and pagination logic for notifications
  const indexOfLastNotification = currentPage * showBy;
  const indexOfFirstNotification = indexOfLastNotification - showBy;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Unread Notifications</h3>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="row">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Profile Photo</th>
                  <th>Phone Number</th>
                  <th>Product</th>

                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentNotifications.map((notification) => (
                  <tr key={notification._id}>
                    <td>{notification.user?.name || "N/A"}</td>
                    <td>
                      {notification.user?.profilePhoto ? (
                        <img
                          src={`https://ecommerce-shopping-server.onrender.com/uploads/${notification.user.profilePhoto}`}
                          alt="Profile"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        "No Photo"
                      )}
                    </td>
                    <td>{notification.user?.phone || "N/A"}</td>
                    <td>
                      {notification?.product?.name
                        ? notification.product.name.length > 25
                          ? `${notification.product.name.substring(0, 25)}...`
                          : notification.product.name
                        : "N/A"}
                    </td>

                    <td>
                      {notification.order?.orderId ? (
                        <Link to={`/order-details/${notification.order._id}`}>
                          {notification.order.orderId}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{notification.order?.paymentId || "N/A"}</td>
                    <td>{notification.order?.totalAmount || "N/A"}</td>
                    <td>
                      {notification.status === "read" ? "Read" : "Unread"}
                    </td>
                    <td>
                      {new Date(notification.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </td>
                    <td>
                      {notification.status === "unread" && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="row">
          <div className="col">
            <Pagination
              count={Math.ceil(notifications.length / showBy)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </div>
        </div>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default NotificationsList;
