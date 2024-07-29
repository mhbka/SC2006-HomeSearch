import axios from 'axios';
import tokenAndHeaderPrep from './tokenAndHeaderPrep';
const baseUrl = '/homesearch/v1/townreviews';

// gets reviews for that town
const getTownReviews = (districtNumber, page) => {
    return axios.get(`${baseUrl}/${districtNumber}`, {
        params: {page},
        headers: tokenAndHeaderPrep.getAuthHeaders()
      });
}

// posts a review for that town
const postTownReview = (districtNumber, rating, reviewText) => {
    return axios.post(`${baseUrl}/${districtNumber}`, 
        {
            rating,
            reviewText
        }, 
        {
            headers: tokenAndHeaderPrep.getAuthHeaders()
        }
    );
}

export default {
    getTownReviews,
    postTownReview
}