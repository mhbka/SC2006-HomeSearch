import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './PEWriteTownReview.css';
import townReviewService from '../services/townReviewService';

const WriteTownReviewComponent = ({districtNumber, refreshReviews}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
        console.log(districtNumber);
        const response = await townReviewService.postTownReview(districtNumber, rating, reviewText);
        if (response.status == 200) {
          setRating(0);
          setReviewText('');
          refreshReviews();
        } 
        else {
          alert('Failed to submit review. Please try again.');
      }
    } 
    catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="write-review-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'star filled' : 'star'}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>
      <textarea
        className="review-text-input"
        value={reviewText}
        onChange={handleReviewTextChange}
        placeholder="Write your review here..."
        rows="4"
      />
      <button className="submit-review-btn" onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
};

export default WriteTownReviewComponent;