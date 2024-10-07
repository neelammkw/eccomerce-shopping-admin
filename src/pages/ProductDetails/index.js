import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import Button from "@mui/material/Button";
import { TbBrandShopee } from "react-icons/tb";
import { BiSolidCategory } from "react-icons/bi";
import { IoColorPalette, IoArrowUndo } from "react-icons/io5";
import { MdSummarize, MdVerified } from "react-icons/md";
import { IoMdPricetags, IoMdStar } from "react-icons/io";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { getProductById, getProductReviews } from "../../utils/api";
import { MyContext } from "../../App";
import { MdCategory } from "react-icons/md";
import { FaWeight } from "react-icons/fa";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const productSliderBig = useRef();
  const productSliderSml = useRef();
  const context = useContext(MyContext);

  useEffect(() => {
    // Fetch product data by ID
    const fetchProduct = async () => {
      try {
        const data = await getProductById(`/api/products/${id}`);
        setProduct(data);
        const reviewsData = await getProductReviews(`/api/review/${id}`);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const productSliderOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const productSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToSlide = (index) => {
    productSliderBig.current.slickGoTo(index);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="right-content w-100">
        <div className="card mt-40 shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Product View</h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/">
                  Home
                </a>
              </li>
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/product-upload">
                  Products
                </a>
              </li>
              <li className="mc-breadcrumb-item">Product View</li>
            </ul>
          </div>
        </div>

        <div className="card p-lg-4">
          <div className="row">
            <div className="col-xl-5">
              <h6 className="mc-divide-title mb-4">Product Gallery</h6>
              <div className="mc-product-view-gallery p-3">
                <Slider
                  {...productSliderOptions}
                  ref={productSliderBig}
                  className="sliderbig"
                >
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${context.baseUrl}uploads/${image}`}
                      alt={`product-${index}`}
                    />
                  ))}
                </Slider>
                <Slider
                  {...productSliderSmlOptions}
                  ref={productSliderSml}
                  className="slidersml"
                >
                  {product.images.map((image, index) => (
                    <div
                      className="item"
                      key={index}
                      onClick={() => goToSlide(index)}
                    >
                      <img
                        src={`${context.baseUrl}uploads/${image}`}
                        alt={`product-${index}`}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            <div className="col-xl-6">
              <h6 className="mc-divide-title mb-4">Product Details</h6>
              <div className="mc-product-view-info-group">
                <h2 className="mc-product-view-info-title">{product.name}</h2>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <TbBrandShopee />
                  </span>
                  <h5>Brand</h5>
                  <span>:</span>
                  <p>{product.brand}</p>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <BiSolidCategory />
                  </span>
                  <h5>Category</h5>
                  <span>:</span>
                  <p>{product.category}</p>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <MdCategory />
                  </span>
                  <h5>Sub Category</h5>
                  <span>:</span>
                  <ul className="list list-inline tags sml">
                    {product.subCat &&
                      product.subCat.split(/[, ]+/).map((tag, index) => (
                        <li key={index} className="list-inline-item">
                          {product.subCat}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <IoColorPalette />
                  </span>
                  <h5>Color</h5>
                  <span>:</span>
                  <ul className="list list-inline tags sml">
                    {product.colors &&
                      product.colors.split(/[, ]+/).map((color, index) => (
                        <li key={index} className="list-inline-item">
                          {color}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <MdSummarize />
                  </span>
                  <h5>Size</h5>
                  <span>:</span>
                  <ul className="list list-inline tags sml">
                    {product.sizes &&
                      product.sizes.split(/[, ]+/).map((size, index) => (
                        <li key={index} className="list-inline-item">
                          {size}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <FaWeight />
                  </span>
                  <h5>Weight</h5>
                  <span>:</span>
                  <ul className="list list-inline sml">
                    {product.weight &&
                      product.weight.split(",").map((size, index) => (
                        <li key={index} className="list-inline-item tags">
                          {product.weight}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <IoMdPricetags />
                  </span>
                  <h5>Price</h5>
                  <span>:</span>
                  <p>
                    ${product.discountPrice} &nbsp;{" "}
                    {product.discountPrice && <del>${product.price}</del>}
                  </p>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <HiMiniShoppingCart />
                  </span>
                  <h5>Stock</h5>
                  <span>:</span>
                  <p>({product.countInStock}) pieces</p>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <IoMdStar />
                  </span>
                  <h5>Review</h5>
                  <span>:</span>
                  <p>({product.numReviews}) reviews</p>
                </div>
                <div className="mc-product-view-meta">
                  <span className="icon">
                    <MdVerified />
                  </span>
                  <h5>Published</h5>
                  <span>:</span>
                  <p>{new Date(product.dateCreated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="col-xl-12">
              <h6 className="mc-divide-title mt-5 mb-4">Product Description</h6>
              <div className="mc-product-view-description">
                <p>{product.description}</p>
              </div>
            </div>
            <div className="productReviews mt-4 w-90 col-xl-10">
              <Typography variant="h6">Customer Reviews</Typography>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="review">
                    <div className="review-header">
                      <Typography variant="subtitle1" className="reviewer-name">
                        {review.CustomerName}
                      </Typography>

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
                    <Typography variant="body2" className="review-text">
                      {review.review}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" className="no-reviews">
                  No reviews yet.
                </Typography>
              )}
            </div>

            <div className="col-xl-12 mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.history.back()}
              >
                <IoArrowUndo /> Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
