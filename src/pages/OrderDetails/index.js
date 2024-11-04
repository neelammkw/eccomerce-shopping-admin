import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const data = await fetchDataFromApi(`/api/order/order/${orderId}`);
        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data", error);
        setError("Failed to load order data.");
        setLoading(false);
      }
    };

    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDialogOpen = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!orderData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="right-content w-100">
      <div className="card mt-40 shadow">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Order Details</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <a className="mc-breadcrumb-link" href="/">
                Home
              </a>
            </li>
            <li className="mc-breadcrumb-item">
              <a className="mc-breadcrumb-link" href="/orders">
                Orders
              </a>
            </li>
            <li className="mc-breadcrumb-item">Order View</li>
          </ul>
        </div>
      </div>

      <Grid container spacing={2}>
        {/* Left Side: Order Information */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              Order Details
            </Typography>
            <Divider />

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Order ID:</strong></TableCell>
                    <TableCell>{orderData._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Date:</strong></TableCell>
                    <TableCell>{new Date(orderData.date).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Order Status:</strong></TableCell>
                    <TableCell>{orderData.orderStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Payment Status:</strong></TableCell>
                    <TableCell>{orderData.paymentStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Razorpay Payment ID:</strong></TableCell>
                    <TableCell>{orderData.paymentId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Razorpay Order ID:</strong></TableCell>
                    <TableCell>{orderData.orderId}</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell><strong>Shipping Method:</strong></TableCell>
                    <TableCell>{orderData.shippingMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Payment Method:</strong></TableCell>
                    <TableCell>{orderData.paymentMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Amount:</strong></TableCell>
                    <TableCell>₹{orderData.totalAmount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            
           
          </Paper>
             
        </Grid>

        {/* Right Side: User Information */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              User Information
            </Typography>
            <Divider />

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Name:</strong></TableCell>
                    <TableCell>{orderData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Email:</strong></TableCell>
                    <TableCell>{orderData.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Phone:</strong></TableCell>
                    <TableCell>{orderData.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Address:</strong></TableCell>
                    <TableCell>
                      {`${orderData.address?.streetAddressLine1}, ${orderData.address?.streetAddressLine2}, ${orderData.address?.city}, ${orderData.address?.state}, ${orderData.address?.country}, ${orderData.address?.pincode}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Order Notes:</strong></TableCell>
                    <TableCell>{orderData.orderNotes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={10}>
          <Paper elevation={3} style={{ padding: "20px" }}>

        <Divider style={{ margin: "5px 0" }} />
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>

         <TableContainer component={Paper} style={{ marginTop: "5px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Product Name</strong></TableCell>
                    <TableCell><strong>Quantity</strong></TableCell>
                    <TableCell><strong>Price</strong></TableCell>
                    <TableCell><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
               
         <TableBody>
                  {orderData.items.map((item) => (
                    <TableRow
                      key={item._id}
                      hover
                      onClick={() => handleDialogOpen(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>₹{item.quantity * item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
         </Table>
            </TableContainer>
            </Paper>
        </Grid>
      </Grid>

      {/* Dialog for Product Details */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <div>
              {selectedProduct.image && (
                <img
                  src={`https://ecommerce-shopping-server.onrender.com/uploads/${selectedProduct.image}`}
                  alt={selectedProduct.productName}
                  style={{
                    width: "100%",
                    maxHeight: "240px",
                    objectFit: "contain",
                    marginBottom: "5px",
                  }}
                />
              )}
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Product Name:</strong></TableCell>
                      <TableCell>{selectedProduct.productName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Quantity:</strong></TableCell>
                      <TableCell>{selectedProduct.quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Price:</strong></TableCell>
                      <TableCell>₹{selectedProduct.price}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Subtotal:</strong></TableCell>
                      <TableCell>₹{selectedProduct.quantity * selectedProduct.price}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
