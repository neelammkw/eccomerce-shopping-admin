import { HiDotsVertical } from "react-icons/hi";
import React from "react";
import Button from "@mui/material/Button";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoIosTimer } from "react-icons/io";
const DashboardBox = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Button
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${props.color?.[0]} , ${props.color?.[1]})`,
      }}
    >
      {props.grow === true ? (
        <span className="chart">
          <TrendingUpIcon />
        </span>
      ) : (
        <span className="chart">
          <TrendingDownIcon />
        </span>
      )}
      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0"> Total Users</h4>
          <span className="text-white"> 255</span>
        </div>
        <div className="ml-auto">
          {props.icon ? (
            <span className="icon">{props.icon ? props.icon : " "} </span>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="d-flex align-items-center w-100">
        <h7 className="text-white mb-0 mt-0"> Last Month</h7>
        <div className="ml-auto">
          <Button className="ml-auto toggleIcon" onClick={handleClick}>
            <HiDotsVertical />{" "}
          </Button>
        </div>
        <Menu
          className="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          // PaperProps={{
          //   style: {
          //     maxHeight: ITEM_HEIGHT * 4.5,
          //     width: "20ch",
          //   },
          // }}
        >
          <MenuItem onClick={handleClose}>
            <IoIosTimer /> Last Day
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <IoIosTimer /> Last Week
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <IoIosTimer /> Last Month
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <IoIosTimer /> Last Year
          </MenuItem>
        </Menu>
      </div>
    </Button>
  );
};
export default DashboardBox;