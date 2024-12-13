// src/components/NavBar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  // Check if the user is logged in by checking the token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  const handleLogout = () => {
    // Remove the access and refresh token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left-side buttons */}
        <div className="flex space-x-4">
          <Link to="/" className="text-white font-semibold">
            Home
          </Link>
          <Link to="/activities" className="text-white font-semibold">
            Activities
          </Link>
        </div>
        {/* Right-side buttons */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            // If logged in, show logout button and other user-specific links possibly
            <>
              <button onClick={handleLogout} className="text-white font-semibold">
                Logout
              </button>
              {/* You can add other links for logged-in users here */}
            </>
          ) : (
            // If not logged in, show login and register links
            <>
              <Link to="/login" className="text-white font-semibold">
                Login
              </Link>
              <Link to="/register" className="text-white font-semibold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;