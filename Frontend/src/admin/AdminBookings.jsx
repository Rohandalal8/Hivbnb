import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Loader from '../components/Loader';
import api from '../api/axios';
import '../styles/home.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user, authLoading } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/allBookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
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

        fetchBookings();
        fetchProfile();

    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!profile) return;

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

    const formatBookingTotal = (booking) => {
        const total = booking.totalPrice ?? booking.totalAmount;
        return typeof total === 'number' ? total.toFixed(2) : '0.00';
    };

    const formatPlatformFee = (booking) => {
        const total = booking.totalPrice ?? booking.totalAmount;
        if (typeof total !== 'number') return '0.00';

        if (booking.status === 'cancelled' && (booking.cancelledBy === 'host' || booking.cancelledBy === 'system')) {
            return '0.00';
        }

        const platformFee = total - total / 1.1;

        return platformFee.toFixed(2);
    }

    const formatHostEarnings = (booking) => {
        const total = booking.totalPrice ?? booking.totalAmount;
        if (typeof total !== 'number') return '0.00';

        const platformFee = total - total / 1.1;

        if (booking.status === 'cancelled' && (booking.cancelledBy === 'host' || booking.cancelledBy === 'system')) {
            return '0.00';
        } else if (booking.status === 'cancelled' && booking.cancelledBy === 'user') {
            const refundAmount = total * 0.5;
            return (total - platformFee - refundAmount).toFixed(2);
        } else {
            return (total - platformFee).toFixed(2);
        }

    }

    const formatRefundAmount = (booking) => {
        const total = booking.totalPrice ?? booking.totalAmount;

        if (typeof total !== 'number') return '0.00';

        if (booking.cancelledBy === 'user') {
            return (total * 0.5).toFixed(2);
        } else if (booking.cancelledBy === 'host' || booking.cancelledBy === 'system') {
            return total.toFixed(2);
        } else {
            return '0.00';
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        switch (filter) {
            case 'all':
                return true;
            case 'user':
                return booking.status === 'cancelled' && booking.cancelledBy === 'user';
            case 'host':
                return booking.status === 'cancelled' && booking.cancelledBy === 'host';
            case 'auto':
                return booking.status === 'cancelled' && booking.cancelledBy === 'system';
            case 'confirmed':
                return booking.status === 'confirmed';
            default:
                return true;
        }
    });

    return (
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <Link to="/admin-dashboard"><h2>All Listings</h2></Link>
                <Link to="/admin-bookings"><h2>All Bookings</h2></Link>
            </div>
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="search-bar"
                style={{ maxWidth: '200px', marginBottom: '20px' }}
            >
                <option value="all">Filter</option>
                <option value="user">Cancelled By User</option>
                <option value="host">Cancelled By Host</option>
                <option value="auto">Auto Cancelled</option>
                <option value="confirmed">Confirmed</option>
            </select>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Loader />
                </div>
            ) : (
                <div className="scrollbar">
                    <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Booked By</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Listing</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Check In</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Check Out</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Placed On</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Total</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Platform Fee</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Host Earnings</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Refund Amount</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Cancelled By</th>
                                <th style={{ padding: '12px 25px', textAlign: 'left', whiteSpace: 'nowrap' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map(booking => (
                                    <tr key={booking._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{booking.userId?.name}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{booking.listingId?.name}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{new Date(booking.checkIn).toLocaleDateString('en-GB')}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{new Date(booking.checkOut).toLocaleDateString('en-GB')}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{new Date(booking.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>₹{formatBookingTotal(booking)}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>₹{formatPlatformFee(booking)}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>₹{formatHostEarnings(booking)}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{`₹${formatRefundAmount(booking)}`}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>{booking.cancelledBy === 'user' ? 'User' : booking.cancelledBy === 'host' ? 'Host' : booking.cancelledBy === 'system' ? 'Auto Cancelled' : 'N/A'}</td>
                                        <td style={{ padding: '12px 25px', whiteSpace: 'nowrap' }}>
                                            <span style={{
                                                background: booking.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : booking.status === 'pending' ? 'rgba(59,130,246,0.1)' : 'rgba(255,0,0,0.1)',
                                                color: booking.status === 'confirmed' ? '#10b981' : booking.status === 'pending' ? '#3b82f6' : '#ff0000',
                                                padding: '8px 16px', borderRadius: '12px'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
