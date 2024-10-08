import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineCancel } from "react-icons/md";

import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { RxDividerVertical } from "react-icons/rx";
import { FaRegImages } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

const CategoryAdd = () => {
  const [categoryVal, setCategoryVal] = useState("");
  const context = useContext(MyContext);
  const [error_, setError] = useState(false);
  const [formdata, setFormData] = useState(new FormData());
  const [files, setFiles] = useState([]);
  const [imgFiles, setImgFiles] = useState();
  const [previews, setPreviews] = useState([]);
  const [formfield, setFormFields] = useState({
    name: "",
    subCat: '',
    images: [],
    color: "",
  });
  const history = useNavigate();
  const [loading, setLoading] = useState(false);

  const postFile = async (url, formData) => {
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

      setFormFields((prevFormField) => ({
        ...prevFormField,
        images: imgArr,
      }));
      const response = await postFile(apiEndPoint, formdata);
      if (response && response.status === 200) {
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
    let tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imgFiles, files.length]);

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    const newFormdata = new FormData();
    newFiles.forEach((file) => newFormdata.append("images", file));
    setFormData(newFormdata);
    setFormFields((prevFormField) => ({
      ...prevFormField,
      images: newFiles,
    }));
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    formdata.append("name", formfield.name);
    formdata.append("color", formfield.color);
    if (formfield.images.length > 0) {
      formfield.images.forEach((image, index) => {
        formdata.append(`images`, image);
      });
    }
    if (
      formfield.name !== "" &&
      formfield.images.length !== 0 &&
      formfield.color !== ""
    ) {
      setLoading(true);
      try {
        // console.log(formfield); // Log the response to inspect its structure
         await postData("/api/categories/create", formfield)

        // setLoading(false);

        // setSnackbarSeverity("success");
        // setSnackbarOpen(true);

        toast.success("Category added successfully!");
        history("/category-list");
      } catch (error) {
        setLoading(false);
        toast.error("Error adding category. Please try again.");
      }
    } else {
      context.handleClickVariant("success");
      setError(true);
    }
  };

  const changeInput = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changeCategory = (e) => {
    setCategoryVal(e.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      color: e.target.value,
    }));
  };

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow mt-100">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Add Category</h3>
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
                <a className="mc-breadcrumb-link" href="/category-list">
                  Category
                </a>
              </li>
              <div className="icon">
                <RxDividerVertical />
              </div>
              <li className="mc-breadcrumb-item">Add Category</li>
            </ul>
          </div>
        </div>
        <form onSubmit={addCategory}>
          <div className="row">
            <div className="col-xl-7">
              <div className="mc-card">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">Basic Information</h4>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    {error_ && (
                      <p className="text-danger">Please fill all the fields</p>
                    )}
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="name"
                        onChange={changeInput}
                      />
                    </div>
                  </div>

                  <div className="col-xl-12">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Color</label>
                      <Select
                        labelId="category"
                        id="demo-simple-select-helper"
                        value={categoryVal}
                        className="w-100 select"
                        onChange={changeCategory}
                        name="color"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Red">Red</MenuItem>
                        <MenuItem value="Blue">Blue</MenuItem>
                        <MenuItem value="Green">Green</MenuItem>
                      </Select>
                    </div>
                  </div>
                  <div className="mc-card mt-4">
                    <div className="mc-card-header">
                      <h4 className="mc-card-title">Category Images</h4>
                    </div>
                    <div className="row">
                      <div className="imgUploadBox d-flex align-ite ms-center">
                        {previews?.length !== 0 &&
                          previews?.map((img, index) => {
                            return (
                              <div className="uploadBox" key={index}>
                                <img src={img} className="w-100" alt={`preview-${index}`} />
                                <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={() => removeImage(index)}
                                >
                                  <MdOutlineCancel/>
                                </button>
                              </div>
                            );
                          })}

                        <div className="uploadBox">
                          <input
                            type="file"
                            onChange={(e) =>
                              onChangeFile(
                                e,
                                "https://ecommerce-shopping-server.onrender.com/api/categories/upload"
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
                </div>
              </div>
            </div>
            <div className="col-xl-12 mt-3">
              <div className="mc-card">
                <div className="mc-card-footer">
                  <Button
                    variant="contained"
                    className="float-right"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default CategoryAdd;
