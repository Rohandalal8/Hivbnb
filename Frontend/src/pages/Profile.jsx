import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import api from '../api/axios';

const Profile = () => {
  const { user, authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/myBookings');
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          await logout();
          navigate('/login');
        }
        setBookings([]);
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

    fetchProfile();
    fetchMyBookings();
  }, [user, navigate, logout]);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully!');
    navigate('/login');
  };

  const formatBookingTotal = (booking) => {
    const total = booking.totalPrice ?? booking.totalAmount;
    return typeof total === 'number' ? total.toFixed(2) : '0.00';
  };

  if (!user) return null;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ marginBottom: '10px' }}>My Profile</h2>
          <p style={{ fontSize: '1rem', marginBottom: '5px' }}>Name: {profile?.name}</p>
          <p style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>Email: {profile?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', boxShadow: 'none' }}>Logout</button>
      </div>

      <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Booking History</h3>
      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <div style={{ padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#80808b', marginBottom: '15px' }}>You haven't made any bookings yet.</p>
          <Link to="/bnb" className="btn">Start Booking</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(booking => (
              <div key={booking._id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <p>
                      Listing:
                      <span>
                        {" "}
                        {booking.listingId?.name}
                      </span>
                    </p>
                    <p>
                      Check In:
                      <span>
                        {" "}
                        {new Date(booking.checkIn).toLocaleDateString('en-GB')}
                      </span>
                    </p>

                    <p>
                      Check Out:
                      <span>
                        {" "}
                        {new Date(booking.checkOut).toLocaleDateString('en-GB')}
                      </span>
                    </p>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span>{new Date(booking.createdAt).toLocaleDateString('en-GB')}</span></p>
                  <p style={{ fontSize: '0.9rem' }}>Total: <span>₹{formatBookingTotal(booking)}</span></p>
                </div>
                <div>
                  <span style={{
                    background: booking.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : booking.status === 'pending' ? 'rgba(59,130,246,0.1)' : 'rgba(255,0,0,0.1)',
                    color: booking.status === 'confirmed' ? '#10b981' : booking.status === 'pending' ? '#3b82f6' : '#ff0000',
                    padding: '8px 16px', borderRadius: '4px'
                  }}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
