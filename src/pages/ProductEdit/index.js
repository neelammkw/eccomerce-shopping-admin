import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import {
  MenuItem,
  Rating,
  Select,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { RxDividerVertical } from "react-icons/rx";
import { fetchCategories, getProductById, updateProduct } from "../../utils/api";
import { FaRegImages } from "react-icons/fa";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [categoryVal, setCategoryVal] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCatVal, setSubCategoryVal] = useState("");
  const [isfeatured, setIsfeatured] = useState(false);
  const [rating, setRatingValue] = useState(1);
  const [ setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ setFiles] = useState([]);
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
    isfeatured: false,
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
  const [ setFormData] = useState(new FormData());

  const postData = async (url, formData) => {
    try {
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error uploading files.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      const formdata = new FormData();
      setImgFiles(files);
      const imgArr = Array.from(files);
      setFiles(imgArr);
      setFormData(formdata);

      imgArr.forEach((file) => formdata.append("images", file));

      setFormField((prevFormField) => ({
        ...prevFormField,
        images: imgArr,
      }));

      const response = await postData(apiEndPoint, formdata);
      if (response?.status === 200) {
        console.log("Files uploaded successfully", response.data);
      } else {
        console.error("File upload failed", response);
      }
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };

  useEffect(() => {
    if (!imgFiles) return;
    const tmp = Array.from(imgFiles).map((file) => URL.createObjectURL(file));
    setPreviews(tmp);

    return () => {
      tmp.forEach((url) => URL.revokeObjectURL(url));
    };
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
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(`/api/products/${id}`);
        setFormField(data);
        setCategoryVal(data.category);
        setIsfeatured(data.isfeatured);
        setRatingValue(data.rating);
        setImageUrls(data.images);

        if (data.category) {
          const subCategoriesData = await fetchCategories(`/api/subcategories/`);
          const filteredSubcategories = subCategoriesData.filter(
            (subcategory) => subcategory.category.name === data.category
          );
          setSubCategories(filteredSubcategories);
          setSubCategoryVal(data.subCat);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setFormField({
      name: "",
      images: [],
      description: "",
      subCat: "",
      colors: "",
      brand: "",
      price: "",
      discountPrice: "",
      category: "",
      isfeatured: false,
      countInStock: "",
      rating: 0,
      numReviews: "",
      reviews: "",
      sizes: "",
      weight: "",
    });

    setImages([]);
    setImageUrls([]);
    setFiles([]);
    setImgFiles(null);
    setPreviews([]);
  }, [id, setImages, setFiles]);

  const handleChangeSubCat = (event) => {
    const { value } = event.target;
    setSubCategoryVal(value);
    setFormField((prevFormField) => ({
      ...prevFormField,
      subCat: value,
    }));
  };

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

  const handleChangeFeatured = (event) => {
    setIsfeatured(event.target.value);
    setFormField((prevFormField) => ({
      ...prevFormField,
      isfeatured: event.target.value,
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
    if (!formField.subCat) return "Sub Category is required.";
    if (!formField.brand) return "Brand is required.";
    if (!formField.price) return "Price is required.";
    if (!formField.discountPrice) return "Discount Price is required.";
    if (!formField.rating) return "Rating is required.";
    if (formField.isfeatured === undefined) return "Featured status is required.";
    if (!formField.reviews) return "Reviews are required.";
    if (!formField.sizes) return "Sizes are required.";
    if (!formField.colors) return "Colors are required.";
    if (!formField.weight) return "Weight is required.";
    if (!formField.countInStock) return "Count in stock is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSnackbarMessage(validationError);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      console.log(formField);
      await updateProduct(`/api/products/${id}`, formField);
      setSnackbarMessage("Product updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      setSnackbarMessage("Error updating product.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                <a className="mc-breadcrumb-link" href="/product-view">
                  Products
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
                        value={subCatVal}
                        className="w-100 select"
                        onChange={handleChangeSubCat}
                      >
                        {subCategories &&
                          subCategories.map((item) => (
                            <MenuItem value={item.subcat}>
                              {item.subcat}
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
                        <MenuItem value="Lyra">Brand1</MenuItem>
                        <MenuItem value="Amazon">Brand2</MenuItem>
                        <MenuItem value="Gucci">Brand3</MenuItem>{" "}
                        <MenuItem value="Raymond">Brand3</MenuItem>
                        <MenuItem value="Titan">Brand3</MenuItem>
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
                  <h4 className="mc-card-title">Featured</h4>
                </div>
                <div className="row">
                  <div className="col-xl-12">
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
                </div>
              </div>
              <div className="mc-card mt-4">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Product Images</h4>
                </div>
                <div className="row">
                <p>* Re- Upload Images and Upload Product *</p>
                  <div className="imgUploadBOx d-flex align-ite   ms-center">
                    {imageUrls?.length !== 0 &&
                      imageUrls.map((image, index) => {
                        return (
                          <div className="uploadBox" key={index}>
                            <img
                              src={`${context.baseUrl}uploads/${image}`}
                              className="w-100" alt="img"
                            />
                          </div>
                        );
                      })}

                    {previews?.length !== 0 &&
                      previews.map((image, index) => {
                        return (
                          <div className="uploadBox" key={index}>
                            <img src={`${image}`} className="w-100" alt="img"/>
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
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ProductEdit;
