import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import api from "../api/axios";
import "../styles/auth.css";

const EditListing = () => {
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
    const { id } = useParams();

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            navigate("/login");
            toast.info("Please log in to add a listing.");
        }

        const fetchListing = async () => {
            try {
                const response = await api.get(`/listings/${id}`);
                const listing = response.data;
                setFormData({
                    name: listing.name,
                    description: listing.description,
                    guests: listing.guests,
                    bedrooms: listing.bedrooms,
                    beds: listing.beds,
                    bathrooms: listing.bathrooms,
                    price: listing.price,
                    discount: listing.discount,
                    street: listing.street,
                    city: listing.city,
                    country: listing.country
                });
            } catch (error) {
                toast.error("Error fetching listing");
            }
        };
        fetchListing();
    }, [user, authLoading, navigate, id]);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        if (images){
            images.forEach((image, index) => {
                data.append(`images`, image);
            });
        }

        try {
            const response = await api.put(`/listings/${id}`, data);
            toast.success("Listing updated successfully");
            navigate("/host-dashboard");
        } catch (error) {
            toast.error("Error updating listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Edit Listing</h2>
                <input
                    type="text"
                    placeholder="Listing Name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="number"
                    placeholder="Bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="number"
                    placeholder="Beds"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="number"
                    placeholder="Bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="number"
                    placeholder="Discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    required
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                />
                <span style={{ fontSize: '0.8rem', color: '#00000092' }}>You can upload multiple images for the product. (Max 20)</span>

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Updating Listing...' : 'Update Listing'}
                </button>

            </form>
        </div>
    );
};

export default EditListing;