import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/listing.css";

const HostListingCard = ({ listing, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await api.delete(`/listings/${id}`);
                onDelete(id); // Notify parent component to remove the listing from state
                toast.success("Listing deleted successfully.");
            } catch (error) {
                console.error("Error deleting listing:", error);
                toast.error("Failed to delete listing.");
            }
        }
    }

    const discountedPrice = listing.price - (listing.price * listing.discount / 100);

    return (
            <div className="shop-listing-card">
                <img src={listing.imageUrls?.[0]} alt={listing.name} className="shop-listing-image" />
                <div className="listing-info">
                    <p style={{ color: '#000' }}>{listing.name} in {listing.city} <span style={{ position: 'absolute', right: '7px' }}>★ {listing.avgRating.toFixed(1)}({listing.numReviews})</span></p>
                    <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.description}</p>
                    <p style={{ fontSize: '0.8rem' }}> {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} bathrooms</p>
                    {listing.discount > 0 ? (
                        <p style={{ color: '#000' }}>
                            ₹{discountedPrice.toFixed(2) * 2} <span style={{ color: '#80808b' }}>for 2 nights</span>
                        </p>
                    ) : (
                        <p style={{ color: '#000' }}>
                            ₹{listing.price.toFixed(2) * 2} <span style={{ color: '#80808b' }}>for 2 nights</span>
                        </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                        <button className="btn" style={{ width: '100%', marginRight: '10px' }} onClick={(e) => {navigate(`/edit-listing/${listing._id}`)}}>
                            Edit
                        </button>
                        <button className="empty-btn" style={{ width: '100%' }} onClick={(e) => {handleDelete(listing._id)}}>
                            Delete
                        </button>
                    </div>
                    <Link to={`/listing/${listing._id}`} style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                    View Details
                    </Link>
                </div>
            </div>
    );
}

export default HostListingCard;