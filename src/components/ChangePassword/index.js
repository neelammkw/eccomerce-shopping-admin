import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { changeUserPassword } from '../../utils/api';
import { MyContext } from '../../App'; // Import your context
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const { user } = useContext(MyContext); // Get the user object from context
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
if (newPassword === oldPassword) {
      toast.error('New password cannot be the same as the old password');
      return;
    }

    // Validation checks
    if (!oldPassword) {
      toast.error('Old password is required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await changeUserPassword(user.userId, oldPassword, newPassword); // Pass the user ID

      if (response.success) {
        toast.success('Password changed successfully');
      } else if (response.message) {
        toast.error(response.message);
      } else {
        toast.error('An error occurred while changing the password');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Old Password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
          required
        />
        <TextField
          label="New Password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
          required
          inputProps={{ minLength: 6 }}
        />
        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Change Password
        </Button>
      </form>
    </>
  );
};

export default ChangePassword;
