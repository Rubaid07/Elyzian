import React from 'react';
import CustomerReviews from './CustomerReview';
import Hero from './Hero';
import PopularPolicies from './PopularPolicies';
import Benefits from './Benefits';
import BlogList from './BlogList';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <PopularPolicies></PopularPolicies>
            <Benefits></Benefits>
            <CustomerReviews></CustomerReviews>
            <BlogList></BlogList>
        </div>
    );
};

export default Home;