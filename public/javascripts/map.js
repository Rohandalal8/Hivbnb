// Initialize the map
var map = L.map('map').setView([28.6921, 76.9202], 13); // Latitude, Longitude, Zoom level

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
L.marker([28.6921, 76.9202]).addTo(map)
    .openPopup();
