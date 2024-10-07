import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  deleteProduct,
  fetchCategories,
} from "../../utils/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountCircle,
  MdShoppingCart,
  MdHotelClass,
  MdMoreVert,
  MdHistory,
} from "react-icons/md";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const [orders, setOrders] = useState([]); // Correctly set orders
  const [currentPage, setCurrentPage] = useState(1);
  const [showBy, setShowBy] = useState(10);
  const [showByCat, setShowByCat] = useState("");
  const [showBrand, setShowBrand] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Consolidated fetch for both orders and dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDataFromApi("/api/data");
        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  const fetchAndCalculateSales = async () => {
    try {
      const ordersResponse = await fetchDataFromApi("/api/order");

      if (ordersResponse && Array.isArray(ordersResponse)) {
        setOrders(ordersResponse); // Setting the orders to state
        const totalSales = calculateTotalSales(ordersResponse); // Passing the fetched orders to the function
      } else {
        console.error("Invalid order data:", ordersResponse);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Updated calculateTotalSales function
  const calculateTotalSales = (orders) => {
    const shippedAndDeliveredOrders = orders.filter(
      (order) =>
        order.orderStatus === "shipped" || order.orderStatus === "delivered"
    );

    return shippedAndDeliveredOrders.reduce(
      (total, order) => total + (order.totalAmount || 0), // Handle cases where totalAmount is missing or undefined
      0
    );
  };

  // Use the function
  useEffect(() => {
    fetchAndCalculateSales();
  }, []);

  useEffect(() => {
    context.setProgress(40);
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/products").then((res) => {
      context.setProgress(100);
      setProductList(res);
      setProducts(res);
      const uniqueBrands = [...new Set(res.map((item) => item.brand))]; // Fetching unique brands
      setBrands(uniqueBrands);
    });
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await fetchCategories("/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  const deleteProductHandler = (id) => {
    context.setProgress(40);
    deleteProduct(`/api/products/${id}`)
      .then((res) => {
        context.setProgress(100);
        setSnackbarMessage("Product deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchDataFromApi("/api/products").then((res) => {
          setProductList(res.data);
        });
      })
      .catch((error) => {
        context.setProgress(100);
        setSnackbarMessage("Error deleting product");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const totalUsers = dashboardData.users || 0;
  const totalProducts = dashboardData.products || 0;
  const totalOrders = dashboardData.orders || 0;
  const totalReviews = dashboardData.reviews || 0;
  const totalSales = calculateTotalSales(orders);

  const filteredProducts = productList.filter(
    (product) =>
      (showSearch
        ? [
            product.name,
            product.category,
            product.brand,
            product.id.toString(),
          ].some((field) =>
            field.toLowerCase().includes(showSearch.toLowerCase())
          )
        : true) &&
      (showByCat ? product.category === showByCat : true) &&
      (showBrand ? product.brand === showBrand : true)
  );
  const handlePageChange = (event, value) => {
    context.setProgress(10);
    setCurrentPage(value);
    context.setProgress(100);
  };

  const indexOfLastProduct = currentPage * showBy;
  const indexOfFirstProduct = indexOfLastProduct - showBy;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const monthlySalesData = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 2000 },
    { month: "Mar", sales: 1800 },
    { month: "Apr", sales: 2780 },
    { month: "May", sales: 3890 },
    { month: "Jun", sales: 4300 },
    { month: "Jul", sales: 3500 },
    { month: "Aug", sales: 4400 },
    { month: "Sep", sales: 5000 },
    { month: "Oct", sales: 4000 },
    { month: "Nov", sales: 6000 },
    { month: "Dec", sales: 7000 },
  ];

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Dashboard</h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/">
                  Home
                </a>
              </li>
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/product-list">
                  Products
                </a>
              </li>
              <li className="mc-breadcrumb-item">Products</li>
            </ul>
          </div>
        </div>

        <div className="row dashboardBoxWrapperRow">
          <div className="dashboardBoxWrapper d-flex justify-content-between">
            <div className="col-xl-8 col-12">
              <div className="row row-cols-sm-2 row-cols-1">
                {/* First card (Total Users) */}
                <div className="col">
                  <div className="dashboard-card green">
                    <MdTrendingUp className="dashboard-card-trend" />
                    <div className="dashboard-card-head">
                      <h4 className="dashboard-card-meta">
                        <span>Total Users</span>
                        {totalUsers}
                      </h4>
                      <MdAccountCircle className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-foot">
                      <div className="dashboard-card-compare">
                        <mark>+ 95%</mark>
                        <span>last month</span>
                      </div>
                      <div className="dashboard-dropdown">
                        <button
                          type="button"
                          className="dashboard-dropdown-toggle btn btn-primary"
                        >
                          <MdMoreVert />
                        </button>
                        <div className="dashboard-dropdown-paper dropdown-menu dropdown-menu-end">
                          <button className="dashboard-dropdown-menu">
                            <MdHistory />
                            <span>Last Day</span>
                          </button>
                          <button className="dashboard-dropdown-menu">
                            <MdHistory />
                            <span>Last Week</span>
                          </button>
                          <button className="dashboard-dropdown-menu">
                            <MdHistory />
                            <span>Last Month</span>
                          </button>
                          <button className="dashboard-dropdown-menu">
                            <MdHistory />
                            <span>Last Year</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Card (Total Orders) */}
                <div className="col">
                  <div className="dashboard-card purple">
                    <MdTrendingDown className="dashboard-card-trend" />
                    <div className="dashboard-card-head">
                      <h4 className="dashboard-card-meta">
                        <span>Total Orders</span>
                        {totalOrders}
                      </h4>
                      <MdShoppingCart className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-foot">
                      <div className="dashboard-card-compare">
                        <mark>+ 30%</mark>
                        <span>last month</span>
                      </div>
                      <div className="dashboard-dropdown">
                        <button
                          type="button"
                          className="dashboard-dropdown-toggle btn btn-primary"
                        >
                          <MdMoreVert />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Card (Total Products) */}
                <div className="col">
                  <div className="dashboard-card blue">
                    <MdTrendingDown className="dashboard-card-trend" />
                    <div className="dashboard-card-head">
                      <h4 className="dashboard-card-meta">
                        <span>Total Products</span>
                        {totalProducts}
                      </h4>
                      <MdShoppingBag className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-foot">
                      <div className="dashboard-card-compare">
                        <mark>+ 25%</mark>
                        <span>last month</span>
                      </div>
                      <div className="dashboard-dropdown">
                        <button
                          type="button"
                          className="dashboard-dropdown-toggle btn btn-primary"
                        >
                          <MdMoreVert />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fourth Card (Total Reviews) */}
                <div className="col">
                  <div className="dashboard-card yellow">
                    <MdTrendingUp className="dashboard-card-trend" />
                    <div className="dashboard-card-head">
                      <h4 className="dashboard-card-meta">
                        <span>Total Reviews</span>
                        {totalReviews}
                      </h4>
                      <MdHotelClass className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-foot">
                      <div className="dashboard-card-compare">
                        <mark>+ 45%</mark>
                        <span>last month</span>
                      </div>
                      <div className="dashboard-dropdown">
                        <button
                          type="button"
                          className="dashboard-dropdown-toggle btn btn-primary"
                        >
                          <MdMoreVert />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side: Total Sales */}
            <div className="col-xl-4 col-12 ">
              <div className="mc-sales-card">
                <div className="mc-sales-card-group">
                  <div className="mc-card-header">
                    <h4 className="mc-card-title">Total Sales</h4>

                    <div className="mc-sales-card-amount trending_up green">
                      <h3>Rs.&nbsp;{totalSales}</h3>
                      <p>40.63%</p>
                    </div>
                  </div>
                  <p className="mc-sales-card-compare">
                    Rs.&nbsp;{totalSales} in last month
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySalesData}>
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3">
          <h3 className="hd">Best Selling Products</h3>

          <div className="card shadow border-0 p-3">
            <h3 className="hd">Best Selling Products</h3>
            <div className="row cardFilters mt-3">
              <div className="col-md-3">
                <h4>SHOW BY</h4>
                <FormControl size="small" className="w-100">
                  <Select
                    value={showBy}
                    onChange={(e) => setShowBy(e.target.value)}
                    displayEmpty
                    className="w-100"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3">
                <h4>CATEGORY BY</h4>
                <FormControl size="small" className="w-100">
                  <Select
                    value={showByCat}
                    onChange={(e) => setShowByCat(e.target.value)}
                    displayEmpty
                    className="w-100"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map((cat, index) => (
                      <MenuItem key={index} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3">
                <h4>BRAND BY</h4>
                <FormControl size="small" className="w-100">
                  <Select
                    value={showBrand}
                    onChange={(e) => setShowBrand(e.target.value)}
                    displayEmpty
                    className="w-100"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {brands.map((brand, index) => (
                      <MenuItem key={index} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-3">
                <h4>SEARCH BY NAME</h4>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Product"
                  value={showSearch}
                  onChange={(e) => setShowSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>Products</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>RATING</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex productBox align-items-center">
                          <div className="imgWrapper">
                            <div className="img">
                              <img
                                src={`${context.baseUrl}uploads/${item.images[0]}`}
                                alt="shop"
                                className="w-100"
                              />
                            </div>
                          </div>
                          <div className="info">
                            <h6>
                              {item?.name
                                ? item.name.length > 25
                                  ? `${item.name.substring(0, 25)}...`
                                  : item.name
                                : "N/A"}
                            </h6>

                            <p>
                              {item?.description
                                ? item.description.length > 50
                                  ? `${item.description.substring(0, 50)}...`
                                  : item.description
                                : "No description available"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>{item.brand}</td>
                      <td>
                        <del className="old">${item.price}</del>
                        <span className="new text-danger">
                          ${item.discountPrice}
                        </span>
                      </td>
                      <td>{item.countInStock}</td>
                      <td>
                        <Rating
                          name="read-only"
                          defaultValue={item.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                      </td>
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Link to={`/product-details/${item.id}`}>
                            <Button color="secondary" className="secondary">
                              <FaEye />
                            </Button>
                          </Link>
                          <Link to={`/product-edit/${item.id}`}>
                            <Button color="success" className="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>
                          <Button
                            color="error"
                            className="error"
                            onClick={() => deleteProductHandler(item.id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="d-flex tableFooter">
              <p>
                Showing <b>{currentProducts.length}</b> of{" "}
                <b>{filteredProducts.length}</b> results
              </p>
              <Pagination
                count={Math.ceil(filteredProducts.length / showBy)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
