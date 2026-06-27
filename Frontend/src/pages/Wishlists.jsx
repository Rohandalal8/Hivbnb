import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast } from 'react-toastify';
import ShopListingCard from '../components/ShopListingCard';
import Loader from '../components/Loader';
import api from '../api/axios';
import '../styles/home.css';

const Wishlists = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, authLoading } = useContext(AuthContext);
    const [wishlistIds, setWishlistIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate("/login");
            toast.info("Please log in to view your wishlist.");
        }
        const fetchListings = async () => {
            try {
                const response = await api.get('/listings/wishlist');
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching wishlists:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchWishlist = async () => {
            if (user) {
                try {
                    const response = await api.get("/listings/wishlist");
                    setWishlistIds(response.data.map(listing => listing._id));
                } catch (error) {
                    console.error("Error fetching wishlist:", error);
                }
            }
        };

        fetchListings();
        fetchWishlist();
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </div>
        );
    }

    const discountedPrice = (price, discount) => {
        return price - (price * discount) / 100;
    }

    return (
        <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '15px' }}>
            <h2 style={{ textAlign: 'center' }}>My Wishlist</h2>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Loader />
                </div>
            ) : (
                <div className="listing-grid" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    {listings.map((listing) => (
                        <ShopListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} setListings={setListings} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Wishlists;
