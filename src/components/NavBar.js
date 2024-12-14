import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getRole, useHandleLogout } from '../utils/Auth';

function NavBar() {
  const isLoggedIn = isAuthenticated();
  const userRole = getRole();
  const handleLogout = useHandleLogout();

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-white font-semibold">
            Home
          </Link>
          <Link to="/activities" className="text-white font-semibold">
            Activities
          </Link>
        </div>
        <div className="flex space-x-4">
          {isLoggedIn && userRole === 'administrator' && (
            <Link to="/admin" className="text-white font-semibold">
              Admin
            </Link>
          )}
          {isLoggedIn && (userRole === 'organizer' || userRole === 'administrator') && (
            <Link to="/organizer" className="text-white font-semibold">
              Organizer
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link to="/profile" className="text-white font-semibold">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-white font-semibold">
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
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