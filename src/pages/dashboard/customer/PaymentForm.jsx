import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../../../component/Loader/Spinner';

const PaymentForm = ({ policyData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); 
    const navigate = useNavigate(); 

   
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const premiumAmountInBDT = policyData?.premiumAmount; 
    const amountForStripe = parseFloat(premiumAmountInBDT); 

    useEffect(() => {
        if (amountForStripe > 0 && !clientSecret) {
            setProcessing(true);
            axiosSecure.post('/create-payment-intent', { price: amountForStripe })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                    setProcessing(false);
                })
                .catch(err => {
                    console.error("Error creating payment intent:", err);
                    setError("Failed to initialize payment. Please try again.");
                    toast.error("Payment initialization failed.");
                    setProcessing(false);
                });
        }
    }, [amountForStripe, axiosSecure, clientSecret]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        if (!stripe || !elements || !clientSecret) {
            setProcessing(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            setProcessing(false);
            return;
        }

        // 1. Create Payment Method
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: {
                email: user?.email || 'anonymous@example.com',
                name: user?.displayName || 'Anonymous User',
            },
        });

        if (pmError) {
            console.log('[error]', pmError);
            setError(pmError.message);
            toast.error(pmError.message);
            setProcessing(false);
            return;
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setError(null);
        }

        // 2. Confirm Card Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || 'anonymous@example.com',
                        name: user?.displayName || 'Anonymous User',
                    },
                },
            }
        );

        if (confirmError) {
            console.log('[confirmError]', confirmError);
            setError(confirmError.message);
            toast.error(confirmError.message);
            setProcessing(false);
            return;
        }

        console.log('Payment Intent:', paymentIntent);

        if (paymentIntent.status === 'succeeded') {
            setTransactionId(paymentIntent.id);
            toast.success('Payment Successful!');

            const payment = {
                email: user?.email,
                transactionId: paymentIntent.id,
                premiumAmount: amountForStripe,
                policyId: policyData.policyId,
                policyName: policyData.policyName,
                paymentFrequency: policyData.paymentFrequency,
                paymentDate: new Date(),
                status: 'Paid'
            };

            try {
                const res = await axiosSecure.post('/payments', payment);
                console.log('Payment saved to DB:', res.data);

                if (res.data.result?.insertedId) {
                    await axiosSecure.patch(`/applications/status/${policyData.policyId}`, { status: 'Paid' });
                    toast.success('Policy status updated to Paid!');
                }
            } catch (dbError) {
                console.error("Error saving payment to DB or updating policy status:", dbError);
                toast.error("Payment successful, but failed to record in database.");
            }

            setProcessing(false);
            navigate('/dashboard/payment-status', { replace: true });
        } else {
            setError(`Payment failed: ${paymentIntent.status}`);
            toast.error(`Payment failed: ${paymentIntent.status}`);
            setProcessing(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card-body">
            <h3 className="text-xl font-bold mb-4">Pay for: {policyData?.policyName || 'Policy'}</h3>
            <p className="mb-2">Premium Amount: ৳ {policyData?.premiumAmount?.toLocaleString() || 'N/A'}</p>
            <p className="mb-4">Payment Frequency: {policyData?.paymentFrequency || 'N/A'}</p>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Card Details</span>
                </label>
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
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {transactionId && <p className="text-green-500 mt-2">Transaction ID: {transactionId}</p>}
            <div className="form-control mt-6">
                <button
                    type="submit"
                    disabled={!stripe || !elements || processing || !clientSecret}
                    className="btn btn-primary"
                >
                    {processing ? <Spinner /> : `Pay ৳ ${policyData?.premiumAmount?.toLocaleString() || 'N/A'}`}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;