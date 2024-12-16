import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('https://educations-castle-sunch.ondigitalocean.app/api/v1/users', {
          headers: {
            Authorization: accessToken,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const checkOrganizerStatus = async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/organizers/${userId}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setOrganizers((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOrganizers((prev) => ({ ...prev, [userId]: false }));
      } else {
        console.error('Error checking organizer status:', error);
      }
    }
  };

  useEffect(() => {
    users.forEach(user => {
      checkOrganizerStatus(user.id);
    });
  }, [users]);

  const handleMakeOrganizer = async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('https://educations-castle-sunch.ondigitalocean.app/api/v1/users/create-organizer', {
        ID: userId,
        description: "The new organizer!"
      }, {
        headers: {
          Authorization: accessToken,
        },
      });

      if (response.status === 201) {
        // Hide the button by marking the user as an organizer
        setOrganizers((prev) => ({ ...prev, [userId]: true }));
        console.log(`User ${userId} is now an organizer`);
      }
    } catch (error) {
      console.error('Error making user an organizer:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold text-center my-4">Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id} className="mb-4">
            <div className="border p-3 rounded shadow-md">
              <div className="flex justify-between mb-1">
                <div>
                  <strong>Username:</strong> {user.username}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
              </div>
              <div className="flex justify-between mb-1">
                <div>
                  <strong>Registration Date:</strong> {new Date(user.registrationDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Last Login Date:</strong> {new Date(user.lastLoginDate).toLocaleDateString()}
                </div>
              </div>
              {!organizers[user.id] && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleMakeOrganizer(user.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded shadow-sm transition duration-300"
                  >
                    Make Organizer
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;