import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useLocation } from 'react-router';
import PaymentForm from './PaymentForm';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
    const location = useLocation();
    const { policyId, premiumAmount, paymentFrequency, policyName } = location.state || {};

    if (!policyId || !premiumAmount || !paymentFrequency || !policyName) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error: Policy information missing.</h2>
                <p className="text-lg text-gray-700">Please go back to the payment status page and try again.</p>
                <button onClick={() => window.history.back()} className="btn btn-primary mt-4">Go Back</button>
            </div>
        );
    }

    const policyData = { policyId, premiumAmount, paymentFrequency, policyName };

    return (
        <div className="container mx-auto md:px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
           
                <Elements stripe={stripePromise}>
                    <PaymentForm policyData={policyData}></PaymentForm>
                </Elements>
        </div>
    );
};

export default Payment;