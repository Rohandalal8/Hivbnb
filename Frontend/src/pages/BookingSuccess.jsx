import React from 'react';
import { Link } from 'react-router-dom';

const BookingSuccess = () => {
    const containerStyle = {
        width: '95%',
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px', color: '#10b981' }}>Payment Successful!</h2>
            <p style={{ color: '#80808b', marginBottom: '40px' }}>
            Thank you for your booking. Booking request has been sent to the host. You will receive a confirmation once the host approves your booking.
            </p>
            <Link to="/bnb" className="btn">Continue</Link>
        </div>
    );
};

export default BookingSuccess;
