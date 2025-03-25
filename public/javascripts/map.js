// Initialize the map
var map = L.map('map').setView(listing.geometry.coordinates, 10); // Latitude, Longitude, Zoom level

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
L.marker(listing.geometry.coordinates).addTo(map)
    .bindPopup(`<b>${listing.location}, ${listing.country}</b>`)
    .openPopup();
