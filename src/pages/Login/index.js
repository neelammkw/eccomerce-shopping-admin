import React, { useEffect, useContext, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import patern from "../../assets/images/pattern.png";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Googlelogo from "../../assets/images/google-logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    context.setHideSideandHeader(true);
  }, [context]);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const validate = () => {
    let errors = {};

    if (!formFields.email) {
      errors.email = "Email is required";
      toast.error("Email is required");
    }
    if (!formFields.password) {
      errors.password = "Password is required";
      toast.error("Password is required");
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user info:", user); // Log the user data

      const fields = {
        name: user.displayName,
        email: user.email,
        profilePhoto: user.photoURL,
        password: null, // Not required as this is a Google sign-in
        phone: user.phoneNumber,
        isAdmin: true,
      };

      // Send user details to your backend API
      const response = await postData("/api/user/admin/authWithGoogle", fields);
      console.log("API response:", response); // Log the API response

      // Check if response.data exists
      if (response.status === 200 && response.data) {
        const { token, user: apiUser } = response.data; // Adjusting to access response.data
        console.log("User from API:", apiUser); // Ensure this is not undefined

        localStorage.setItem("token", token);

        const userData = {
          name: apiUser.name,
          email: apiUser.email,
          userId: apiUser._id,
          profilePhoto: apiUser.profilePhoto,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        context.setUser(userData);
        context.setIsLogin(true);
        toast.success("Logged in successfully with Google!");
        navigate("/");
      } else {
        toast.error(response.message || "Google sign-in failed.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("An error occurred during Google sign-in.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await postData("/api/user/login", formFields);

      if (response) {
        if (response.status === 200) {
          const { token, user } = response.data;

          const userdata = {
            name: user.name,
            email: user.email,
            userId: user._id,
          };
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userdata));

          context.setUser({
            name: response.user?.name,
            email: response.user?.email,
            isLoggedIn: true,
          });
          toast.success("Logged in successfully!");
          console.log(response.data); // Handle login success (e.g., save token, redirect)
          // navigate('/dashboard');
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          toast.error(
            response.data?.message || "Login failed. Please try again."
          );
        }
      } else {
        toast.error("No response from the server. Please try again.");
      }
    } catch (error) {
      // Handle server errors or network issues
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again later.");
    }
  };

  return (
    <>
      <img src={patern} className="loginpatern" alt="pattern" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} alt="logo" />
            <h5 className="font-weight-bold">Login to Fashion Fables</h5>
          </div>
          <div className="wrapper mt-3 card border">
            <form onSubmit={handleSubmit}>
              <div
                className={`form-group mb-3 position-relative ${
                  inputIndex === 0 && "focus"
                }`}
              >
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your email"
                  name="email"
                  value={formFields.email}
                  onChange={handleChange}
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  autoFocus
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
              <div
                className={`form-group mb-4 position-relative ${
                  inputIndex === 1 && "focus"
                }`}
              >
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={`${isShowPassword ? "text" : "password"}`}
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  value={formFields.password}
                  onChange={handleChange}
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                />
                <span
                  className="toggleShowPassword"
                  onClick={() => setisShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>
              <div className="form-group justify-content-center w-auto">
                <Button type="submit" className="btn-blue btn-lg big w-100">
                  Sign In
                </Button>
              </div>
              <div className="form-group text-center">
                <Link to="/forgot-password" className="link">
                  FORGOT PASSWORD
                </Link>
                <div className="d-flex align-items-center justify-content-center or mt-2">
                  <span className="line"></span>
                  <span className="txt">or</span>
                  <span className="line"></span>
                </div>
                <Button
                  variant="outlined"
                  className="w-100 btn-lg loginwithGoogle btn-big mt-2"
                  onClick={signInWithGoogle}
                >
                  <img src={Googlelogo} alt="google" width="30px" /> &nbsp; Sign
                  In With Google
                </Button>
              </div>
            </form>
          </div>
          <div className="wrapper card border footer p-3">
            <span className="text-center">
              Don't have an account?
              <Link to="/sign-up" className="link color ml-2">
                Register
              </Link>
            </span>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Login;
