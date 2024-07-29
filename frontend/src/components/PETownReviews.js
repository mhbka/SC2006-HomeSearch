import React from 'react';
import { FaStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa';
import './PETownReviews.css';

const TownReviewsComponent = ({ townReviewsData, townReviewPage, setTownReviewPage }) => {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FaStar key={i} className="star filled" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FaStarHalfAlt key={i} className="star filled" />);
        } else {
            stars.push(<FaStar key={i} className="star" />);
        }
        }

        return stars;
    };

    const onPageChange = (pageNumber) => {
        setTownReviewPage(pageNumber);
    }

    if (townReviewsData) return (
        <div className="review-container">
            <div className="average-rating">
                <span className="average-rating-number">{townReviewsData.averageRating}</span>
                
                <div className="total-reviews-number">({townReviewsData.totalReviews} reviews)</div>
                <div className="average-rating-stars">{renderStars(townReviewsData.averageRating)}</div>
            </div>

            <div className="reviews-list">
                {townReviewsData.data ? (townReviewsData.data.map((review, index) => (
                <div key={index} className="review-item">
                    <FaUserCircle className="profile-picture" />
                    <div className="review-header">
                    <span className="reviewer-name">{review.user.name}</span>
                    <div className="review-date">{review.createdAt.split('T')[0]}</div>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
                <p className="review-text">{review.reviewText}</p>
            </div>
            ))) : 
            <></>
            }
            </div>
            
            <div className="pagination-container">
                {Array.from({ length: townReviewsData.totalPages }, (_, i) => i + 1)
                    .map(number => (
                    <button className="pagination-button" key={number} onClick={() => onPageChange(number)} >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    )
    else return (<></>);
};

export default TownReviewsComponent;