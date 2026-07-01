import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import HostListingCard from '../components/HostListingCard';
import Loader from '../components/Loader';
import api from '../api/axios';
import '../styles/home.css';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user, authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Wait until auth state is determined

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await api.get('/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await api.get('/bookings/profile');
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListings();
    fetchProfile();

  }, [user, authLoading, navigate]);

  useEffect(() => {
    if(!profile) return;

    if (profile.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [profile, navigate]);


  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader />
      </div>
    );
  }

  const handleDeleteListing = (id) => {
    setListings(listings.filter(listing => listing._id !== id));
  }

  const matchesSearch = listings.filter((listing) => {
    return listing.city.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/admin-dashboard"><h2>All Listings</h2></Link>
        <Link to="/admin-bookings"><h2>All Bookings</h2></Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search City..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader />
        </div>
      ) : (
        <div className="listing-grid" style={{ flexWrap: 'wrap' }}>
          {matchesSearch.map((listing) => (
            <HostListingCard key={listing._id} listing={listing} onDelete={handleDeleteListing} />
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
