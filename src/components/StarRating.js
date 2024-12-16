import React from 'react';
import ReactStars from "react-rating-stars-component";

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <ReactStars
      count={5}
      value={rating}
      onChange={onRatingChange} // Pass the handler as is; it'll get the new rating.
      size={40}
      isHalf={false}
      activeColor="#ffd700"
      color="#d4af37"
    />
  );
};

export default StarRating;