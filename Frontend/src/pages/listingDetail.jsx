import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/authContext';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Loader from '../components/Loader';
import ListingMap from '../components/ListingMap';
import api from '../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/listing.css';

const ListingDetail = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [addReview, setAddReview] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [checkIn, setCheckIn] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Default to tomorrow
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // Default to 3 days later
    const [wishlistIds, setWishlistIds] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const navigate = useNavigate();

    const fetchListing = useCallback(async () => {
        try {
            const response = await api.get(`/listings/${id}`);
            const data = await response.data;
            setListing(data);
            setCurrentImage(data.imageUrls?.[0] ? 0 : -1);
        } catch (error) {
            console.error('Error fetching listing:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (user) {
                try {
                    const response = await api.get("/listings/wishlist");
                    setWishlistIds(response.data.map(listing => listing._id));
                } catch (error) {
                    console.error("Error fetching wishlist:", error);
                }
            }
        }

        const fetchBookedDates = async () => {
            try {
                const response = await api.get(`/bookings/unavailable/${id}`);
                setBookedDates(response.data);
            } catch (error) {
                console.error("Error fetching booked dates:", error);
            }
        };

        fetchListing();
        fetchWishlist();
        fetchBookedDates();
    }, [fetchListing, user, id]);

    const excludedDates = [];

    bookedDates.forEach((booking) => {
        let current = new Date(booking.checkIn);

        while (current <= new Date(booking.checkOut)) {
            excludedDates.push(new Date(current));

            current = new Date(current);
            current.setDate(current.getDate() + 1);
        }
    });

    const checkInDisabledDates = [];

    bookedDates.forEach((booking) => {
        const blocked = new Date(booking.checkIn);

        blocked.setDate(blocked.getDate() - 1);

        checkInDisabledDates.push(blocked);
    });

    useEffect(() => {
        if (!bookedDates.length) return;

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() + 1);

        while (true) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 2);
            let conflict = false;
            let current = new Date(startDate);

            while (current <= endDate) {
                const booked = excludedDates.some(
                    date =>
                        date.toDateString() ===
                        current.toDateString()
                );

                if (booked) {
                    conflict = true;
                    break;
                }

                current.setDate(current.getDate() + 1);
            }

            if (!conflict) {
                setCheckIn(new Date(startDate));
                setCheckOut(new Date(endDate));
                break;
            }

            startDate.setDate(startDate.getDate() + 1);
        }

    }, [bookedDates]);

    const getMaxCheckoutDate = () => {
        if (!checkIn) return null;

        let current = new Date(checkIn);
        for (let i = 0; i < 365; i++) {
            current.setDate(current.getDate() + 1);

            const isBlocked = excludedDates.some(
                d => d.toDateString() === current.toDateString()
            );

            if (isBlocked) {
                const maxDate = new Date(current);
                maxDate.setDate(maxDate.getDate() - 1);
                return maxDate;
            }
        }

        return current;
    };

    const nextImage = () => {
        if (currentImage < listing.imageUrls.length - 1) {
            setCurrentImage(currentImage + 1);
        }
    };

    const prevImage = () => {
        if (currentImage > 0) {
            setCurrentImage(currentImage - 1);
        }
    };

    const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;

        if (distance > minSwipeDistance && currentImage < listing.imageUrls.length - 1) {
            nextImage();
        }

        if (distance < -minSwipeDistance && currentImage > 0) {
            prevImage();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/listings/${listing._id}/reviews`, {
                rating,
                comment
            });
            const data = await response.data;
            if (response.status === 201) {
                toast.success('Review submitted successfully!');
                setAddReview(false);
                fetchListing(); // Refetch listing to get updated reviews and ratings
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const isWishlisted = listing && wishlistIds.includes(listing._id);

    const handlewishlist = async (e) => {
        if (!listing) return;
        try {
            const response = await api.put(`/listings/wishlist`, { listingId: listing._id });

            if (isWishlisted) {
                setWishlistIds(wishlistIds.filter(id => id !== listing._id));
            } else {
                setWishlistIds([...wishlistIds, listing._id]);
            }
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        } catch (error) {
            if (error.response?.status === 401) {
                toast.info("Please login to add to wishlist");
            } else {
                toast.error("Failed to update wishlist");
            }
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))); // Ensure at least 1 night
    const discountedPrice = listing?.price - ((listing?.price * listing?.discount) / 100);

    useEffect(() => {
        if (!checkIn || !checkOut) return;

        const maxDate = getMaxCheckoutDate();

        if (checkOut > maxDate) {
            setCheckOut(maxDate);
        }
    }, [checkIn, excludedDates]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;

    if (!listing) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Listing not found.</div>;

    return (
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '15px' }}>

            <div style={{ filter: addReview ? 'blur(4px)' : 'none', pointerEvents: addReview ? 'none' : 'auto' }}>
                <div className="image-slider" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    <div className="wishlist-icon" onClick={handlewishlist}>
                        {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
                    </div>
                    {currentImage > 0 && (
                        <button className="arrow left" onClick={prevImage}>
                            ❮
                        </button>
                    )}

                    <img src={listing.imageUrls?.[currentImage]} alt={listing.name} className="main-image" />

                    {currentImage < listing.imageUrls.length - 1 && (
                        <button className="arrow right" onClick={nextImage}>
                            ❯
                        </button>
                    )}

                    <div className="dots">
                        {listing.imageUrls.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentImage === index ? 'active-dot' : ''}`}
                                onClick={() => setCurrentImage(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="listing-detail" style={{ filter: addReview ? 'blur(4px)' : 'none', pointerEvents: addReview ? 'none' : 'auto' }}>
                <div className="detail-info">
                    <h2 style={{ fontSize: '1.5rem' }}>{listing.name} in {listing.city}, {listing.country}</h2>
                    <p>{listing.guests} {listing.guests > 1 ? 'guests' : 'guest'} · {listing.bedrooms} {listing.bedrooms > 1 ? 'bedrooms' : 'bedroom'} · {listing.beds} {listing.beds > 1 ? 'beds' : 'bed'} · {listing.bathrooms} {listing.bathrooms > 1 ? 'bathrooms' : 'bathroom'}</p>
                    <p>{listing.avgRating.toFixed(1)} ★ {listing.numReviews}</p>
                    <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #a1a1aa2c', paddingBottom: '10px' }}>Hosted by {listing.ownerId?.name}</h2>
                    <p style={{ marginTop: '10px', borderBottom: '1px solid #a1a1aa2c', paddingBottom: '10px' }}>{listing.description}</p>
                    <p style={{ marginTop: '10px' }}>Where you will be:</p>
                    <ListingMap coordinates={listing.geometry?.coordinates} name={listing.name} />

                    <div style={{ borderTop: '1px solid #a1a1aa2c', paddingTop: '10px' }}>
                        <h4 style={{ marginBottom: '5px' }}>Customer Reviews : {listing.avgRating.toFixed(1)} ★</h4>
                        <p>Based on {listing.numReviews} customer ratings</p>
                    </div>

                    <button onClick={() => setAddReview(true)} disabled={!user} className="btn" style={{ width: '50%', opacity: !user ? 0.5 : 1, cursor: !user ? 'not-allowed' : 'pointer' }}>
                        {user ? 'Add Review' : 'Login to Review'}
                    </button>

                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Recent Reviews</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                            {listing?.reviews?.length > 0 ? (
                                (showAllReviews
                                    ? listing.reviews
                                    : listing.reviews.slice(0, 5)
                                ).map((review) => (
                                    <div
                                        key={review._id}
                                        className="review-card"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                            <h3 style={{ marginBottom: '0px' }}>
                                                {review.userId?.name}
                                            </h3>

                                            <span style={{ color: '#87878e', fontSize: '0.7rem' }}>
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star}>
                                                    {star <= review.rating ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>

                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet</p>
                            )}
                        </div>

                        {listing?.reviews?.length > 5 && (
                            <div
                                style={{ marginTop: '10px', cursor: 'pointer', color: '#1542f7' }}
                                onClick={() => setShowAllReviews(!showAllReviews)}
                            >
                                {showAllReviews ? 'Show Less' : 'Show All Reviews'}
                            </div>
                        )}
                    </div>

                </div>
                <div className="detail-price">
                    {listing.discount > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                            <span className="product-discounted-price" style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: '#80808b' }}>
                                ₹{listing.price * nights}
                            </span>
                            <span className="product-price" style={{ fontSize: '1.25rem' }}>
                                ₹{discountedPrice * nights}
                            </span>
                            <span className="product-discount" style={{ fontSize: '1rem', color: '#80808b' }}>
                                for {nights} {nights > 1 ? 'nights' : 'night'}
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                            <span className="product-price" style={{ fontSize: '1.25rem' }}>
                                ₹{listing.price * nights}
                            </span>
                            <span className="product-discount" style={{ fontSize: '1rem', color: '#80808b' }}>
                                for {nights} {nights > 1 ? 'nights' : 'night'}
                            </span>
                        </div>
                    )}
                    <div style={{ display: 'flex', marginTop: '10px', border: '1px solid #000', borderRadius: '12px', fontSize: '0.8rem' }}>
                        <div style={{ width: '50%', borderRight: '1px solid #000', padding: '10px' }}>
                            <p>CHECK-IN</p>
                            <DatePicker
                                selected={checkIn}
                                onChange={(date) => {
                                    setCheckIn(date);
                                    if (date >= checkOut) {
                                        setCheckOut(new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000)); // Set check-out to 2 days later
                                    }
                                }}
                                minDate={tomorrow}
                                excludeDates={[...excludedDates, ...checkInDisabledDates]}
                                dateFormat="dd/MM/yyyy"
                                className="date-picker-input"
                            />
                        </div>
                        <div style={{ width: '50%', padding: '10px' }}>
                            <p>CHECKOUT</p>
                            <DatePicker
                                selected={checkOut}
                                onChange={(date) => setCheckOut(date)}
                                minDate={new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)} // At least 1 day after check-in
                                excludeDates={excludedDates}
                                maxDate={getMaxCheckoutDate()}
                                dateFormat="dd/MM/yyyy"
                                className="date-picker-input"
                            />
                        </div>
                    </div>
                    <p style={{ color: '#80808b', fontSize: '0.8rem', padding: '5px' }}>Max {listing.guests} {listing.guests > 1 ? 'guests' : 'guest'} capacity</p>
                    <button className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => {
                        if (!user) {
                            toast.error('Please login to reserve this listing');
                            navigate('/login');
                        } else {
                            navigate(`/checkout`, {
                                state: {
                                    booking: {
                                        listingId: listing._id,
                                        listing: listing,
                                        checkIn,
                                        checkOut,
                                        nights
                                    }
                                }
                            });
                        }
                    }}>
                        Reserve
                    </button>

                </div>
            </div>

            {
                addReview && (
                    <div className="auth-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <h2>Submit Review</h2>

                            <h2 onClick={() => setAddReview(false)} style={{ position: 'absolute', right: 20, cursor: 'pointer' }}>X</h2>

                            <div>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setRating(star)}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '2rem',
                                            color: '#fbbf24'
                                        }}
                                    >
                                        {star <= rating ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>

                            <textarea
                                placeholder="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />

                            <button className="btn" type="submit" disabled={!rating || !comment} style={{ opacity: (!rating || !comment) ? 0.5 : 1, cursor: (!rating || !comment) ? 'not-allowed' : 'pointer' }}>Submit Review</button>
                        </form>
                    </div>
                )
            }
        </div >


    );
}

export default ListingDetail;