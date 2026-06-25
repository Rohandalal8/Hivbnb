import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ListingCard from "../components/listingCard";
import Loader from "../components/loader";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";
import "../styles/home.css";

const Home = () => {
  const [dehradun, setDehradun] = useState([]);
  const [goa, setGoa] = useState([]);
  const [manali, setManali] = useState([]);
  const [rishikesh, setRishikesh] = useState([]);
  const [mussoorie, setMussoorie] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("selling");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const dehradunResponse = await api.get("/listings?city=Dehradun");
        setDehradun(dehradunResponse.data);
        const goaResponse = await api.get("/listings?city=Goa");
        setGoa(goaResponse.data);
        const manaliResponse = await api.get("/listings?city=manali");
        setManali(manaliResponse.data);
        const rishikeshResponse = await api.get("/listings?city=Rishikesh");
        setRishikesh(rishikeshResponse.data);
        const mussoorieResponse = await api.get("/listings?city=Mussoorie");
        setMussoorie(mussoorieResponse.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '15px' }}>
      <div className="search-container">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="search-bar"
          style={{ maxWidth: '100px' }}
        >
          <option value="selling">Filter</option>
          <option value="discount">High to Low</option>
          <option value="recent">Low to High</option>
          <option value="price">Most Discounted</option>
          <option value="name">Most Rated</option>
        </select>
        <input
          type="text"
          placeholder="Search City..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <h2>Available in Dehradun</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" >
          {dehradun.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      <h2>Stay in Goa</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" >
          {goa.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      <h2>Places to stay in Manali</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" >
          {manali.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      <h2>Homes in Rishikesh</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" >
          {rishikesh.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      <h2>Checkout Homes in Mussoorie</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" >
          {mussoorie.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;