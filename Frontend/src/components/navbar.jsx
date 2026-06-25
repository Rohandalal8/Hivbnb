import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import "../styles/navbar.css";

const Navbar = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
            toast.info("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="navbar-logo" />
                    Hivbnb
                </Link>
            </div>

            <ul className="navbar-links">
                <li><Link to="/add-listing">Become a Host</Link></li>
                <li><Link to="/">Wishlist</Link></li>
                <li><Link to="/">Profile</Link></li>
                {loading ? (
                    <li></li>
                ) : (user && user.emailVerified) ? (
                    <li><button onClick={handleLogout} className="empty-btn" style={{ color: "#ff0000", borderColor: "#ff0000", padding: "5px 10px" }}>
                        Logout
                    </button></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;