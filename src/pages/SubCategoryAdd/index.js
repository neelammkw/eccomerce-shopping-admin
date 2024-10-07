import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { RxDividerVertical } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData, fetchCategories } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

const SubCategoryAdd = () => {
  const [categoryVal, setCategoryVal] = useState("");
  const [categories, setCategories] = useState([]);
  const [formfield, setFormFields] = useState({
    name: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error_, setError] = useState(false);
  const history = useNavigate();

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

  const addSubCategory = async (e) => {
    e.preventDefault();
 const formdata = new FormData();

    if (formfield.subcat !== "" && formfield.category !== "") {
      setLoading(true);
      try {
        const res = await postData("/api/subcategories/create", formfield);
        toast.success("Subcategory added successfully!");
        history("/subcategory-list");
      } catch (error) {
        setLoading(false);
        toast.error("Error adding subcategory. Please try again.");
      }
    } else {
      toast.error("Please fill all the fields.");
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
      category: e.target.value,
    }));
  };

  return (
    <>
      <div className="right-content w-100 bottomEle">
        <div className="card shadow mt-100">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">Add Subcategory</h3>
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
                <a className="mc-breadcrumb-link" href="/subcategory-list">
                  Subcategory
                </a>
              </li>
              <div className="icon">
                <RxDividerVertical />
              </div>
              <li className="mc-breadcrumb-item">Add Subcategory</li>
            </ul>
          </div>
        </div>
        <form onSubmit={addSubCategory}>
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
                    
                  <div className="col-xl-12">
                    <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">Category</label>
                      <Select
                        labelId="catname"
                        id="category-select"
                        value={categoryVal}
                        className="w-100 select"
                        onChange={changeCategory}
                        name="category"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="mc-label-field-group label-col">
                      <label className="mc-label-field-title">
                        SubCategory Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="mc-label-field-input mb-4 w-100 h-md"
                        name="subcat"
                        onChange={changeInput}
                      />
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

export default SubCategoryAdd;
