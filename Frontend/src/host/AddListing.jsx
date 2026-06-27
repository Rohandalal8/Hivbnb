import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import api from "../api/axios";
import "../styles/auth.css";

const AddListing = () => {
    const { user, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        guests: "",
        bedrooms: "",
        beds: "",
        bathrooms: "",
        price: "",
        discount: "",
        street: "",
        city: "",
        country: "",
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate("/login");
            toast.info("Please log in to add a listing.");
        }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!images || images.length === 0) {
            toast.info("Please upload at least one image.");
            return;
        }
        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("guests", formData.guests);
        data.append("bedrooms", formData.bedrooms);
        data.append("beds", formData.beds);
        data.append("bathrooms", formData.bathrooms);
        data.append("price", formData.price);
        data.append("discount", formData.discount);
        data.append("street", formData.street);
        data.append("city", formData.city);
        data.append("country", formData.country);
        images.forEach((image, index) => {
            data.append(`images`, image);
        });

        try {
            const response = await api.post("/listings", data);
            toast.success("Listing added successfully");
            navigate("/host-dashboard");
        } catch (error) {
            toast.error("Error adding listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Add Listing</h2>
                <input
                    type="text"
                    placeholder="Listing Name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Guests"
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Bedrooms"
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Beds"
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Bathrooms"
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Discount"
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Street"
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="City"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    required
                />
                <span style={{ fontSize: '0.8rem', color: '#00000092' }}>You can upload multiple images for the product. (Max 20)</span>

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Adding Listing...' : 'Add Listing'}
                </button>

            </form>
        </div>
    );
};

export default AddListing;
