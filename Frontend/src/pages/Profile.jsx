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

  const cancelBooking = async (bookingId) => {
    if (window.confirm(`Are you sure you want to cancel this booking? you will only get 50% refund if you cancel the booking.`)) {
      try {
        const response = await api.put(`/bookings/user-cancel/${bookingId}`, { status: 'cancelled' });
        const updatedBooking = response.data;
        setBookings(prev =>
          prev.map(booking =>
            booking._id === bookingId
              ? {
                ...booking,
                status: 'cancelled'
              }
              : booking
          )
        );
        toast.success('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error updating booking status:', error);
        toast.error('Failed to update booking status.');
      }
    }
  };

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
          {profile?.role === 'admin' && (
            <button className="btn" style={{ marginTop: '10px' }} onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</button>
          )}
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

                <div style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <p>Listing: {booking.listingId?.name}</p>
                  <p>Check In: {new Date(booking.checkIn).toLocaleDateString('en-GB')}</p>
                  <p>Check Out: {new Date(booking.checkOut).toLocaleDateString('en-GB')}</p>
                  <p>Placed On: {new Date(booking.createdAt).toLocaleDateString('en-GB')}</p>
                  <p>Total: ₹{formatBookingTotal(booking)}</p>
                  {booking.status === 'cancelled' && (
                    <p style={{ color: '#ef4444' }}>Cancelled By: {booking.cancelledBy === 'user' ? 'You' : booking.cancelledBy === 'host' ? 'Host' : 'Auto Cancelled'}</p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{
                    background: booking.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : booking.status === 'pending' ? 'rgba(59,130,246,0.1)' : 'rgba(255,0,0,0.1)',
                    color: booking.status === 'confirmed' ? '#10b981' : booking.status === 'pending' ? '#3b82f6' : '#ff0000',
                    padding: '8px 16px', borderRadius: '12px'
                  }}>
                    {booking.status}
                  </span>
                  {booking.status !== 'cancelled' && new Date() < new Date(booking.checkIn) && (
                    <button className="btn" onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
