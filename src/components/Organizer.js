import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS
import { getUserID } from '../utils/Auth';

function Organizer() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error('User ID could not be retrieved.');
          return;
        }
        
        const response = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/organizer/${userId}/packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleAddPackage = () => {
    navigate('/packages/create');
  };

  const handleDeletePackage = async (packageId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token could not be retrieved.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(
          `https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/delete/${packageId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        setPackages(packages.filter(pkg => pkg.id !== packageId)); // Remove package from list
        toast.success('Package deleted successfully'); // Show success notification
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error(`Error deleting package: ${error.message}`); // Show error notification
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-center" /> {/* Center notifications at the top */}
      <h1 className="text-3xl font-bold text-center my-4">Organizer Panel</h1>
      {packages.length > 0 ? (
        <div className="packages-container">
          <div className="mb-4">
            <button
              onClick={handleAddPackage}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
            >
              Add New Package
            </button>
          </div>
          <table className="min-w-full bg-white shadow-md rounded mb-4">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {packages.map((packageItem) => (
                <tr key={packageItem.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{packageItem.name}</td>
                  <td className="py-3 px-6 text-left">{packageItem.description}</td>
                  <td className="py-3 px-6 text-left">{packageItem.price}€</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Edit</button>
                      <button
                        onClick={() => handleDeletePackage(packageItem.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No packages available.</p>
      )}
    </div>
  );
}

export default Organizer;