import React, { useEffect, useContext, useState } from 'react';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom'; 
import { postData } from "../../utils/api";
import patern from '../../assets/images/pattern.png';
import { MdEmail, MdPhone } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Googlelogo from '../../assets/images/google-logo.png';
import { FaUserCircle } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { IoMdHome } from 'react-icons/io';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate(); 
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    context.setHideSideandHeader(true);
    window.scrollTo(0, 0);
  }, [context]);

  const focusInput = (index) => {
    setInputIndex(index);
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
      const response = await postData("/api/user/authWithGoogle", fields);
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

  const validate = () => {
    let errors = {};

    if (!formFields.name) {
      errors.name = "Name is required";
      toast.error("Name is required");
    }
    if (!formFields.email) {
      errors.email = "Email is required";
      toast.error("Email is required");
    }
    if (!formFields.phone) {
      errors.phone = "Phone number is required";
      toast.error("Phone number is required");
    }
    if (!formFields.password) {
      errors.password = "Password is required";
      toast.error("Password is required");
    }
    if (formFields.password !== formFields.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true); // Show loader

    try {
      const response = await postData("/api/user/sign-up", formFields);

      if (response && response.status === 201) {
        toast.success("User added successfully!");
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data.message;
        if (backendErrors === "User already exists") {
          toast.error("User with this email or phone number already exists");
        } else {
          toast.error(backendErrors || "An error occurred during registration");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.log("API Call Error:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <img src={patern} className='loginpatern' alt="pattern" />
      <section className='loginSection signUpSection'>
        <div className='row'>
          <div className='col-md-8 d-flex align-items-center flex-column justify-content-center part4'>
            <h1>BEST UX/UI FASHION<br/><span className='text-sky'>E-COMMERCE DASHBOARD </span> & ADMIN PANEL</h1>
            <p>
              Welcome to the ultimate fashion e-commerce dashboard and admin
              panel. Our platform provides you with a seamless and intuitive
              user experience, enabling you to manage your store effortlessly.
              Whether you are tracking sales, managing inventory or analyzing
              customer data, our dashboard has got you covered.
            </p>
            <div>
              <Link to="/">
                <Button className="btn-blue btn-home">
                  <IoMdHome />&nbsp;Go To Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="loginBox">
              <div className="logo text-center">
                <h5 className='font-weight-bold'>Register a new account</h5>
              </div>
              <div className='wrapper mt-3 card border'>
                <form onSubmit={handleSubmit}>
                  <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                    <span className='icon'>
                      <FaUserCircle />
                    </span>
                    <input
                      type='text'
                      className='form-control mb-3'
                      placeholder='Enter your name'
                      name='name'
                      value={formFields.name}
                      onChange={handleChange}
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                    />
                   
                  </div>
                  <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className='icon'>
                      <MdEmail />
                    </span>
                    <input
                      type='text'
                      className='form-control mb-3'
                      placeholder='Enter your email'
                      name='email'
                      value={formFields.email}
                      onChange={handleChange}
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                    />
                   
                  </div>
                  <div className={`form-group mb-3 position-relative ${inputIndex === 2 && 'focus'}`}>
                    <span className='icon'>
                      <MdPhone />
                    </span>
                    <input
                      type='text'
                      className='form-control mb-3'
                      placeholder='Enter your phone number'
                      name='phone'
                      value={formFields.phone}
                      onChange={handleChange}
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                    />
                   
                  </div>
                  <div className={`form-group mb-4 position-relative ${inputIndex === 3 && 'focus'}`}>
                    <span className='icon'>
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword ? 'text' : 'password'}`}
                      className='form-control mb-3'
                      placeholder='Enter your password'
                      name='password'
                      value={formFields.password}
                      onChange={handleChange}
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                    />
                    <span
                      className='toggleShowPassword'
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                    
                  </div>
                  <div className={`form-group mb-4 position-relative ${inputIndex === 4 && 'focus'}`}>
                    <span className='icon'>
                      <IoShieldCheckmarkSharp />
                    </span>
                    <input
                      type={`${isShowConfirmPassword ? 'text' : 'password'}`}
                      className='form-control mb-3'
                      placeholder='Confirm your password'
                      name='confirmPassword'
                      value={formFields.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => focusInput(4)}
                      onBlur={() => setInputIndex(null)}
                    />
                    <span
                      className='toggleShowPassword'
                      onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    >
                      {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label='I agree to the all terms & Conditions'
                  />
                  <div className='form-group justify-content-center w-auto'>
                    <Button type='submit' className='btn-blue btn-login'>
                      {loading ? <CircularProgress size={24} /> : "Sign Up"} {/* Conditionally show loader */}
                    </Button>
                  </div>
                </form>
              </div>
 
              <div className='text-center pt-3'>
                <h6>Already have an account? <Link to="/login" className='text-sky'>Login</Link></h6>
              </div>

              <div className='d-flex align-items-center mt-0'>
                <hr className='w-50' />
                <h6 className='text-muted mx-3'>Or</h6>
                <hr className='w-50' />
              </div>

              <div className='text-center'>
                <Link to="#" className='googleLogin' onClick={signInWithGoogle}><img src={Googlelogo} alt="Google logo" /> Login with Google</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}

export default SignUp;
