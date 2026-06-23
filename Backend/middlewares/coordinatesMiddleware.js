const axios = require('axios');

const getCoordinates = async (location) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Hivbnb' } // Required by Nominatim
        });

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return [parseFloat(lat), parseFloat(lon)];
        } else {
            return { error: `No results found for ${location}` };
        }
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = { getCoordinates };