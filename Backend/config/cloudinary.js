const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const streamifier = require('streamifier');

// Cloudinary configuration for image uploads (used in Render deployment)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Hivbnb' },
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = {
    cloudinary,
    uploadToCloudinary
};
