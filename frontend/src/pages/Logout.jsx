import React from 'react'
import "../assets/css/dashboard.css"
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    console.log("Logout Successfully");
    navigate("/");

  }
  return (
    <>
      <button className='logoutBtn' onClick={handleLogout}>LogOut</button>
    </>
  )
}

export default Logout