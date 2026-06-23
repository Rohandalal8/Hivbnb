import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();

                if (auth.currentUser.emailVerified) {
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
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="verify-card">
                <h2>Verify Your Email</h2>

                <p>
                    We have sent a verification link to:
                </p>

                <strong>
                    {auth.currentUser?.email}
                </strong>

                <p>
                    Please check your Inbox or Spam folder and click
                    the verification link.
                </p>

                <button
                    className="btn"
                    onClick={resendEmail}
                    disabled={loading}
                >
                    {loading
                        ? 'Sending...'
                        : 'Resend Verification Email'}
                </button>
            </div>
        </div>
    );

};

export default VerifyEmail;
