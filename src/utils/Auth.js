import { jwtDecode } from 'jwt-decode'; // Ensure proper importing of jwtDecode
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function removeTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getRole() {
  const token = localStorage.getItem('accessToken');
  if (!token || isTokenExpired(token)) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('accessToken');
  return Boolean(token && !isTokenExpired(token));
}

export function useHandleLogout() {
  const navigate = useNavigate();

  return async function handleLogout() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      // Call the logout API
      await axios.post('https://educations-castle-sunch.ondigitalocean.app/api/v1/users/logout', {}, {
        headers: { Authorization: token },
      });
      
      removeTokens();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle any additional errors here
    }
  };
}

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.expiredAt < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if any error occurs
  }
}