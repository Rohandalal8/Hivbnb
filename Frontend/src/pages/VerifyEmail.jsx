import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();

                if (auth.currentUser.emailVerified) {
                    const pendingRegistration = sessionStorage.getItem('pendingRegistration');

                    if (pendingRegistration) {
                        const { name } = JSON.parse(pendingRegistration);
                        await auth.currentUser.getIdToken(true);
                        await api.post('/auth/register', {
                            name,
                            email: auth.currentUser.email
                        });
                        sessionStorage.removeItem('pendingRegistration');
                    }

                    toast.success('Email Verified Successfully!');
                    clearInterval(interval);
                    navigate('/');
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    const resendEmail = async () => {
        try {
            setLoading(true);

            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);

                toast.success(
                    'Verification email sent. Check Inbox or Spam folder.'
                );
            }
        } catch (error) {
            console.error(error);
            switch (error.code) {
                case 'auth/too-many-requests':
                    toast.error('Too many requests. Please try again later.');
                    break;

                case 'auth/network-request-failed':
                    toast.error('Network error. Check your internet connection.');
                    break;

                case 'auth/user-not-found':
                    toast.error('User not found. Please register first.');
                    break;

                default:
                    toast.error('Failed to send verification email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px'}}>
            <div >
                <h2>Verify Your Email</h2>

                <p style={{ color: '#000000c4', fontSize: '0.9rem', margin: '10px 0'}}>
                    We have sent a verification link to: <span style={{ color: '#000' }}>{auth.currentUser?.email}</span>
                </p>

                <p style={{ color: '#000000c4', fontSize: '0.9rem', margin: '10px 0'}}>
                    Please check your Inbox or Spam folder and click the verification link.
                </p>

                <button className="btn" onClick={resendEmail} disabled={loading}>
                    {loading ? 'Sending...' : 'Resend Verification Email'}
                </button>
            </div>
        </div>
    );

};

export default VerifyEmail;
