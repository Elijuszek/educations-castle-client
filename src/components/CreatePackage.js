import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserID } from '../utils/Auth';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import saveIcon from '../res/icons/save.svg';
import addIcon from '../res/icons/add.svg';
import removeIcon from '../res/icons/remove.svg';

const CreatePackage = () => {
  const [packageData, setPackageData] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [activities, setActivities] = useState([{ 
    name: '', 
    description: '', 
    basePrice: '', 
    hidden: false, 
    category: 'Education',
    isVisible: true 
  }]);

  const categories = ['Education', 'Event', 'Service', 'Other'];

  const navigate = useNavigate();

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageData({
      ...packageData,
      [name]: value,
    });
  };

  const handleActivityChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newActivities = [...activities];
    newActivities[index][name] = type === 'checkbox' ? checked : value;
    setActivities(newActivities);
  };

  const toggleActivityVisibility = (index) => {
    const newActivities = [...activities];
    newActivities[index].isVisible = !newActivities[index].isVisible;
    setActivities(newActivities);
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      { name: '', description: '', basePrice: '', hidden: false, category: 'Education', isVisible: true },
    ]);
  };

  const removeActivity = (index) => {
    const newActivities = activities.filter((_, idx) => index !== idx);
    setActivities(newActivities);
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
  
      // Create the package first
      const packageResponse = await axios.post(
        'https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/create',
        {
          name: packageData.name,
          price: parseFloat(packageData.price),
          description: packageData.description,
          fk_Organizerid: parseInt(userId, 10),
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (packageResponse.status === 201) {
        // If the package creation is successful, perform further actions
        const packageId = packageResponse.data.package_id;
      
        // Create activities for the package
        for (const activity of activities) {
          await axios.post(
            'https://educations-castle-sunch.ondigitalocean.app/api/v1/activities/create',
            {
              name: activity.name,
              description: activity.description,
              basePrice: parseFloat(activity.basePrice),
              Hidden: Boolean(activity.hidden), 
              Category: activity.category,
              Fk_PackageID: packageId,
            },
            {
              headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json',
              },
            }
          );
        }
  
        toast.success('Package and activities created successfully!');
        navigate('/organizer');
      } else {
        toast.error('Unexpected response while creating package');
      }
  
    } catch (error) {
      toast.error(`Error creating package or activities: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Create a New Package</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex mb-4">
          <div className="w-1/3 mr-2">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={packageData.name}
              onChange={handlePackageChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
            />
          </div>
          <div className="w-1/3 mr-2">
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={packageData.price}
              onChange={handlePackageChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
            />
          </div>
          <div className="w-1/3">
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              name="description"
              value={packageData.description}
              onChange={handlePackageChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold my-4">Activities</h2>
        {activities.map((activity, index) => (
          <div key={index} className="mb-4 border-b border-gray-300 pb-4">
            <div
              className="mb-4 cursor-pointer flex items-center font-bold text-lg"
              onClick={() => toggleActivityVisibility(index)}
            >
              <FontAwesomeIcon icon={activity.isVisible ? faChevronUp : faChevronDown} className="mr-2" />
              <span>{activity.name || `New Activity ${index + 1}`}</span>
            </div>

            {activity.isVisible && (
              <div>
                <div className="flex mb-2">
                  <div className="w-1/3 mr-2">
                    <label className="block text-gray-700">Activity Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={activity.name}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-2 border border-gray-400 rounded"
                      required
                    />
                  </div>
                  <div className="w-2/3">
                    <label className="block text-gray-700">Description:</label>
                    <input
                      type="text"
                      name="description"
                      value={activity.description}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-2 border border-gray-400 rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="w-1/3 mr-2">
                    <label className="block text-gray-700">Base Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      name="basePrice"
                      value={activity.basePrice}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-2 border border-gray-400 rounded"
                      required
                    />
                  </div>
                  <div className="w-1/3 mr-2">
                    <label className="block text-gray-700">Category:</label>
                    <select
                      name="category"
                      value={activity.category}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-2 border border-gray-400 rounded"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/3 flex items-center">
                    <label className="block text-gray-700 mr-2">Hidden:</label>
                    <input
                      type="checkbox"
                      name="hidden"
                      checked={activity.hidden}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="mr-2"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="btn bg-red-500 hover:bg-red-700 text-white font-bold px-2 my-2 rounded flex items-center"
                >
                  <img src={removeIcon} alt="Remove" className="icon-white h-5 w-5 mr-2" />
                  Remove Activity
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addActivity}
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 mb-4 rounded flex items-center"
        >
          <img src={addIcon} alt="Add" className="icon-white h-5 w-5 mr-2" />
          Add Activity
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn bg-green-500 hover:bg-green-700 text-white font-bold px-4 rounded flex items-center"
          >
            <img src={saveIcon} alt="Save" className="icon-white h-5 w-5 mr-2" />
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePackage;