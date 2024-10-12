import axios from "axios";

// Base URL
const BASE_URL = "https://ecommerce-shopping-server.onrender.com" ;

// Fetch categories
export const fetchCategories = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

// Fetch data from API
export const fetchDataFromApi = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

// Edit categories
export const editCategories = async (url, updateData) => {
  const { res } = await axios.put(`${BASE_URL}${url}`, updateData);
  return res;
};

// Delete categories
export const deleteCategories = async (url) => {
  const { res } = await axios.delete(`${BASE_URL}${url}`);
  return res;
};

// Post data
export const postData = async (url, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, formData);
    return response;
  } catch (error) {
    console.error("API call error:", error);
    return error.response;
  }
};

// Post product
export const postProduct = async (url, formData) => {
  const { res } = await axios.post(`${BASE_URL}${url}`, formData);
  return res;
};

// Delete product
export const deleteProduct = async (url) => {
  const { res } = await axios.delete(`${BASE_URL}${url}`);
  return res;
};

// Get product by ID
export const getProductById = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

// Update product
export const updateProduct = async (url, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return error;
  }
};

// Update order status
export const updateOrderStatus = async (url, status) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, status);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get product reviews
export const getProductReviews = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

// Get all product reviews
export const getAllProductReviews = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

// Fetch user data
export const fetchUserData = async (url) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
};

// Update user profile
export const updateUserProfile = async (url, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    return false;
  }
};

// Change user password
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/user/${userId}/password`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing user password:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

// Delete user
export const deleteUser = async (url) => {
  const { res } = await axios.delete(`${BASE_URL}${url}`);
  return res;
};

// Calculate total sales
export const calculateTotalSales = (orders) => {
  if (!Array.isArray(orders)) {
    console.error("Expected 'orders' to be an array but received:", typeof orders);
    return 0;
  }

  const shippedAndDeliveredOrders = orders.filter(
    (order) => order.orderStatus === "shipped" || order.orderStatus === "delivered"
  );

  return shippedAndDeliveredOrders.reduce((total, order) => total + order.totalAmount, 0);
};

// Remove item from my list
export const removeMyListItem = async (url) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return error;
  }
};

// Update notification status
export const updateNotificationStatus = async (url, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}${url}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (url) => {
  const response = await axios.delete(`${BASE_URL}${url}`);
  return response;
};
