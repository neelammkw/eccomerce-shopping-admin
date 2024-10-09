import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaPencilAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { MdWidgets, MdVerifiedUser, MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchDataFromApi, deleteProduct, fetchCategories } from "../../utils/api";
import { MyContext } from "../../App";

const ProductList = () => {
  const context = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [showBy, setShowBy] = useState(10);
  const [showByCat, setShowByCat] = useState("");
  const [showBrand, setShowBrand] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    context.setProgress(40);
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/products").then((res) => {
      context.setProgress(100);
      setProducts(res);
      setTotalProducts(res.length); // Dynamically setting total products
      const uniqueBrands = [...new Set(res.map(item => item.brand))]; // Fetching unique brands
      setBrands(uniqueBrands);
    });

    fetchCategories("/api/categories").then((res) => {
      setCategories(res);
      setTotalCategories(res.length); // Dynamically setting total categories
    });
  }, [context]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const deleteproduct = (id) => {
    context.setProgress(40);
    deleteProduct(`/api/products/${id}`)
      .then(() => {
        context.setProgress(100);
        setSnackbarMessage("Product deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchDataFromApi("/api/products").then((res) => {
          setProducts(res);
        });
      })
      .catch(() => {
        context.setProgress(100);
        setSnackbarMessage("Error deleting product");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Search and Filter Logic
  const filteredProducts = products.filter((product) => {
    return (
      (!showByCat || product.category === showByCat) &&
      (!showBrand || product.brand === showBrand) &&
      (!showSearch || product.name.toLowerCase().includes(showSearch.toLowerCase()))
    );
  });

  const indexOfLastProduct = currentPage * showBy;
  const indexOfFirstProduct = indexOfLastProduct - showBy;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <div className="right-content w-100 bottomEle">
        {/* Dynamic Dashboard Counts */}
        <div className="row dashboardBoxWrapperRow">
          <div className="col-lg-4 col-sm-6">
            <div className="mc-float-card lg blue">
              <h3>{totalProducts}</h3>
              <p>Total Products</p>
              <i className="material-icons blue">
                <FaShoppingBag />
              </i>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="mc-float-card lg green">
              <h3>{totalCategories}</h3>
              <p>Total Categories</p>
              <i className="material-icons green">
                <MdWidgets />
              </i>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="mc-float-card lg red">
              <h3>{brands.length}</h3>
              <p>Total Brands</p>
              <i className="material-icons red">
                <MdVerifiedUser />
              </i>
            </div>
          </div>
        </div>

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
                    <MenuItem key={index} value={cat.name}>{cat.name}</MenuItem>
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
                    <MenuItem key={index} value={brand}>{brand}</MenuItem>
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

          {/* Product Table */}
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
                {currentProducts.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex productBox align-items-center">
                        <div className="imgWrapper">
                          <img
                            src={`${context.baseUrl}uploads/${item.images[0]}`}
                            alt="shop"
                            className="w-100"
                          />
                        </div>
                        <div className="info">
                          <h6>
                            {item.name.length > 25
                              ? `${item.name.substring(0, 25)}...`
                              : item.name}
                          </h6>
                          <p>
                            {item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>{item.price}</td>
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
                              onClick={() => deleteproduct(item.id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="paginationWrapper">
            <Pagination
              count={Math.ceil(filteredProducts.length / showBy)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              className="mt-3"
            />
          </div>
        </div>
      </div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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

export default ProductList;
