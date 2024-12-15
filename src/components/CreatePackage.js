import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserID } from '../utils/Auth';
import { toast } from 'react-toastify';

const CreatePackage = () => {
  const [packageData, setPackageData] = useState({
    name: '',
    price: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData({
      ...packageData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserID();
      const accessToken = localStorage.getItem('accessToken');

      if (!userId) {
        toast.error('User ID could not be retrieved.');
        return;
      }

      if (!accessToken) {
        toast.error('Access token could not be retrieved.');
        return;
      }

      const dataToSend = {
        name: packageData.name,
        price: parseFloat(packageData.price),
        description: packageData.description,
        fk_Organizerid: parseInt(userId, 10),
      };

      await axios.post(
        'https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/create',
        dataToSend,
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Package created successfully!');
      navigate('/organizer'); // Redirect to the Organizer page upon success
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Handle the specific "Package already exists" error
        toast.error('Package with this name already exists.');
      } else {
        // Handle other errors
        toast.error(`Error creating package: ${error.response ? error.response.data : error.message}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Create a New Package</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={packageData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            value={packageData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={packageData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded"
            required // Add this line
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Package
        </button>
      </form>
    </div>
  );
};

export default CreatePackage;