// src/components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
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
          <Link to="/login" className="text-white font-semibold">
            Login
          </Link>
          <Link to="/register" className="text-white font-semibold">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;