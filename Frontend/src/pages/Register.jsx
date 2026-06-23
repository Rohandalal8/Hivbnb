import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await sendEmailVerification(userCredential.user);
            navigate("/verify-email");
            toast.success("Verification email sent. Please check your inbox or spam folder.");
        } catch (error) {
            console.error(error);
            switch (error.code) {

                case "auth/email-already-in-use":
                    toast.error("An account with this email already exists");
                    break;

                case "auth/invalid-email":
                    toast.error("Please enter a valid email address");
                    break;

                case "auth/weak-password":
                    toast.error("Password must be at least 6 characters long");
                    break;

                case "auth/network-request-failed":
                    toast.error("Network error. Check your internet connection");
                    break;

                case "auth/too-many-requests":
                    toast.error("Too many attempts. Please try again later");
                    break;

                default:
                    toast.error("Registration failed. Please try again");
            }
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(
                auth,
                provider
            );
            toast.success("Google Login Successful");

        } catch (error) {
            console.error(error);
            switch (error.code) {

                case "auth/popup-closed-by-user":
                    toast.error("Google login cancelled");
                    break;

                case "auth/popup-blocked":
                    toast.error("Popup blocked. Please allow popups and try again");
                    break;

                case "auth/cancelled-popup-request":
                    toast.error("Another login request is already in progress");
                    break;

                case "auth/network-request-failed":
                    toast.error("Network error. Check your internet connection");
                    break;

                case "auth/account-exists-with-different-credential":
                    toast.error("An account already exists with this email using another sign-in method");
                    break;

                default:
                    toast.error("Google login failed. Please try again");
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="btn" onClick={registerUser} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <button className="empty-btn" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }} onClick={googleLogin} disabled={loading}>
                    <FcGoogle size={20} /> Register with Google
                </button>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
}

export default Register;