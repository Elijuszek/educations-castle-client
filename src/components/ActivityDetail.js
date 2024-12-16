import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../res/images/default.jpg';
import { isAuthenticated, getRole, getUserID } from '../utils/Auth';
import StarRating from './StarRating';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' }); // Set initial rating to 0
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [defaultImage, defaultImage, defaultImage];

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
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const userId = parseInt(getUserID(), 10);
  
    try {
      const response = await axios.post(
        'https://educations-castle-sunch.ondigitalocean.app/api/v1/reviews/create',
        {
          comment: newReview.comment,
          rating: newReview.rating,
          fk_Userid: userId,
          fk_Activityid: parseInt(id, 10),
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
  
      console.log('Response:', response); // Log response for debugging
      if (response.status === 200 || response.status === 201) { // Consider accepting status 201
        setReviews([...reviews, { ...newReview, id: new Date().getTime(), date: new Date(), fk_Activityid: parseInt(id, 10) }]);
        setNewReview({ rating: 1, comment: '' }); // Reset to initial state
        toast.success('Review submitted successfully!', { position: "top-center" });
      }
    } catch (error) {
      console.error('Error submitting review:', error); // Log error for debugging
      if (error.response && error.response.status === 422 && error.response.data.error.includes('already exists')) {
        toast.error('You can only write one review per activity.', { position: "top-center" });
      } else {
        toast.error('Failed to submit review. Please try again.', { position: "top-center" });
      }
    }
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = isAuthenticated();
  const userRole = getRole();
  const canWriteReview = isLoggedIn && (userRole === 'user' || userRole === 'administrator');

  return (
    <div className="container mx-auto p-8 flex justify-center">
      <ToastContainer />
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

          {canWriteReview && (
            <form onSubmit={submitReview} className="mt-8">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating:</label>
                <StarRating rating={newReview.rating} onRatingChange={handleRatingChange} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Comment:</label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  className="border rounded p-2 w-full"
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;