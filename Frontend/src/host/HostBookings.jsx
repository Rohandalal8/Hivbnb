import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import api from "../api/axios";
import "../styles/home.css";

const HostBookings = () => {
    const { user, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate("/login");
            toast.info("Please log in to view your dashboard.");
            return;
        }

        const fetchOwnerBookings = async () => {
            try {
                const response = await api.get("/bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching owner bookings:", error);
                toast.error("Failed to fetch your bookings.");
            } finally {
                setLoading(false);
            }
        };
        fetchOwnerBookings();
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px', textAlign: 'center' }}>
                <p>You don't have any bookings yet.</p>
            </div>
        );
    }

    const updateStatus = async (bookingId, newStatus) => {
        try {
            const response = await api.put(`/bookings/status/${bookingId}`, { status: newStatus });
            const updatedBooking = response.data;
            setBookings(prev =>
                prev.map(booking =>
                    booking._id === bookingId
                        ? {
                            ...booking,
                            status: newStatus
                        }
                        : booking
                )
            );
            toast.success('Booking status updated successfully!');
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update booking status.');
        }
    };

    const formatBookingTotal = (booking) => {
        const total = booking.totalPrice ?? booking.totalAmount;
        return typeof total === 'number' ? total.toFixed(2) : '0.00';
    };

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
                <div style={{ display: 'grid', gap: '10px' }}>
                    {bookings
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(booking => (
                            <div key={booking._id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>

                                <div style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <p>Booked By: {booking.userId?.name}</p>
                                    <p>Listing: {booking.listingId?.name}</p>
                                    <p>Check In: {new Date(booking.checkIn).toLocaleDateString('en-GB')}</p>
                                    <p>Check Out: {new Date(booking.checkOut).toLocaleDateString('en-GB')}</p>
                                    <p>Placed On: {new Date(booking.createdAt).toLocaleDateString('en-GB')}</p>
                                    <p>Total: ₹{formatBookingTotal(booking)}</p>
                                    {booking.status === 'cancelled' && (
                                        <p style={{ color: '#ef4444' }}>Cancelled By: {booking.cancelledBy === 'user' ? 'user' : booking.cancelledBy === 'host' ? 'You' : 'Auto Cancelled'}</p>
                                    )}
                                </div>

                                <div>
                                    {booking.status === 'pending' && (Date.now() - new Date(booking.createdAt).getTime()) < 24 * 60 * 60 * 1000 ? (
                                        <select value={booking.status} onChange={(e) => updateStatus(booking._id, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.5)', outline: 'none', cursor: 'pointer' }}>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirm</option>
                                            <option value="cancelled">Cancel</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            background: booking.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : booking.status === 'pending' ? 'rgba(59,130,246,0.1)' : 'rgba(255,0,0,0.1)',
                                            color: booking.status === 'confirmed' ? '#10b981' : booking.status === 'pending' ? '#3b82f6' : '#ff0000',
                                            padding: '8px 16px', borderRadius: '12px'
                                        }}>
                                            {booking.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default HostBookings;