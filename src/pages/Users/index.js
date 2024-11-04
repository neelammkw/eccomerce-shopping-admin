import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {  FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchDataFromApi, deleteUser } from "../../utils/api";
import { MyContext } from "../../App";

const Users = () => {
  const context = useContext(MyContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBy] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    context.setProgress(40);
    fetchDataFromApi("/api/user").then((res) => {
      context.setProgress(100);
      setUsers(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const deleteUserHandler = (id) => {
    context.setProgress(40);
    deleteUser(`/api/user/${id}`)
      .then((res) => {
        setSnackbarMessage("User deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchDataFromApi("/api/user").then((res) => {
          setUsers(res);
        });
      })
      .catch((error) => {
        setSnackbarMessage("Error deleting user");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    context.setProgress(100);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Calculate the users to display based on pagination
  const indexOfLastUser = currentPage * showBy;
  const indexOfFirstUser = indexOfLastUser - showBy;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow">
          <div className="mc-breadcrumb">
            <h3 className="mc-breadcrumb-title">User List</h3>
            <ul className="mc-breadcrumb-list">
              <li className="mc-breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="mc-breadcrumb-item">Users</li>
            </ul>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">All Users</h3>
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>Profile Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Facebook</th>
                  <th>Instagram</th>
                  <th>WhatsApp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 &&
                  currentUsers.map((user, index) => (
                    <tr key={index}>
                      <td>
                       <div className="userImg">
                      <span className="rounded-circle"><img
                  src={`https://ecommerce-shopping-server.onrender.com/uploads/${user?.profilePhoto}`}
                  alt="avatar"
                /></span>
                    </div>
                       
                      </td    >
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>{user.isAdmin ? "Admin" : "User"}</td>
                      <td>{user.facebook}</td>
                      <td>{user.instagram}</td>
                      <td>{user.whatsApp}</td>
                      <td>
                        <div className="actions d-flex align-items-center">
                         
                          <Link to={`/user-details/${user.id}`}>
                            <Button color="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>
                          <Button
                            color="error"
                            onClick={() => deleteUserHandler(user.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="d-flex tableFooter">
              <p>
                showing <b>{showBy}</b> of <b>{users.length}</b> results
              </p>
              <Pagination
                count={Math.ceil(users.length / showBy)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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

export default Users;
