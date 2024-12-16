import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import saveIcon from '../res/icons/save.svg';
import removeIcon from '../res/icons/remove.svg';

// Mapping for category values
const categoryMap = {
  '1': 'Education',
  '2': 'Event',
  '3': 'Service',
  '4': 'Other',
};

// Reverse mapping to convert back to numbers, if needed
const reverseCategoryMap = {
  'Education': '1',
  'Event': '2',
  'Service': '3',
  'Other': '4',
};

const UpdatePackage = () => {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState({
    name: '',
    price: '',
    description: '',
    fk_Organizerid: null,
  });

  const [activities, setActivities] = useState([]);
  const categories = ['Education', 'Event', 'Service', 'Other'];
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packageResponse = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/${packageId}`);
        const activitiesResponse = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/${packageId}/activities`);

        setPackageData({
          name: packageResponse.data.name,
          price: packageResponse.data.price,
          description: packageResponse.data.description,
          fk_Organizerid: packageResponse.data.fk_Organizerid,
        });

        setActivities(activitiesResponse.data.map(activity => ({
          ...activity,
          category: categoryMap[activity.category] || activity.category,
          isVisible: false,  // making all activities collapsed initially
        })));
      } catch (error) {
        toast.error(`Error fetching package: ${error.response ? error.response.data : error.message}`);
      }
    };
  
    if (accessToken) {
      fetchData();
    } else {
      toast.error('Access token could not be retrieved.');
    }
  }, [accessToken, packageId]);

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleActivityVisibility = (index) => {
    const newActivities = [...activities];
    newActivities[index].isVisible = !newActivities[index].isVisible;
    setActivities(newActivities);
  };

  const handleActivityChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newActivities = [...activities];
    if (name !== 'id') {
      newActivities[index][name] = type === 'checkbox' ? checked : value;
    } else {
      newActivities[index][name] = parseInt(value, 10);
    }
    setActivities(newActivities);
  };

  const removeActivity = (index) => {
    const newActivities = activities.filter((_, idx) => index !== idx);
    setActivities(newActivities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update package
      const updatedPackageData = {
        name: packageData.name,
        price: parseFloat(packageData.price),
        description: packageData.description,
        fk_Organizerid: packageData.fk_Organizerid, // Include fk_Organizerid
      };
      await axios.put(`https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/update/${packageId}`, updatedPackageData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      });

      // Ensure Fk_PackageId is passed as an integer
      const intPackageId = parseInt(packageId, 10);

      // Update activities with category as a string
      for (const activity of activities) {
        const activityData = {
          name: activity.name,
          description: activity.description,
          basePrice: parseFloat(activity.basePrice),
          Hidden: Boolean(activity.hidden), 
          Category: reverseCategoryMap[activity.category],
          Fk_PackageId: intPackageId, // Correct the casing to Fk_PackageId
        };

        await axios.put(`https://educations-castle-sunch.ondigitalocean.app/api/v1/activities/update/${activity.id}`, activityData, {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        });
      }

      toast.success('Package and activities updated successfully!');
      navigate('/organizer');
    } catch (error) {
      toast.error(`Error updating package or activities: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">Update Package</h1>
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
              step="0.01"
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
              <span>{activity.name || `Activity ${index + 1}`}</span>
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn bg-green-500 hover:bg-green-700 text-white font-bold px-4 rounded flex items-center"
          >
            <img src={saveIcon} alt="Save" className="icon-white h-5 w-5 mr-2" />
            Save Updates
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePackage;