import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
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
    const premiumAmount = statePolicyData?.premiumAmount || 0;
    const amountForStripe = parseFloat(premiumAmount);

    useEffect(() => {
        if (amountForStripe > 0) {
            axiosSecure.post('/create-payment-intent', { price: amountForStripe })
                .then(res => {
                    console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Error creating payment intent:", err);
                    setError("Failed to initialize payment. Please try again.");
                });
        }
    }, [axiosSecure, amountForStripe]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('Payment method error', error);
            setError(error.message);
        } else {
            console.log('Payment method', paymentMethod);
            setError('');
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
            console.log('Confirm error', confirmError);
            setError(confirmError.message);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed!',
                text: confirmError.message || 'There was an issue processing your payment.',
            });
        } else {
            console.log('Payment Intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                console.log('Transaction Id', paymentIntent.id);
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
                console.log('Payment data being sent:', payment);
                try {
                    const res = await axiosSecure.post('/payments', payment);
                    console.log('Payment saved to DB and application status updated:', res.data);
                    if (res.data.transactionResult?.insertedId && res.data.applicationUpdateResult?.matchedCount > 0) {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Payment Successful!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        toast.success('Policy status updated to Paid!');
                        navigate('/dashboard/payment-status');
                    } else {
                         Swal.fire({
                            icon: 'warning',
                            title: 'Payment Saved, But Status Not Fully Updated',
                            text: res.data.message || 'There was an issue updating the policy status. Please check dashboard.',
                        });
                    }
                } catch (error) {
                    console.error('Error saving payment to DB or updating policy status:', error);
                    toast.error('Payment failed or status update error!');
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Processing Error!',
                        text: error.response?.data?.message || 'An unexpected error occurred while saving payment or updating status.',
                    });
                }
            }
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-4">Pay for: {statePolicyData?.policyName || 'Policy'}</h3>
                <p className="mb-2">Premium Amount: ৳ {statePolicyData?.premiumAmount?.toLocaleString() || 'N/A'}</p>
                <p className="mb-4">Payment Frequency: {statePolicyData?.paymentFrequency || 'N/A'}</p>

                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className="btn btn-sm btn-primary my-4" type="submit" disabled={!stripe || !clientSecret}>
                    Pay BDT {premiumAmount}
                </button>
                <p className="text-red-600">{error}</p>
                {transactionId && <p className="text-green-600">Your transaction Id: {transactionId}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;