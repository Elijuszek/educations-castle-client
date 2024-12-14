import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getRole, getUserID } from '../utils/Auth';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    registrationDate: '',
    lastLoginDate: '',
  });

  const role = getRole();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserID();
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);
        if (!userId) {
          console.error('User ID could not be retrieved.');
          return;
        }
  
        if (!accessToken) {
          console.error('Access token could not be retrieved.');
          return;
        }
        
        const response = await axios.get(
            `https://educations-castle-sunch.ondigitalocean.app/api/v1/users/${userId}`, 
            {
              headers: {
                Authorization: accessToken
              }
            }
          );
        
        setUserData({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          registrationDate: new Date(response.data.registrationDate).toLocaleString(),
          lastLoginDate: new Date(response.data.lastLoginDate).toLocaleString(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div className="max-w-sm mx-auto my-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="mb-1 text-lg font-medium text-gray-900">{userData.username}</h2>
        <p className="mb-2 text-sm text-gray-600">Email: {userData.email}</p>
        <p className="mb-2 text-sm text-gray-600">Registered: {userData.registrationDate}</p>
        <p className="mb-4 text-sm text-gray-600">Last Login: {userData.lastLoginDate}</p>
        <p className="px-4 py-1 text-sm text-white bg-blue-500 rounded-full">{role || 'No role assigned'}</p>
      </div>
    </div>
  );
};

export default UserProfile;