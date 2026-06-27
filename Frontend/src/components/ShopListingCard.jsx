import { Link } from "react-router-dom";
import "../styles/listing.css";

const ShopListingCard = ({ listing }) => {

    const discountedPrice = listing.price - (listing.price * listing.discount / 100);

    return (
        <Link to={`/listing/${listing._id}`}>
            <div className="shop-listing-card">
                <img src={listing.imageUrls?.[0]} alt={listing.name} className="shop-listing-image" />
                <div className="listing-info">
                    <p style={{color: '#000'}}>{listing.name} in {listing.city} <span style={{ position: 'absolute', right: '7px' }}>★ {listing.avgRating.toFixed(1)}({listing.numReviews})</span></p>
                    <p style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{listing.description}</p>
                    <p>{listing.bedrooms} bedrooms | {listing.beds} beds | {listing.bathrooms} bathrooms</p>
                    {listing.discount > 0 ? (
                            <p style={{color: '#000'}}>
                                ₹{discountedPrice.toFixed(2) * 2} <span style={{color: '#80808b'}}>for 2 nights</span>
                            </p>
                    ) : (
                        <p style={{color: '#000'}}>
                            ₹{listing.price.toFixed(2) * 2} <span style={{color: '#80808b'}}>for 2 nights</span>
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ShopListingCard;