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
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Complete Your Payment</h1>
                <Elements stripe={stripePromise}>
                    <PaymentForm policyData={policyData}></PaymentForm>
                </Elements>
            </div>
        </div>
    );
};

export default Payment;