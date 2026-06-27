import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../styles/listing.css";

const ShopListingCard = ({ listing, wishlistIds, setWishlistIds, setListings }) => {
    const isWishlisted = wishlistIds?.includes(listing._id);

    const handlewishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await api.put(`/listings/wishlist`, { listingId: listing._id });
            if (isWishlisted) {
                setWishlistIds(wishlistIds.filter(id => id !== listing._id));
                if (setListings) {
                    setListings(prev =>
                        prev.filter(item => item._id !== listing._id)
                    );
                }

            } else {
                setWishlistIds([...wishlistIds, listing._id]);
            }
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    const discountedPrice = listing.price - (listing.price * listing.discount / 100);

    return (
        <Link to={`/listing/${listing._id}`}>
            <div className="shop-listing-card">
                <div className="wishlist-icon" onClick={handlewishlist}>
                    {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
                </div>
                <img src={listing.imageUrls?.[0]} alt={listing.name} className="shop-listing-image" />
                <div className="listing-info">
                    <p style={{ color: '#000' }}>{listing.name} in {listing.city} <span style={{ position: 'absolute', right: '7px' }}>★ {listing.avgRating.toFixed(1)}({listing.numReviews})</span></p>
                    <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.description}</p>
                    <p style={{ fontSize: '0.8rem' }}> {listing.bedrooms} {listing.bedrooms > 1 ? 'bedrooms' : 'bedroom'} · {listing.beds} {listing.beds > 1 ? 'beds' : 'bed'} · {listing.bathrooms} {listing.bathrooms > 1 ? 'bathrooms' : 'bathroom'}</p>
                    {listing.discount > 0 ? (
                        <p style={{ color: '#000' }}>
                            ₹{discountedPrice.toFixed(2) * 2} <span style={{ color: '#80808b' }}>for 2 nights</span>
                        </p>
                    ) : (
                        <p style={{ color: '#000' }}>
                            ₹{listing.price.toFixed(2) * 2} <span style={{ color: '#80808b' }}>for 2 nights</span>
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ShopListingCard;