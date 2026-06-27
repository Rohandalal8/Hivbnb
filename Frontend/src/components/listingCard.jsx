import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify"; 
import api from "../api/axios";
import "../styles/listing.css";

const ListingCard = ({ listing, wishlistIds, setWishlistIds }) => {
    const isWishlisted = wishlistIds?.includes(listing._id);

    const handlewishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await api.put(`/listings/wishlist`, { listingId: listing._id });
            if (isWishlisted) {
                setWishlistIds(wishlistIds.filter(id => id !== listing._id));
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
            <div className="listing-card">
                <div className="wishlist-icon" onClick={handlewishlist}>
                    {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
                </div>
                <img src={listing.imageUrls?.[0]} alt={listing.name} className="listing-image" />
                <div className="listing-info">
                    <p style={{color: '#000'}}>{listing.name} in {listing.city}</p>
                    {listing.discount > 0 ? (
                            <p>
                                ₹{discountedPrice.toFixed(2) * 2} for 2 nights ★ {listing.avgRating.toFixed(1)}
                            </p>
                    ) : (
                        <p>
                            ₹{listing.price.toFixed(2) * 2} for 2 nights ★ {listing.avgRating.toFixed(1)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;