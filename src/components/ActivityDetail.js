import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../res/images/default.jpg'; // Import the default image

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [defaultImage, defaultImage, defaultImage]; // Same image for illustration

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`https://educations-castle-sunch.ondigitalocean.app/api/v1/activities/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://educations-castle-sunch.ondigitalocean.app/api/v1/reviews');
        const filteredReviews = response.data.filter(review => review.fk_Activityid === parseInt(id, 10));
        setReviews(filteredReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchActivity();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Switch image every 3 seconds

    return () => clearInterval(intervalId);
  }, [images.length]);

  if (!activity) {
    return <div></div>;
  }

  return (
    <div className="container mx-auto p-8 flex justify-center">
      <div className="max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={images[currentImageIndex]}
            alt={activity.name}
            className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="p-6 grid grid-cols-2 gap-4">
            <h1 className="col-span-2 text-3xl font-bold mb-4 text-center">{activity.name}</h1>
            <div>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <p className="text-gray-800 font-medium mb-2">Price: {activity.basePrice}€</p>
              <p className="text-gray-700 mb-2">Category: {activity.category}</p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">Rating: {activity.averageRating}</p>
              <p className={`text-${activity.hidden ? 'red' : 'green'}-600 mb-2`}>
                {activity.hidden ? 'Hidden' : 'Visible'}
              </p>
              <p className={`text-${activity.verified ? 'green' : 'red'}-600`}>
                {activity.verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Review Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="mb-4">
                <p className="text-lg font-semibold">Rating: {review.rating}</p>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500">Date: {new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews available for this activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;