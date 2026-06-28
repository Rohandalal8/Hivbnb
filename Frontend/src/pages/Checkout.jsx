import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import api from '../api/axios';
import '../styles/home.css';

const Checkout = () => {
    const { user, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const location = useLocation();

    const booking = location.state?.booking || [];

    const discountedPrice = booking?.listing?.discount > 0 ? booking?.listing.price - (booking?.listing.price * booking?.listing.discount) / 100 : booking?.listing?.price;
    const platformFee = 0.1 * discountedPrice * booking?.nights;
    const totalAmount = discountedPrice * booking?.nights + platformFee;

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined
    }, [authLoading]);

    if (isPaying) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Processing Payment...</h2>
                <p>Please do not close or refresh the page</p>
            </div>
        );
    }

    const handlePayment = async () => {
        setIsPaying(true);
        try {

            if (!user) {
                toast.info("You need to be logged in to make a payment.");
                navigate("/login");
                return;
            }

            const response = await api.post('/payment/order', { 
                listingId: booking.listing._id,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut
             });
            const data = response.data;

            if (!data || !data.id) {
                toast.error("Invalid response from server. Please try again later.");
                setIsPaying(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Hivbnb",
                description: "Booking Payment",
                order_id: data.id,

                handler: async function (response) {
                    const verifyResponse = await api.post('/payment/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyResponse.data.success) {
                        const saveBookingResponse = await api.post('/bookings', {
                            listingId: booking.listing._id,
                            checkIn: booking.checkIn,
                            checkOut: booking.checkOut,
                            totalPrice: totalAmount,
                            paymentId: response.razorpay_payment_id
                         });

                        if (saveBookingResponse.data.success) {
                            navigate("/booking-success");
                        } else {
                            toast.error("Booking failed.");
                            setIsPaying(false);
                        }
                    } else {
                        toast.error("Payment verification failed.");
                        setIsPaying(false);
                    }
                }, 

                modal: {
                    ondismiss: function () {
                        toast.info("Payment cancelled.");
                        setIsPaying(false);
                    }
                },

                prefill: {
                    name: user.name,
                    email: user?.email,
                    contact: user?.phone || '',
                },
                theme: {
                    color: "#fe424d"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation error:", error);
            toast.error("Payment initiation failed. Please try again.");
            setIsPaying(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '20px', marginTop: '50px' }}>
            <div className="checkout-listing-info">
                <img src={booking?.listing?.imageUrls[0]} alt={booking?.listing?.name} className="info-image" />
                <h2>{booking?.listing?.name} in {booking?.listing?.city}</h2>
            </div>
            <div className="dates-info">
                <h2>Booking Dates</h2>
                <p>
                    <span>Check-in: </span><span>{new Date(booking.checkIn).toDateString()}</span>
                </p>
                <p>
                    <span>Check-out: </span><span>{new Date(booking.checkOut).toDateString()}</span>
                </p>
            </div>
            <div className="price-info">
                <h2>Price details</h2>
                <p><span>{booking?.nights} nights X ₹{discountedPrice.toFixed(2)}</span><span>₹{(discountedPrice * booking?.nights).toFixed(2)}</span></p>
                <p><span>Platform Fee </span><span>₹{platformFee.toFixed(2)}</span></p>
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}><span>Total: </span><span>₹{totalAmount.toFixed(2)}</span></h3>
            <button className="btn" style={{ width: '100%' }} onClick={handlePayment}>Pay Now</button>
        </div>
    );
}

export default Checkout;
