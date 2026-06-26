const Listing = require('../models/listingModel.js');
const Review = require('../models/reviewModel.js');
const User = require('../models/userModel.js')
const { getCoordinates } = require('../middlewares/coordinatesMiddleware.js');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary.js');

// Get all listings
const getListings = async (req, res) => {
    try {
        const { city } = req.query;
        let filter = {};
        if (city) {
            filter.city = { $regex: `^${city}`, $options: 'i' };
        }
        const listings = await Listing.find(filter)
            .populate('ownerId')
            .sort({ rating: -1 }) // Sort by rating in descending order
            .limit(10); // Limit to 10 results

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings', error });
    }
};

// Get a single listing by ID
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('ownerId');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const reviews = await Review.find({ listingId: req.params.id }).populate('userId', 'name').sort({ createdAt: -1 });
        res.json({ ...listing.toObject(), reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listing', error });
    }
};

// Create a new listing
const createListing = async (req, res) => {
    try {
        const { name, description, guests, bedrooms, beds, bathrooms, price, discount, street, city, country } = req.body;
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                imageUrls.push(result.secure_url);
            }
        }
        const location = `${street}, ${city}, ${country}`;
        const coordinates = await getCoordinates(location);
        const user = await User.findOne({ email: req.firebaseUser.email });

        const listing = new Listing({
            name,
            description,
            guests,
            bedrooms,
            beds,
            bathrooms,
            price,
            discount,
            street,
            city,
            country,
            imageUrls,
            ownerId: user._id, // Assuming the User ID is stored in the user document
            geometry: { type: 'Point', coordinates }
        });
        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        console.error("Error creating listing:", error); // Debugging line
        res.status(500).json({ message: 'Error creating listing', error });
    }
}

// Update an existing listing
const updateListing = async (req, res) => {
    try {
        const { name, description, guests, bedrooms, beds, bathrooms, price, discount, street, city, country } = req.body;
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            listing.name = name || listing.name;
            listing.description = description || listing.description;
            listing.guests = guests || listing.guests;
            listing.bedrooms = bedrooms || listing.bedrooms;
            listing.beds = beds || listing.beds;
            listing.bathrooms = bathrooms || listing.bathrooms;
            listing.price = price || listing.price;
            listing.discount = discount || listing.discount;
            listing.street = street || listing.street;
            listing.city = city || listing.city;
            listing.country = country || listing.country;
            if (req.files && req.files.length > 0) {
                let imageUrls = [];
                for (const file of req.files) {
                    const result = await uploadToCloudinary(file.buffer);
                    imageUrls.push(result.secure_url);
                }
                listing.imageUrls = imageUrls;
            }
            const location = `${listing.street}, ${listing.city}, ${listing.country}`;
            const coordinates = await getCoordinates(location);
            listing.geometry = { type: 'Point', coordinates };
            const updatedListing = await listing.save();
            res.json(updatedListing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating listing', error });
    }
};

// Delete a listing
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (listing) {
            await listing.remove();
            res.json({ message: 'Listing removed' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting listing', error });
    }
};

//Add or remove a listing from the user's wishlist
const toggleWishlist = async (req, res) => {
    try {

        const { listingId } = req.params;

        const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = user.wishlist.some(id => id.toString() === listingId);

        if (exists) {

            user.wishlist = user.wishlist.filter(id => id.toString() !== listingId);

            await user.save();

            return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
        }

        user.wishlist.push(listingId);

        await user.save();

        res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get wishlist listings
const getWishlist = async (req, res) => {
    try {

        const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).populate("wishlist");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.wishlist);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a review to a listing
const addListingReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const listingId = req.params.id;
        const user = await User.findOne({ email: req.firebaseUser.email });
        const userId = user._id;
        const review = new Review({ listingId, userId, rating, comment });
        const savedReview = await review.save();

        // Update the listing's average rating and number of reviews
        const reviews = await Review.find({ listingId });
        const numReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / numReviews;
        await Listing.findByIdAndUpdate(listingId, { numReviews, avgRating });

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

module.exports = {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    toggleWishlist,
    getWishlist,
    addListingReview
};