import React, { useEffect, useState, useContext } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdWidgets } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { fetchCategories, editCategories, deleteCategories } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { SnackbarProvider, useSnackbar } from "notistack";
import { MyContext } from "../../App";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Checkbox from "@mui/material/Checkbox";
import { FaRegImages } from "react-icons/fa";
import axios from "axios";


const Category = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
 const [ setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ images: [] });
  const [imgFiles, setImgFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const context = useContext(MyContext);

  const handleViewOpen = (category) => {
    setSelectedCategory(category);
    setOpenViewDialog(true);
  };

  const handleEditOpen = (category) => {
    setSelectedCategory(category);
    setPreviews(category.images.map((img) => `${context.baseUrl}uploads/${img}`));
    setOpenEditDialog(true);
  };

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

  const handleDialogClose = () => {
    setOpenViewDialog(false);
    setOpenEditDialog(false);
    setImgFiles([]);
    setPreviews([]);
    setSelectedCategory({ images: [] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeFile = async (e) => {
    const files = e.target.files;
    const formdata = new FormData();
    setImgFiles(files);
    const imgArr = [];
    for (let i = 0; i < files.length; i++) {
      imgArr.push(files[i]);
      formdata.append("images", files[i]);
    }

    setPreviews(imgArr.map((file) => URL.createObjectURL(file)));

    try {
      const response = await postFile(`${context.baseUrl}api/categories/upload`, formdata);
      if (response && response.status === 200) {
        const uploadedImages = response.data.map((file) => file.filename);
        setSelectedCategory((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        enqueueSnackbar("Files uploaded successfully", { variant: "success" });
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
    for (let i = 0; i < imgFiles.length; i++) {
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }
    setPreviews(tmp);
    return () => {
      tmp.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imgFiles]);

  const handleEditSave = async () => {
    setIsLoading(true);
    try {
      await editCategories(`/api/categories/${selectedCategory._id}`, selectedCategory);
      enqueueSnackbar("Category edited successfully!", { variant: "success" });
      setOpenEditDialog(false);
      fetchCategories("/api/categories").then((res) => {
        setCategories(res);
        // setAllCategories(res);
      });
    } catch (error) {
      enqueueSnackbar("Error editing category. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategories(`/api/categories/${id}`);
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
      fetchCategories("/api/categories").then((res) => {
        setCategories(res);
        setAllCategories(res);
      });
    } catch (error) {
      enqueueSnackbar("Error deleting category. Please try again.", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchCategories("/api/categories").then((res) => {
      context.setProgress(20);
      setCategories(res);
      setAllCategories(res);
      context.setProgress(100);
    });
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    context.setProgress(10);
    setCurrentPage(value);
    context.setProgress(100);
  };
  // const handleSelectChange = (e) => {
  //   const { value } = e.target;
  //   setSelectedCategory((prev) => ({
  //     ...prev,
  //     parentCategory: value,
  //   }));
  // };


  return (
    <SnackbarProvider maxSnack={3}>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Category List</h3>
            <div className="ml-auto d-flex align-items-center">
              <ul className="mc-breadcrumb-list align-items-center">
                <li className="mc-breadcrumb-item">
                  <a className="mc-breadcrumb-link" href="/">
                    Home
                  </a>
                </li>
                <li className="mc-breadcrumb-item">Categories</li>
              </ul>
              <Link to="/category-add">
                <Button className="btn-blue mr-2 w-100">Add Category</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="row dashboardBoxWrapperRow">
          <div className="col-lg-4 col-sm-6">
            <div className="mc-float-card lg blue">
              <h3>{categories.length}</h3>
              <p>Total Categories</p>
              <i className="material-icons blue">
                <MdWidgets />
              </i>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3">
          <h3 className="hd">Category List</h3>
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th style={{ width: '100px' }}>Images</th>
                  <th>Category Name</th>
                  <th>Color</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((category, index) => (
                    <tr key={category._id}>
                      <td>
                        <Checkbox />
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                        <div className="d-flex productBox align-items-center">
                          {category.images.map((image, index) => (
                            <div key={index} className="imgWrapper">
                              <div className="img">
                                <img
                                  src={`${context.baseUrl}uploads/${image}`}
                                  alt={category.name}
                                  className="w-100"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>{category.name}</td>
                      <td>{category.color}</td>
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Button
                            color="secondary"
                            className="secondary"
                            onClick={() => handleViewOpen(category)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            color="success"
                            className="success"
                            onClick={() => handleEditOpen(category)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button
                            color="error"
                            className="error"
                            onClick={() => handleDelete(category._id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="d-flex tableFooter">
              <p>
                showing <b>{itemsPerPage}</b> of <b>{categories.length}</b>{" "}
                results
              </p>
              <Pagination
                count={Math.ceil(categories.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </div>
        </div>

        <Dialog open={openViewDialog} onClose={handleDialogClose}>
          <DialogTitle>View Category</DialogTitle>
          <DialogContent>
            <p><strong>ID:</strong> {selectedCategory?._id}</p>
            <p><strong>Name:</strong> {selectedCategory?.name}</p>
            <p><strong>Color:</strong> {selectedCategory?.color}</p>
            <div className="d-flex productBox align-items-center">
              {Array.isArray(selectedCategory?.images) &&
                selectedCategory.images.map((image, index) => (
                  <div key={index} className="imgWrapper">
                    <div className="img">
                      <img
                        src={`${context.baseUrl}uploads/${image}`}
                        alt={selectedCategory?.name}
                        className="w-100"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={handleDialogClose}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
          <TextField
              margin="dense"
              label="Category Name"
              type="text"
              fullWidth
              name="name"
              value={selectedCategory?.name || ""}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Color"
              type="text"
              fullWidth
              name="color"
              value={selectedCategory?.color || ""}
              onChange={handleEditChange}
            />
          <p className="mt-4 ">*Change the Uploaded Image and Submit *</p>

            <div className="imgUploadBox d-flex align-items-center mt-2">
              {previews?.length !== 0 &&
                previews?.map((img, index) => (
                  <div className="uploadBox" key={index}>
                    <img src={img} className="w-100" alt="image"/>
                  </div>
                ))}
              <div className="uploadBox">
                <input
                  type="file"
                  onChange={onChangeFile}
                  name="images"
                />
                <div className="info">
                  <FaRegImages />
                  <h5>Image Upload </h5>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              {isLoading ? (
                <CircularProgress color="inherit" size={20} className="loader" />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </SnackbarProvider>
  );
};

export default Category;
