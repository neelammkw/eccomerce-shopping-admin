import * as React from "react";
import { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { MdOutlineCancel } from "react-icons/md";
import MuiAlert from "@mui/material/Alert";
import { RxDividerVertical } from "react-icons/rx";
import { fetchCategories, postProduct } from "../../utils/api";
import { FaRegImages } from "react-icons/fa";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductUpload = () => {
  const [categoryVal, setCategoryVal] = useState("");
  // Just keep the set function without the
  const [, setSubCategoryVal] = useState(""); // Corrected initialization

  const [isfeatured, setIsFeatured] = useState(false);
  const [rating, setRatingValue] = useState(1);
  const [setImages] = useState([]);
  const [setImageUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [imgFiles, setImgFiles] = useState();
  const [previews, setPreviews] = useState([]);
  const [formField, setFormField] = useState({
    name: "",
    images: [],
    description: "",
    subCat: "",
    colors: "",
    brand: "",
    price: "",
    discountPrice: "",
    category: "",
    isFeatured: false,
    countInStock: "",
    rating: 0,
    numReviews: "",
    reviews: "",
    sizes: "",
    weight: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [setFormData] = useState(new FormData());

  const postData = async (url, formData) => {
    try {
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      const formdata = new FormData();
      setImgFiles(e.target.files);
      const imgArr = [];
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        imgArr.push(file);
        formdata.append(`images`, file);
      }
      setImgFiles(files);
      setFiles(imgArr);
      setFormData(formdata);

      setFormField((prevFormField) => ({
        ...prevFormField,
        images: imgArr,
      }));
      const response = await postData(apiEndPoint, formdata);
      if (response && response.status === 200) {
        console.log("Files uploaded successfully", response.data);
      } else {
        console.error("File upload failed", response);
      }
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };
  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    const newFormdata = new FormData();
    newFiles.forEach((file) => newFormdata.append("images", file));
    setFormData(newFormdata);
    setFormField((prevFormField) => ({
      ...prevFormField,
      images: newFiles,
    }));
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };
  useEffect(() => {
    if (!imgFiles) return;
    let tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);

    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgFiles]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCategory = async (event) => {
    const { value } = event.target;
    setCategoryVal(value);
    setFormField((prevFormField) => ({
      ...prevFormField,
      category: value,
    }));

    try {
      const data = await fetchCategories(`/api/subcategories/`);
      const filteredSubcategories = data.filter(
        (subcategory) => subcategory.category.name === value
      );
      setSubCategories(filteredSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleChangeBrand = (event) => {
    setFormField((prevFormField) => ({
      ...prevFormField,
      brand: event.target.value,
    }));
  };

  const handleChangeSubCat = (event) => {
  const { value } = event.target;
  setSubCategoryVal(value); // Now this will work
  setFormField((prevFormField) => ({
    ...prevFormField,
    subCat: value,
  }));
};


  const handleChangeFeatured = (event) => {
    setIsFeatured(event.target.value);
    setFormField((prevFormField) => ({
      ...prevFormField,
      isFeatured: event.target.value,
    }));
  };

  const inputChange = (e) => {
    setFormField((prevFormField) => ({
      ...prevFormField,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formField.name) return "Product Name is required.";
    if (!formField.description) return "Description is required.";
    if (!formField.category) return "Category is required.";
    if (!formField.brand) return "Brand is required.";
    if (!formField.price) return "Price is required.";
    if (!formField.subCat) return "Sub Category is required.";
    if (!formField.discountPrice) return "Discount Price is required.";
    if (!formField.rating) return "Rating is required.";
    if (formField.isFeatured === undefined)
      return "Featured status is required.";
    if (!formField.reviews) return "Reviews are required.";
    if (!formField.sizes) return "Sizes are required.";
    if (!formField.colors) return "Colors are required.";
    if (!formField.weight) return "Weight is required.";
    if (!formField.countInStock) return "Count In Stock is required.";
    if (!formField.numReviews) return "Number of Reviews is required.";
    if (formField.images.length === 0) return "At least one image is required.";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setSnackbarMessage(validationMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formField.images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("name", formField.name);
    formData.append("description", formField.description);
    formData.append("category", formField.category);
    formData.append("subCat", formField.subCat);
    formData.append("brand", formField.brand);
    formData.append("colors", formField.colors);
    formData.append("sizes", formField.sizes);
    formData.append("numReviews", formField.numReviews);
    formData.append("weight", formField.weight);
    formData.append("price", formField.price);
    formData.append("discountPrice", formField.discountPrice);
    formData.append("rating", formField.rating);
    formData.append("reviews", formField.reviews);
    formData.append("countInStock", formField.countInStock);
    formData.append("isFeatured", formField.isFeatured);

    try {
      await postProduct("/api/products/create", formField);

      setSnackbarMessage("Product Uploaded!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoading(false);

      setFormField({
        name: "",
        images: [],
        description: "",
        colors: "",
        brand: "",
        subCat: "",
        price: "",
        discountPrice: "",
        category: "",
        isFeatured: false,
        countInStock: "",
        rating: 0,
        numReviews: "",
        reviews: "",
        sizes: "",
        weight: "",
      });
      setImages([]);
      setImageUrls([]);
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <>
      <div className="right-content w-100 bottomEle ">
        <div className="card shadow mt-100">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Product Upload</h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/">
                  Home
                </a>
              </li>
              <div className="icon">
                <RxDividerVertical />
              </div>
              <li className="mc-breadcrumb-item">
                <a className="mc-breadcrumb-link" href="/product-list">
                  Products List
                </a>
              </li>
              <div className="icon">
                <RxDividerVertical />
              </div>
              <li className="mc-breadcrumb-item">Product Upload</li>
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="mc-card">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Basic Information</h4>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Product Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="name"
                        value={formField.name}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Description
                      </label>
                      <textarea
                        className="mc-label-field-textarea mb-4 w-100 h-text-md"
                        placeholder="Type here..."
                        name="description"
                        value={formField.description}
                        onChange={inputChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title" id="category">
                        Category
                      </label>
                      <Select
                        labelId="category"
                        id="demo-simple-select-helper"
                        value={categoryVal}
                        className="w-100 select"
                        name="category"
                        onChange={handleChangeCategory}
                      >
                        {categories.map((category, index) => {
                          return (
                            <MenuItem value={category.name}>
                              {category.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title" id="subCat">
                        Sub Category
                      </label>
                      <Select
                        labelId="subCat"
                        id="demo-simple-select-helper"
                        value={formField.subCat}
                        className="w-100 select"
                        onChange={handleChangeSubCat}
                      >
                        {subCategories.map((subCat) => (
                          <MenuItem key={subCat._id} value={subCat.subcat}>
                            {subCat.subcat}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Colors</label>
                      <input
                        type="text"
                        placeholder="Type here (comma separated)"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="colors"
                        value={formField.colors}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title" id="brand">
                        Brand
                      </label>
                      <Select
                        labelId="brand"
                        id="demo-simple-select-helper"
                        value={formField.brand}
                        className="w-100 select"
                        onChange={handleChangeBrand}
                      >
                        {/* Replace with your brand options */}
                        <MenuItem value="Lyra">Lyra</MenuItem>
                        <MenuItem value="Amazon">Amazon</MenuItem>
                        <MenuItem value="Gucci">Gucci</MenuItem>{" "}
                        <MenuItem value="Raymond">Raymond</MenuItem>
                        <MenuItem value="Titan">Titan</MenuItem>
                      </Select>
                    </div>
                  </div>

                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Sizes</label>
                      <input
                        type="text"
                        placeholder="Type here (comma separated)"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="sizes"
                        value={formField.sizes}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Is Featured
                      </label>
                      <Select
                        labelId="isfeatured"
                        id="demo-simple-select-helper"
                        value={isfeatured}
                        className="w-100 select"
                        onChange={handleChangeFeatured}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Reviews</label>
                      <textarea
                        className="mc-label-field-textarea mb-4 w-100 h-text-md"
                        placeholder="Type here..."
                        name="reviews"
                        value={formField.reviews}
                        onChange={inputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mc-card mt-4">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Product Price</h4>
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Price</label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="price"
                        value={formField.price}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Discount Price
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="discountPrice"
                        value={formField.discountPrice}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mc-card mt-4">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Stock Information</h4>
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Count In Stock
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="countInStock"
                        value={formField.countInStock}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Weight</label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="weight"
                        value={formField.weight}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Rating</label>
                      <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRatingValue(newValue);
                          setFormField((prevFormField) => ({
                            ...prevFormField,
                            rating: newValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Number of Reviews
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="numReviews"
                        value={formField.numReviews}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mc-card mt-4">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Product Images</h4>
                </div>
                <div className="row">
                  <div className="imgUploadBOx d-flex align-ite   ms-center">
                    {previews?.length !== 0 &&
                      previews?.map((img, index) => {
                        return (
                          <div className="uploadBox" key={index}>
                            <img
                              src={img}
                              className="w-100"
                              alt={`preview-${index}`}
                            />
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => removeImage(index)}
                            >
                              <MdOutlineCancel />
                            </button>
                          </div>
                        );
                      })}

                    <div className="uploadBox">
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          onChangeFile(
                            e,
                            "https://ecommerce-shopping-server.onrender.com/api/products/upload"
                          )
                        }
                        name="images"
                      />
                      <div className="info">
                        <FaRegImages />
                        <h5>Image Upload </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mc-card mt-4">
                <div className="row">
                  <div className="col-xl-12">
                    <button
                      type="submit"
                      className="mc-btn w-100 primary h-md radius-md mb-4"
                      onClick={handleSubmit}
                      disabled={loading} // Disable button when loading
                    >
                      {loading ? (
                        <CircularProgress color="inherit" className="loader" />
                      ) : (
                        "Upload Product"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
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

export default ProductUpload;
