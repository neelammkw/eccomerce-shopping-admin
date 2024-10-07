import React, { useState, useEffect } from "react";
import { Typography, Rating, Snackbar, Alert, Pagination } from "@mui/material";
import { RxDividerVertical } from "react-icons/rx";
import profile from "../../assets/images/profile.png"; // Default profile image
import { getAllProductReviews } from "../../utils/api"; // API utility for fetching reviews
import { Link } from "react-router-dom"; // Import Link for navigation

const Messages = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [reviewsPerPage] = useState(10); // Number of reviews per page
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

 useEffect(() => {
  const fetchAllReviews = async () => {
    try {
      const updatedReviews = await getAllProductReviews("/api/review");
      
      if (Array.isArray(updatedReviews)) {
        setReviews(updatedReviews); // Set the reviews if it's an array
      } else {
        throw new Error("Unexpected response format"); // Handle unexpected format
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Failed to fetch reviews.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching reviews:", error.response?.data?.error || error); // Log the actual error
    }
  };

  fetchAllReviews();
}, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow mt-100">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">All Product Reviews</h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/">
                  Home
                </a>
              </li>
              <div className="icon">
                <RxDividerVertical />
              </div>
              <li className="mc-breadcrumb-item">All Product Reviews</li>
            </ul>
          </div>
        </div>
        <div className="productReviews mt-4 w-80">
          <Typography variant="h6" className="reviews-title">
            All Product Reviews
          </Typography>
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="d-flex">
                    <div>
                      <span className="rounded-circle">
                        <div className="userImg">
                          <span className="rounded-circle">
                            <img
                              src={
                                review.CustomerId?.profilePhoto
                                  ? `https://ecommerce-shopping-server.onrender.com/uploads/${review.CustomerId.profilePhoto}`
                                  : profile // Default profile image if user image is not available
                              }
                              alt="avatar"
                              className="avatar"
                            />
                          </span>
                        </div>
                      </span>
                    </div>
                    <Typography variant="subtitle1" className="reviewer-name">
                      &nbsp;&nbsp;{review.CustomerName}
                    </Typography>
                  </div>
                  <div className="review-rating">
                    <Rating
                      name="read-only"
                      value={review.ratings}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </div>
                  <Typography variant="caption" className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <Typography variant="body2">
                  <div className="review-text">{review.review}</div>
                </Typography>
                {review.productId && (
                  <Typography variant="body2" className="product-info">
                    Product:{" "}
                    <Link to={`/product-details/${review.productId._id}`}>
                      {review.productId.name}
                    </Link>{" "}
                    - Rs. {review.productId.discountPrice}
                  </Typography>
                )}
              </div>
            ))
          ) : (
            <Typography variant="body2" className="no-reviews">
              No reviews yet.
            </Typography>
          )}

          {/* Pagination Component */}
          <div className="pagination-container mt-4">
            <Pagination
              count={Math.ceil(reviews.length / reviewsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Messages;
