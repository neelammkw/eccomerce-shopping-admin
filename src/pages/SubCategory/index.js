import React, { useEffect, useState, useContext } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdWidgets } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { SnackbarProvider, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Checkbox from "@mui/material/Checkbox";
import { MyContext } from "../../App";
import { fetchCategories, editCategories, deleteCategories } from "../../utils/api";

const SubCategory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const context = useContext(MyContext);

  const handleViewOpen = (category) => {
    setSelectedCategory(category);
    setOpenViewDialog(true);
  };

  const handleEditOpen = (category) => {
    setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  const handleDeleteOpen = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setOpenViewDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedCat = allCategories.find(cat => cat._id === value);
      setSelectedCategory((prev) => ({
        ...prev,
        category: selectedCat,
        categoryId: value,
      }));
    } else {
      setSelectedCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditSave = async () => {
    setIsLoading(true);
    try {
      await editCategories(`/api/subcategories/${selectedCategory._id}`, selectedCategory);
      enqueueSnackbar("Sub Category edited successfully!", { variant: "success" });
      setOpenEditDialog(false);
      fetchCategories("/api/subcategories").then((res) => {
        setCategories(res);
      });
    } catch (error) {
      enqueueSnackbar("Error editing subcategory. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCategories(`/api/subcategories/${selectedCategory._id}`);
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
      setOpenDeleteDialog(false);
      fetchCategories("/api/subcategories").then((res) => {
        setCategories(res);
      });
    } catch (error) {
      enqueueSnackbar("Error deleting category. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories("/api/subcategories").then((res) => {
      context.setProgress(20);
      setCategories(res);
      context.setProgress(100);
    });
    fetchCategories("/api/categories").then((res) => {
      setAllCategories(res);
    });
  }, [currentPage, itemsPerPage, context]);

  const handlePageChange = (event, value) => {
    context.setProgress(10);
    setCurrentPage(value);
    context.setProgress(100);
  };

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
              <Link to="/subcategory-add">
                <Button className="btn-blue mr-2 w-100">Add Sub Category</Button>
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
                  <th>Category Name</th>
                  <th>Sub Category</th>
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
                      <td>{category?.category?.name}</td>
                      <td>{category.subcat}</td>
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
                            onClick={() => handleDeleteOpen(category)}
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
            <p><strong>Category:</strong> {selectedCategory?.category?.name}</p>
            <p><strong>Sub Category:</strong> {selectedCategory?.subcat}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={handleDialogClose}>
          <DialogTitle>Edit Sub Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              margin="dense"
              select
              fullWidth
              name="categoryId"
              value={selectedCategory?.category?._id || ""}
              onChange={handleEditChange}
              renderValue={(selected) => {
               
                const selectedCategory = allCategories.find(cat => cat._id === selected);
                return selectedCategory ? selectedCategory.name : "";
              }}
            >
              
              {allCategories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Sub Category"
              type="text"
              fullWidth
              name="subcat"
              value={selectedCategory?.subcat || ""}
              onChange={handleEditChange}
            />
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

        <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this category?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              {isLoading ? (
                <CircularProgress color="inherit" size={20} className="loader" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </SnackbarProvider>
  );
};

export default SubCategory;
