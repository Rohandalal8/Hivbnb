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

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/myBookings');
        setBookings(res.data);
        if (res.ok) {
          setBookings(Array.isArray(data) ? data : []);
        } else {
          // Token obsolete or 401: clear and bounce
          if (res.status === 401) {
             await logout();
             navigate('/login');
          }
          setBookings([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
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

  const getProductName = (product) => {
    if (typeof product.productId === 'object' && product.productId?.name) {
      return product.productId.name;
    }

    return product.name || 'Product';
  };

  if (!user) return null;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ marginBottom: '10px' }}>My Profile</h2>
          <p style={{ color: '#80808b', fontSize: '1rem', marginBottom: '5px' }}>Name: {user.name}</p>
          <p style={{ color: '#80808b', fontSize: '1rem', whiteSpace: 'nowrap' }}>Email: {user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', boxShadow: 'none' }}>Logout</button>
      </div>

      <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Booking History</h3>
      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <div style={{ padding: '30px', borderRadius: '4px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#80808b', marginBottom: '15px' }}>You haven't made any bookings yet.</p>
          <Link to="/bnb" className="btn">Start Booking</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(booking => (
            <div key={booking._id} style={{ padding: '20px', borderRadius: '4px', border: '1px solid #27272a', display: 'flex',  justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <div style={{ color: '#80808b', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                  <span>Products:</span>
                  <div style={{ display: 'grid', gap: '2px' }}>
                    {(booking.products || []).map((product) => (
                      <span key={product._id || product.productId?._id || product.productId} style={{ color: '#fff' }}>
                        {getProductName(product)} x {product.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(booking.createdAt).toLocaleDateString('en-GB')}</span></p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Total: <span style={{ color: '#fff' }}>${formatBookingTotal(booking)}</span></p>
              </div>
              <div>
                <span style={{ 
                  background: booking.status === 'delivered' ? 'rgba(16,185,129,0.1)' : booking.status === 'shipped' ? 'rgba(59,130,246,0.1)' : booking.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(255,0,0,0.1)',
                  color: booking.status === 'delivered' ? '#10b981' : booking.status === 'shipped' ? '#3b82f6' : booking.status === 'pending' ? '#f59e0b' : '#ff0000',
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
