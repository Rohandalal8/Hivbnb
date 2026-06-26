import { Link } from "react-router-dom";
import "../styles/listing.css";

const ListingCard = ({ listing }) => {

    const discountedPrice = listing.price - (listing.price * listing.discount / 100);

    return (
        <Link to={`/product/${listing._id}`}>
            <div className="listing-card">
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