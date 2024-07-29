import React, { useState,useEffect} from 'react';
import './PEBar.css';
import searchService from '../services/searchService'; //for district list
import priceEstimatorService from '../services/priceEstimatorService';
import townReviewService from '../services/townReviewService';
import TownReviewsComponent from './PETownReviews';
import WriteTownReviewComponent from './PEWriteTownReview';


const PriEsBar = () => {
    const [district, setDistrict] = useState();
    const [districtList, setDistrictList] = useState([]);
    const [propertyTypeList, setPropertyTypeList] = useState([]);
    const [townStats, setTownStats] = useState();
    const [price, setPrice] = useState('-');
    
    const [townReviewsData, setTownReviewsData] = useState({});
    const [townReviewPage, setTownReviewPage] = useState(1);

    //gets and sets dropdown list (for districts)
    useEffect(() => {
        searchService.getDropdownData()
        .then(response => {
            setDistrictList(response.data); 
        });
    }, [])

    //gets and sets dropdown list (for property types)
    useEffect(() => {
        priceEstimatorService.getPropertyTypeList()
        .then(response => {
            setPropertyTypeList(response.data); 
        });
    }, [])

    //paginates if the review page number is changed
    useEffect(() => {
        getReviews(district, townReviewPage);
    }, [townReviewPage]);
   
    //submits the estimator query
    const submitQuery = (event) => { 
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchQuery = Object.fromEntries(formData);

        //sets the district
        setDistrict(searchQuery['district']);

        //gets the price
        priceEstimatorService.getEstimatePrice(
            searchQuery['district'],
            searchQuery['property'],
            searchQuery['publicprivate'],
        )
            .then(response => setPrice(response.data['Estimated house price']))
            .catch(error => {
                if (error.response.status==404) setPrice("-1");
                }) 

        //gets town data
        priceEstimatorService.getTownStatistics(searchQuery['district'])
            .then(response => setTownStats(response.data[0]));
                
        //gets the town reviews
        getReviews(searchQuery['district'], 1);
    }
    
    // Separate function, so it can be passed as a prop to review-writing component,
    // and called when a new review is submitted.
    const getReviews = (districtNumber, page) => {
        console.log("meow")
        townReviewService.getTownReviews(districtNumber, page)
            .then(response => {
                if (response.data) {
                    setTownReviewsData(response.data);
                } 
            });
    }
    
    return(
        <>
        <div className="floaty">
            <div className='price-estimate-container'>
        <div className="searchbar">
            <form onSubmit={submitQuery}>

                <div>
                <select name="district" className="searchbarForm" defaultValue="default">
                    <option value="1000" default>District</option>
                    {
                        districtList.map(district => 
                        <option value={district.districtNumber}> {district.generalLocation} </option>
                        )
                    }   
                </select>
                </div>

                <div>
                <select name="publicprivate" className="searchbarForm" defaultValue="default">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
                </div>

                <div>
                <select name="property" className="searchbarForm" defaultValue="default">
                    <option value="" default>Property Type</option>
                    {
                        propertyTypeList.map(type => 
                        <option value={type}> {type} </option>
                        )
                    }
                </select>
                </div>

                <button type="submit" className="search-button">Search</button>
            </form>
            </div>
        
            {
                townStats ? (
                    <div className="estimator-infobox">
                    <h3>Estimated Price</h3>
                    <p>{price!=="-1" ? `$${parseFloat(price).toFixed(2)}` : 'No estimated price for these parameters!'}</p>
                    </div>
                ) : <></>
            }
                

            {
                townStats ? (
                    <div className="estimator-infobox">
                        <h3>District Statistics</h3>
                        <p>Average Private Price: ${townStats.averagePricePvt ? townStats.averagePricePvt : '-'}</p>
                        <p>Average Public Price: ${townStats.averagePricePublic ? townStats.averagePricePublic : '-'}</p>
                        <p>Average Overall Price: ${townStats.averagePriceAll ? townStats.averagePriceAll : '-'}</p>
                    </div>
                ) : <></>
            }

            {   
                townStats ? (
                <div className="estimator-infobox">
                    <h3>District Reviews</h3>
                    <WriteTownReviewComponent districtNumber={district} refreshReviews={(page) => getReviews(district, page)} />
                    <TownReviewsComponent townReviewsData={townReviewsData} townReviewPage={townReviewPage} setTownReviewPage={setTownReviewPage} />
                </div>
                ) : <></>
            }

        </div>
        </div>
        </>
    )
}

export default PriEsBar;