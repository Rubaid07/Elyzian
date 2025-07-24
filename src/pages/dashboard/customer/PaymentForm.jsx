import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

const PaymentForm = () => { 
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); 
    const navigate = useNavigate(); 
    const location = useLocation();
    const { id: urlApplicationId } = useParams();
    const statePolicyData = location.state; 
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);
    const premiumAmount = statePolicyData?.premiumAmount || 0;
    const amountForStripe = parseFloat(premiumAmount);

    useEffect(() => {
        if (amountForStripe > 0) {
            axiosSecure.post('/create-payment-intent', { price: amountForStripe })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.log(err);
                    setError("Failed to initialize payment. Please try again.");
                    toast.error('Payment initialization failed');
                });
        }
    }, [axiosSecure, amountForStripe]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            setProcessing(false);
            return;
        }

        try {
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (paymentMethodError) {
                throw paymentMethodError;
            }

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || 'anonymous',
                        name: user?.displayName || 'anonymous',
                    },
                },
            });

            if (confirmError) {
                throw confirmError;
            }

            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);
                const payment = {
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    premiumAmount: amountForStripe,
                    applicationId: urlApplicationId, 
                    policyId: statePolicyData.policyId,
                    policyName: statePolicyData.policyName,
                    paymentFrequency: statePolicyData.paymentFrequency, 
                    paymentDate: new Date(),
                    status: 'Paid',
                };

                const res = await axiosSecure.post('/payments', payment);
                
                if (res.data.transactionResult?.insertedId && res.data.applicationUpdateResult?.matchedCount > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Payment Successful!",
                        html: `
                            <div class="text-center">
                                <div class="text-green-500 text-5xl mb-4">
                                    <FaCheckCircle />
                                </div>
                                <p class="text-lg">Your payment of BDT ${amountForStripe.toLocaleString()} was successful!</p>
                                <p class="text-sm text-gray-600 mt-2">Transaction ID: ${paymentIntent.id}</p>
                            </div>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                        willClose: () => navigate('/dashboard/payment-status')
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Payment Processed',
                        text: 'Your payment was successful but there was an issue updating your policy status.',
                        confirmButtonText: 'Continue',
                        willClose: () => navigate('/dashboard/payment-status')
                    });
                }
            }
        } catch (error) {
            console.log('Payment error:', error);
            setError(error.message);
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                html: `
                    <div class="text-center">
                        <div class="text-red-500 text-5xl mb-4">
                            <MdError />
                        </div>
                        <p class="text-lg">${error.message || 'Payment could not be processed'}</p>
                        <p class="text-sm text-gray-600 mt-2">Please try again or contact support</p>
                    </div>
                `,
                confirmButtonText: 'Try Again'
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
                <p className="text-gray-600">Secure payment processed through Stripe</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 ">
                    Policy Payment Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Policy Name</p>
                        <p className="font-medium">{statePolicyData?.policyName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Frequency</p>
                        <p className="font-medium">{statePolicyData?.paymentFrequency || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Premium Amount</p>
                        <p className="font-medium text-blue-600">BDT {statePolicyData?.premiumAmount?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Application ID</p>
                        <p className="font-mono text-sm">{urlApplicationId || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaCreditCard className="mr-2 text-blue-600" />
                        Card Details
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                        padding: '10px',
                                    },
                                    invalid: {
                                        color: '#e53e3e',
                                    },
                                },
                                hidePostalCode: true
                            }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center text-red-700">
                            <MdError className="mr-2" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {transactionId && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex items-center text-green-700">
                            <FaCheckCircle className="mr-2" />
                            <span>Payment successful! Transaction ID: {transactionId}</span>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        className={`w-full btn btn-primary py-3 px-6 rounded-lg font-medium shadow-sm ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={!stripe || !clientSecret || processing}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                               <span className="loading loading-spinner loading-sm"></span>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <FaLock className="mr-2" />
                                Pay BDT {premiumAmount.toLocaleString()}
                            </span>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 mt-3 flex items-center">
                        <FaLock className="mr-1" />
                        Your payment is secured with 256-bit encryption
                    </p>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;