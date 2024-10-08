import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchDataFromApi, updateOrderStatus } from "../../utils/api";
import { MyContext } from "../../App";
import { BsThreeDots } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";
import { FaMinus } from "react-icons/fa";
import { OrdersContext } from "../../App"; 

const Orders = () => {
  const context = useContext(MyContext);
  const { orders, setOrders, orderStats, updateOrderStats,user, setUser } = useContext(OrdersContext); 
  const [currentPage, setCurrentPage] = useState(1);
  const [showBy, setShowBy] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState(""); // To hold search query
  const [filterStatus, setFilterStatus] = useState(""); // To hold selected status
  const [searchDate, setSearchDate] = useState(""); // To hold date filter

  useEffect(() => {
    context.setProgress(40);
    fetchDataFromApi("/api/order").then((res) => {
      context.setProgress(100);
      setOrders(res);
      updateOrderStats(res);  
    });
  }, []);

  // Handle status change for an order
  const handleStatusChange = async (orderId, status) => {
    context.setProgress(40);
    const userId = context.user.userId;
    try {
      await updateOrderStatus(`/api/order/${orderId}/status`, { status, userId });
      context.setProgress(100);
      setSnackbarMessage("Order status updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh orders
      const res = await fetchDataFromApi("/api/order");
      setOrders(res);
      updateOrderStats(res);  
    } catch (error) {
      context.setProgress(100);
      setSnackbarMessage("Error updating order status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Calculate order statistics
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.orderStatus === "shipped"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "cancelled"
  ).length;

  // Calculate total sales from shipped and delivered orders
  const calculateTotalSales = () => {
    const shippedAndDeliveredOrders = orders.filter(
      (order) => order.orderStatus === "shipped" || order.orderStatus === "delivered"
    );
    return shippedAndDeliveredOrders.reduce((total, order) => total + order.totalAmount, 0);
  };

  // Format Date Function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // Returns the date in 'YYYY-MM-DD' format
  };

  // Handle search filtering
  const filteredOrders = orders.filter((order) => {
    const isSearchMatch =
      order._id.includes(searchQuery) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const isStatusMatch =
      filterStatus === "" || order.orderStatus === filterStatus;

    const isDateMatch =
      searchDate === "" || formatDate(order.date) === searchDate;

    return isSearchMatch && isStatusMatch && isDateMatch;
  });

  // Calculate the orders to display based on pagination
  const indexOfLastOrder = currentPage * showBy;
  const indexOfFirstOrder = indexOfLastOrder - showBy;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Function to generate and print invoice
const printInvoice = (order) => {
  const itemsList = order.items
    .map(
      (item, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td>
          <div class="mc-table-product sm">
            <p>${item.productName || 'Product Name'}</p>
          </div>
        </td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const invoiceContent = `
    <div class="col-xl-12">
      <div class="mc-card p-md-5">
        <div class="mc-invoice-head">
          <img src="images/logo.webp" alt="logo">
          <h2>Invoice #${order.orderId}</h2>
        </div>
        <div class="mc-invoice-group">
          <div class="mc-invoice-recieved">
            <h6>Order Received</h6>
            <p>${order.address.streetAddressLine1}, ${order.address.streetAddressLine2}, ${order.address.city}, ${order.address.state}, ${order.address.country}. ${order.phoneNumber}, ${order.email}</p>
          </div>
          <div class="mc-invoice-shipment">
            <h6>Shipment Details</h6>
            <p>${order.address.streetAddressLine1}, ${order.address.streetAddressLine2}, ${order.address.city}, ${order.address.state}, ${order.address.country}. ${order.phoneNumber}, ${order.email}</p>
          </div>
        </div>
        <div class="mc-table-responsive">
          <table class="mc-table">
            <thead class="mc-table-head">
              <tr>
                <th>UID</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody class="mc-table-body">
              ${itemsList}
            </tbody>
          </table>
        </div>
        <div class="mc-invoice-list-group">
          <ul class="mc-invoice-list">
            <li><span class="title">Subtotal</span><span class="clone">:</span><span class="digit">Rs. ${order.totalAmount}</span></li>
            <li><span class="title">Shipping</span><span class="clone">:</span><span class="digit">Rs. 0</span></li>
            <li><span class="title">Total</span><span class="clone">:</span><span class="digit total">Rs. ${order.totalAmount + 0}</span></li>
            <li><span class="title">Status</span><span class="clone">:</span><span class="status purple">${order.paymentStatus}</span></li>
          </ul>
        </div>
        <p class="mc-invoice-note">Thank you for ordering with us. We offer a 7-day return policy on all products. If you have any complaint about this order, please call or email us. (VAT has been calculated as per applicable laws). This is a system-generated invoice, and no signature or seal is required.</p>
        <div class="mc-invoice-btns">
          <a class="btn btn-dark" href="#" onclick="window.print()">
            <i class="material-icons">print</i><span>Print this receipt</span>
          </a>
          <a class="btn btn-success" href="#">
            <i class="material-icons">download</i><span>Download as PDF</span>
          </a>
        </div>
      </div>
    </div>
  `;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(
    `<html><head><title>Invoice</title>
<style>
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f6fa;
  }
  body.dark {
    background-color: #071739;

  }
  .mc-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .mc-invoice-head {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .mc-invoice-head img {
    max-width: 120px;
    margin-bottom: 10px;
  }
  
  .mc-invoice-head h2 {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  .mc-invoice-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .mc-invoice-recieved,
  .mc-invoice-shipment {
    width: 48%;
  }
  
  .mc-invoice-recieved h6,
  .mc-invoice-shipment h6 {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  
  .mc-invoice-recieved p,
  .mc-invoice-shipment p {
    font-size: 14px;
    line-height: 1.6;
    color: #555;
  }
  
  .mc-table-responsive {
    overflow-x: auto;
    margin-bottom: 20px;
  }
  
  .mc-table {
    width: 100%;
    border-collapse: collapse;
  }
  body.dark .table{
    background-color: #f7f7f7;
  }
  .mc-table th,
  .mc-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .mc-table th {
    background-color: #f7f7f7;
    font-weight: bold;
    font-size: 14px;
  }
  
  .mc-table td {
    font-size: 14px;
  }
  
  .mc-table-product.sm {
    display: flex;
    align-items: center;
  }
  
  .mc-table-product img {
    max-width: 40px;
    margin-right: 10px;
  }
  
  .mc-invoice-list-group {
    margin-bottom: 20px;
  }
  
  .mc-invoice-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .mc-invoice-list li {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .mc-invoice-list li .title {
    font-weight: bold;
  }
  
  .mc-invoice-list li .digit {
    font-weight: bold;
  }
  
  .mc-invoice-list li .digit.total {
    color: #27ae60;
  }
  
  .mc-invoice-note {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .mc-invoice-btns {
    display: flex;
    justify-content: space-between;
  }
  
  .mc-invoice-btns .btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    text-decoration: none;
    color: #fff;
    border-radius: 5px;
  }
  
  .mc-invoice-btns .btn-dark {
    background-color: #333;
  }
  
  .mc-invoice-btns .btn-success {
    background-color: #27ae60;
  }
  
  .mc-invoice-btns .btn i {
    margin-right: 5px;
    font-size: 18px;
  }
  
  /* Media Queries */
  @media (max-width: 768px) {
    .mc-invoice-group {
      flex-direction: row;
    }
    .mc-invoice-recieved,
    .mc-invoice-shipment {
      width: 100%;
      margin-bottom: 15px;
    }
    .mc-invoice-btns {
      flex-direction: column;
    }
    .mc-invoice-btns .btn {
      margin-bottom: 10px;
    }
  }
  
</style>
</head><body>${invoiceContent}</body></html>`
  );
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Order List</h3>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="row dashboardBoxWrapperRow">
          <div className="col-xl-3">
            <div className="mc-float-card lg purple">
              <h3>{pendingOrders}</h3>
              <p>Pending Orders</p>
              <BsThreeDots className="material-icons"/>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="mc-float-card lg blue">
              <h3>{shippedOrders}</h3>
              <p>Shipped Orders</p>
              <FaTruck className="material-icons"/>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="mc-float-card lg green">
              <h3>{deliveredOrders}</h3>
              <p>Delivered Orders</p>
              <IoBagCheckSharp className="material-icons"/>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="mc-float-card lg red">
              <h3>{cancelledOrders}</h3>
              <p>Cancelled Orders</p>
              <FaMinus className="material-icons" />
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="row">
          <div className="col">
            <div className="mc-label-field-group label-col">
              <label className="mc-label-field-title">Total Sales</label>
              <p className="mc-label-field-text">Rs. {calculateTotalSales()}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Box */}
        <div className="row row-cols-sm-4 row-cols-1">
          <div className="col">
            <div className="mc-label-field-group label-col">
              <label className="mc-label-field-title">Show by</label>
              <select
                className="mc-label-field-select mb-4 w-100 h-md"
                value={showBy}
                onChange={(e) => setShowBy(parseInt(e.target.value))}
              >
                <option value="10">10 rows</option>
                <option value="20">20 rows</option>
                <option value="30">30 rows</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="mc-label-field-group label-col">
              <label className="mc-label-field-title">Status by</label>
              <select
                className="mc-label-field-select mb-4 w-100 h-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="mc-label-field-group label-col">
              <label className="mc-label-field-title">Issued by</label>
              <input
                type="date"
                placeholder="Select Date"
                className="mc-label-field-input mb-4 w-100 h-md"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col">
            <div className="mc-label-field-group label-col">
              <label className="mc-label-field-title">Search</label>
              <input
                type="text"
                placeholder="Search by Order ID, User or Email"
                className="mc-label-field-input mb-4 w-100 h-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="row">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.name}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>{order.paymentStatus}</td>
                    <td>
                      <FormControl>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </td>
                    <td>
                      {new Date(order.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    <td>
                      <Link to={`/order-details/${order._id}`}>
                        <Button color="secondary">View Details</Button>
                      </Link>
                    </td>
                    <td>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => printInvoice(order)}
                      >
                        Generate Invoice
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
              count={Math.ceil(filteredOrders.length / showBy)}
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

export default Orders;
