import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ListingMap({ coordinates, name }) {
  if (!coordinates || coordinates.length < 2) return null;

  const [lat, lon] = coordinates;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={15}
      style={{ height: "400px", width: "100%", borderRadius: "12px", marginBottom: "20px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lon]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default ListingMap;