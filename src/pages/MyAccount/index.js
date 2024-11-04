import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditProfile from "../../components/EditProfile"; // Import the EditProfile component
import ChangePassword from "../../components/ChangePassword"; // Import the ChangePassword component

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [value, setValue] = useState(0); // For tabs
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      // Fetch user data here if needed
    } else {
      navigate("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return isLogin ? (
    <div className="right-content w-100 bottomEle">
       
      <div className="myaccount-container">
        <Typography variant="h4" gutterBottom className="myaccount-header">
          My Account
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleTabChange} className="myaccount-tabs">
            <Tab label="Edit Profile" />
            <Tab label="Change Password" />
            <Tab label="Settings" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <EditProfile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
        </Box>
      </div>
    </div>
    
  ) : null;
};

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className="tabpanel-content"
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default MyAccount;
