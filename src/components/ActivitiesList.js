import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImage from '../res/images/default.jpg';
// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    minPrice: 0,
    maxPrice: 0,
    category: '',
    minRating: 1,
    maxRating: 5,
    Organizer: '',
    startDate: '',
    endDate: ''
  });
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/activities/filter?${params}`);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [filters]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    // Accept comma as decimal separator
    let formattedValue = value;
    if (name === 'minPrice' || name === 'maxPrice') {
      formattedValue = value.replace(',', '.');
    }
  
    // Filters
    setFilters({
      ...filters,
      [name]: formattedValue,
    });
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Activities</h1>
      
      <div
        className="mb-4 cursor-pointer flex items-center font-bold text-lg"
        onClick={toggleFilterVisibility}
      >
        <FontAwesomeIcon icon={isFilterVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>Filters</span>
      </div>
      
      {isFilterVisible && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category:</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            >
              <option value="">Select Category</option>
              <option value="Education">Education</option>
              <option value="Event">Event</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Min Price:</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              step="0.1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Max Price:</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              step="0.1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Min Rating:</label>
            <input
              type="number"
              name="minRating"
              value={filters.minRating}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Max Rating:</label>
            <input
              type="number"
              name="maxRating"
              value={filters.maxRating}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap -mx-2">
        {activities.map((activity) => (
          <Link to={`/activity/${activity.id}`} key={activity.id} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="p-6 m-2 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <img src={defaultImage} alt="Activity" className="w-full h-48 object-cover rounded-md mb-4" />
              <h2 className="text-xl font-semibold mb-2">{activity.name}</h2>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <p className="text-gray-800 font-medium mb-2">Price: {activity.basePrice}€</p>
              <p className="text-gray-700 mb-2">Category: {activity.category}</p>
              <p className="text-gray-700 mb-2">Rating: {activity.averageRating}</p>
              <div className="flex justify-between items-center">
                <span className={`text-${activity.hidden ? 'red' : 'green'}-600`}>
                  {activity.hidden ? 'Hidden' : 'Visible'}
                </span>
                <span className={`text-${activity.verified ? 'green' : 'red'}-600`}>
                  {activity.verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesList;