import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultImage from '../res/images/default.jpg'; // Import the default image
import { Link } from 'react-router-dom';
const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://educations-castle-sunch.ondigitalocean.app/api/v1/activities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Activities</h1>
      <div className="flex flex-wrap -mx-2">
        {activities.map((activity) => (
          <Link to={`/activity/${activity.id}`} key={activity.id}>
            <div className="p-6 m-2 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <img src={defaultImage} alt="Activity" className="w-full h-48 object-cover rounded-md mb-4" />
              <h2 className="text-xl font-semibold mb-2">{activity.name}</h2>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <p className="text-gray-800 font-medium mb-2">Price: {activity.basePrice}€</p>
              <p className="text-gray-700 mb-2">Category: {activity.category}</p>
              <p className="text-gray-700 mb-2">Rating: {activity.averageRating}</p>
              <p className={`text-${activity.hidden ? 'red' : 'green'}-600 mb-2`}>
                {activity.hidden ? 'Hidden' : 'Visible'}
              </p>
              <p className={`text-${activity.verified ? 'green' : 'red'}-600`}>
                {activity.verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesList;