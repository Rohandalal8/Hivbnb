import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (!userCredential.user.emailVerified) {
                await sendEmailVerification(userCredential.user);
                toast.warning("Please verify your email. A verification link has been sent to your email address.");
                navigate("/verify-email");
                setLoading(false);
                return;
            }
            toast.success("Login Successful");
            navigate("/");
        } catch (error) {
            console.error(error);
            switch (error.code) {
                case "auth/invalid-credential":
                    toast.error("Invalid email or password");
                    break;

                case "auth/user-not-found":
                    toast.error("No account found with this email");
                    break;

                case "auth/wrong-password":
                    toast.error("Incorrect password");
                    break;

                case "auth/invalid-email":
                    toast.error("Please enter a valid email address");
                    break;

                case "auth/too-many-requests":
                    toast.error("Too many failed attempts. Please try again later");
                    break;

                case "auth/network-request-failed":
                    toast.error("Network error. Check your internet connection");
                    break;

                default:
                    toast.error("Something went wrong. Please try again");
            }
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent. Check Inbox or Spam folder.");
        } catch (error) {
            console.error(error);

            if (error.code === "auth/user-not-found") {
                toast.error("No account found with this email");
            } else {
                toast.error(error.message);
            }
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
            navigate("/");
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
                <h2>Login</h2>
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

                <button type="button" onClick={forgotPassword} disabled={loading} style={{ background: "none", color: "#1542f7", border: "none", cursor: "pointer", marginTop: "-15px", textAlign: "left" }} >
                    Forgot Password?
                </button>

                <button className="btn" onClick={loginUser} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p style={{ fontSize: "0.9rem", marginTop: "-10px" }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <p className="divider">OR</p>

                <button className="empty-btn" onClick={googleLogin} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                    <FcGoogle size={20} /> Sign in with Google
                </button>
                
            </form>
        </div>
    );
}

export default Login;