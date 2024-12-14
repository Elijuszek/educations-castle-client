import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getRole, useHandleLogout } from '../utils/Auth';
// Import the SVG icons
import LogoutIcon from '../res/icons/logout.svg';
import HomeIcon from '../res/icons/home.svg';
import ProfileIcon from '../res/icons/profile.svg';

function NavBar() {
  const isLoggedIn = isAuthenticated();
  const userRole = getRole();
  const handleLogout = useHandleLogout();

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left section: Home, Activities, Packages */}
        <div className="flex space-x-4">
          <Link to="/" className="flex items-center text-white font-semibold">
            <img src={HomeIcon} alt="Home" className="w-6 h-6 mr-2 icon-white" />
          </Link>
          <Link to="/activities" className="text-white font-semibold">
            Activities
          </Link>
          <Link to="/packages" className="text-white font-semibold">
            Packages
          </Link>
        </div>

        {/* Right section: User-specific and auth links */}
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
              <Link to="/profile" className="flex items-center text-white font-semibold">
                <img src={ProfileIcon} alt="Profile" className="w-6 h-6 mr-2 icon-white" />
              </Link>
              <button onClick={handleLogout} className="flex items-center text-white font-semibold">
                <img src={LogoutIcon} alt="Logout" className="w-6 h-6 mr-2 icon-white" />
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