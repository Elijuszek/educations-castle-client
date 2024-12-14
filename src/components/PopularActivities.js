// src/components/PopularActivities.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImage from '../res/images/default.jpg';

const MostPopularActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://educations-castle-sunch.ondigitalocean.app/api/v1/activities');
        // Set only the first 3 activities
        setActivities(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="most-popular-activities max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Most Popular Activities</h2>
      <div className="flex flex-wrap justify-center -mx-2">
        {activities.map((activity) => (
          <Link to={`/activity/${activity.id}`} key={activity.id} className="w-full sm:w-1/2 md:w-1/3 p-2">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <img src={defaultImage} alt="Activity" className="w-full h-48 object-cover rounded-t-md" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{activity.name}</h2>
                <p className="text-gray-600 mb-2">{activity.description}</p>
                <p className="text-gray-800 font-medium mb-2">Price: {activity.basePrice}€</p>
                <p className="text-gray-700 mb-2">Category: {activity.category}</p>
                <p className="text-gray-700 mb-2">Rating: {activity.averageRating}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MostPopularActivities;