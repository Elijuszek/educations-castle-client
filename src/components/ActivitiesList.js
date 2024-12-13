import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <div className="-mx-2">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 m-2 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">
              {activity.name}
            </h2>
            <p className="text-gray-600">{activity.description}</p>
            <p className="text-gray-800 font-medium">Price: ${activity.basePrice}</p>
            <p className="text-gray-700">Category: {activity.category}</p>
            <p className="text-gray-700">Rating: {activity.averageRating}</p>
            <p className={`text-${activity.hidden ? 'red' : 'green'}-600`}>
              {activity.hidden ? 'Hidden' : 'Visible'}
            </p>
            <p className={`text-${activity.verified ? 'green' : 'red'}-600`}>
              {activity.verified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesList;