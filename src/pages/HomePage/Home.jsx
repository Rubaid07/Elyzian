import React from 'react';
import CustomerReviews from './CustomerReview';
import Hero from './Hero';
import PopularPolicies from './PopularPolicies';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <PopularPolicies></PopularPolicies>
            {/* <CustomerReviews></CustomerReviews> */}
        </div>
    );
};

export default Home;