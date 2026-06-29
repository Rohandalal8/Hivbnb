import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import HostListingCard from "../components/HostListingCard";
import api from "../api/axios";
import "../styles/home.css";

const HostDashboard = () => {
    const { user, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate("/login");
            toast.info("Please log in to view your dashboard.");
        }

        const fetchListings = async () => {
            try {
                const response = await api.get("/listings/my-listings");
                setListings(response.data);
            } catch (error) {
                console.error("Error fetching listings:", error);
                toast.error("Failed to fetch your listings.");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </div>
        );
    }

    if (!listings || listings.length === 0) {
        return (
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px', textAlign: 'center' }}>
                <p>You don't have any listings yet. <Link to="/add-listing">Add your first listing</Link>.</p>
            </div>
        );
    }

    const handleDeleteListing = (id) => {
        setListings(listings.filter(listing => listing._id !== id));
    }

    return (
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '15px' }}>
            <button className="btn" style={{ marginBottom: '20px' }} onClick={() => navigate('/add-listing')}>
                + Add Listing
            </button>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <Link to="/host-dashboard"><h2>Your Listings</h2></Link>
            <Link to="/host-bookings"><h2>Your Bookings</h2></Link>
            </div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Loader />
                </div>
            ) : (
                <div className="listing-grid" style={{ flexWrap: 'wrap' }}>
                    {listings.map((listing) => (
                        <HostListingCard key={listing._id} listing={listing} onDelete={handleDeleteListing} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostDashboard;