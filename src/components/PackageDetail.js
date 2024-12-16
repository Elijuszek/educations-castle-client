import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../res/images/default.jpg';

const PackageDetail = () => {
  const { packageId } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const packageResponse = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/${packageId}`);
        setPackageDetails(packageResponse.data);
        
        const activitiesResponse = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/packages/${packageId}/activities`);
        setActivities(activitiesResponse.data);
      } catch (error) {
        console.error('Error fetching package details or activities:', error);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  if (!packageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="package-detail-container p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center">{packageDetails.name}</h1>
      <div className="package-detail-card flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
          <img src={defaultImage} alt="Package" className="w-full h-64 object-cover rounded mb-4" />
          <p className="text-gray-600 mb-4">{packageDetails.description}</p>
          <p className="text-gray-800 font-medium mb-4">Price: {packageDetails.price}€</p>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold mt-8 mb-4">Activities</h2>
      <div className="activities-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <Link to={`/activity/${activity.id}`} key={activity.id} className="activity-card bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out overflow-hidden">
            <img src={defaultImage} alt="Activity" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <p className="text-gray-800 font-medium mb-2">Price: {activity.basePrice}€</p>
              <p className="text-gray-700 mb-2">Category: {activity.category}</p>
              <p className="text-gray-700 mb-2">Rating: {activity.averageRating}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PackageDetail;