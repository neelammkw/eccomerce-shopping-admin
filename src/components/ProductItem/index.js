import React, { useState, useEffect, useContext, useRef } from "react";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MyContext } from "../../App";
import { postData, removeMyListItem } from "../../utils/api";
import "./ProductItem.css";
import { toast } from "react-toastify";

const ProductItem = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const sliderRef = useRef();
  const { user, myList, setMyList } = useContext(MyContext);
  const [isInList, setIsInList] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const context = useContext(MyContext);

  const viewProductDetails = (product) => {
    context.setProductForModal(product);
    context.setOpen(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPlay();
      }
    }, 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPause();
      }
    }, 20);
  };

  const calculateDiscountPercentage = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice || originalPrice <= discountPrice) {
      return 0;
    }
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const discountPercentage = calculateDiscountPercentage(
    props.product?.price,
    props.product?.discountPrice
  );
  const handleAddToMyList = async () => {
    if (!user) {
      toast.error("Please log in to add products to My List.");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const myListData = {
        productId: props.product?._id,
        productName: props.product?.name,
        image: props.product?.images[0],
        rating: props.product?.rating,
        discountPrice: props.product?.discountPrice,
        userId: user.userId,
      };

      if (isInList) {
        // Remove from wishlist
        await removeMyListItem(
          `/api/my-list/product/${user.userId}/${props.product?._id}`
        );
        setIsInList(false);
        toast.success("Item removed from list.");

        // Update context and localStorage
        const updatedList = myList.filter(
          (item) => item.productId !== props.product?._id
        );
        setMyList(updatedList);
        localStorage.setItem("myList", JSON.stringify(updatedList));
      } else {
        // Add to wishlist
        const response = await postData("/api/my-list/add", myListData);
        if (response.status === 201) {
          setIsInList(true);
          toast.success("Product added to My List!");

          // Update context and localStorage
          const updatedList = [...myList, myListData];
          setMyList(updatedList);
          localStorage.setItem("myList", JSON.stringify(updatedList));
        } else {
          toast.error(
            response.data.message || "Failed to add product to My List."
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update My List.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkIfInList = () => {
    if (!user || !props.product?._id) return;

    // Check if the product is in the list using context
    let myList = JSON.parse(localStorage.getItem("myList")) || [];

    const productInList = myList.some(
      (item) => item.productId === props.product._id
    );

    if (productInList) {
      setIsInList(productInList);
    }
  };

  useEffect(() => {
    checkIfInList();
  }, [user, props.product, myList]);

  return (
    <div
      className={`item productItem ${props.itemView}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="details">
        <div className="imgWrapper">
          <Link to={`/product/${props.product?._id}`}>
            {isHovered && props.product?.images.length > 1 ? (
              <Slider {...settings} ref={sliderRef} className="slider">
                {props.product?.images.map((image, index) => (
                  <div className="slick-slide" key={index}>
                    <img
                      src={`https://ecommerce-shopping-server.onrender.com/uploads/${image}`}
                      className="sliderImage"
                      alt={`img-${index}`}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={`https://ecommerce-shopping-server.onrender.com/uploads/${props.product?.images[0]}`}
                className="sliderImage"
                alt="img"
              />
            )}
          </Link>
        </div>
        {discountPercentage > 0 && (
          <span className="badge badge-primary">{discountPercentage}%</span>
        )}
        <div className="actions">
          <Button onClick={() => viewProductDetails(props.product)}>
            <TfiFullscreen />
          </Button>
          <Button
            onClick={handleAddToMyList}
            disabled={isProcessing}
            className={isInList ? "heart-added" : "heart"}
          >
            {isInList ? <IoMdHeart color="red" /> : <IoMdHeartEmpty />}
          </Button>
        </div>
        <div className="info mt-3">
          <Link to={`/product/${props.product?._id}`}>
            <h4>
              {props.product?.name?.length > 22
                ? props.product?.name?.substr(0, 22) + "..."
                : props.product?.name}
            </h4>
          </Link>
          <div className="text-success stock mr-2">
            Stock: &nbsp;{props.product?.countInStock}&nbsp;&nbsp;
            <Rating
              name="size-small"
              className="ratings"
              value={props.product?.rating}
              readOnly
              size="small"
            />
          </div>
          <div className="d-flex price">
            <span className="oldPrice">Rs {props.product?.price} </span>
            <span className="netPrice text-danger mt-1">
              &nbsp;&nbsp;Rs {props.product?.discountPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
