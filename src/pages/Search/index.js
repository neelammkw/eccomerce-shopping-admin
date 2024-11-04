import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import { Button } from "@mui/material";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBy] = useState(5); // Show 5 products per page
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const context = useContext(MyContext); // Assuming baseUrl and delete function are in context

  useEffect(() => {
    const fetchSearchResults = async () => {
      const queryParams = new URLSearchParams(location.search);
      const query = queryParams.get("q");

      if (query) {
        try {
          const response = await fetchDataFromApi(
            `/api/search?q=${encodeURIComponent(query)}`
          );
          console.log(response);
          setProducts(response);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
      setLoading(false);
    };

    fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filter products for pagination
  const startIndex = (currentPage - 1) * showBy;
  const currentProducts = products.slice(startIndex, startIndex + showBy);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="right-content w-100 bottomEle ">
      <div className="card shadow mt-100">
        <div>
          <h2>Search Results</h2>
          {products.length > 0 ? (
            <>
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
                      <td>${item.price}</td>
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
                            onClick={() => context.deleteProduct(item.id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="paginationWrapper">
                <Pagination
                  count={Math.ceil(products.length / showBy)}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  className="mt-3"
                />
              </div>
            </>
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
