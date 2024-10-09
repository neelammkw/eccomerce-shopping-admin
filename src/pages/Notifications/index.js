import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchDataFromApi,
  updateNotificationStatus,
} from "../../utils/api";
import {
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import { NotificationsContext } from "../../App";
import { useCallback } from "react";


const NotificationDetails = () => {
  const { Id } = useParams(); // Fetch the notification ID from the route params
  const [notification, setNotification] = useState(null);
  const { setNotifications, setUnreadNotificationsCount } = useContext(NotificationsContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const markAsRead = useCallback(async () => {
  try {
    await updateNotificationStatus(`/api/notifications/${Id}`, {
      status: "read",
    });

    setNotification((prevNotification) => ({
      ...prevNotification,
      status: "read",
    }));

    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif._id === Id ? { ...notif, status: "read" } : notif
      )
    );

    setUnreadNotificationsCount((prevCount) => prevCount - 1);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}, [Id, updateNotificationStatus, setNotifications, setUnreadNotificationsCount]);
  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const res = await fetchDataFromApi(`/api/notifications/${Id}`);
        console.log(res);
        setNotification(res);

        if (res.status === "unread") {
          markAsRead();
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notification");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [Id, markAsRead]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!notification) {
    return <Typography>No notification details found</Typography>;
  }

  return (
    <div className="right-content w-100 bottomEle">
      <div className="card shadow">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Notifications</h3>
        </div>
      </div>

      {/* Notifications Details */}
      <div className="row">
        <div className="col">
          <Grid container spacing={3} padding={3}>
            {/* User Details */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Details
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={`https://ecommerce-shopping-server.onrender.com/uploads/${notification?.user?.profilePhoto}`} // Adjust path accordingly
                        alt="Profile"
                        sx={{ width: 60, height: 60 }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        {notification?.user?.name || "N/A"}
                      </Typography>
                      <Typography color="textSecondary">
                        {notification?.user?.email || "N/A"}
                      </Typography>
                      <Typography color="textSecondary">
                        {notification?.user?.phone || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Order or Product Details */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  {/* Check if notification is related to an order */}
                  {notification?.order ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Order Details
                      </Typography>
                      <Typography>
                        <strong>Order ID:</strong> {notification?.order?._id || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Order Status:</strong> {notification?.order?.orderStatus || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Total Amount:</strong> {notification?.order?.totalAmount || "N/A"}
                      </Typography>
                    </>
                  ) : null}

                  {/* Check if notification is related to a product (review) */}
                  {notification?.product ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Product Details
                      </Typography>
                      <Typography>
                        <strong>Product Name:</strong>{" "}
                        <Link to={`/product-details/${notification?.product?._id}`}>
                          {notification?.product?.name || "N/A"}
                        </Link>
                      </Typography>
                      <Typography>
                        <strong>Brand:</strong> {notification?.product?.brand || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Number of Reviews:</strong> {notification?.product?.numReviews || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Discount Price:</strong> ₹{notification?.product?.discountPrice || "N/A"}
                      </Typography>
                    </>
                  ) : null}

                  <Typography>
                    <strong>Message:</strong> {notification?.message}
                  </Typography>
                  <Typography>
                    <strong>Date/Time:</strong>{" "}
                    {new Date(notification?.createdAt).toLocaleString()}
                  </Typography>

                  {notification.status === "unread" && (
                    <Button variant="contained" onClick={markAsRead}>
                      Mark as Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
