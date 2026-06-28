import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
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
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await api.get("/listings/wishlist");
          setWishlistIds(response.data.map(listing => listing._id));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };

    fetchListings();
    fetchWishlist();
  }, [user]);

  return (
    <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '15px' }}>
      <div className="search-container">
        <select
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value);

            navigate(`/bnb?filter=${value}`);
          }}
          className="search-bar"
          style={{ maxWidth: '130px' }}
        >
          <option value="all">Filter</option>
          <option value="highest">High to Low</option>
          <option value="lowest">Low to High</option>
          <option value="rating">Most Rated</option>
        </select>
        <input
          type="text"
          placeholder="Search City..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);

            if (value.trim() !== "") {
              navigate(`/bnb?search=${encodeURIComponent(value)}`);
            }
          }}
          className="search-bar"
        />
      </div>

      <h2>Available in Dehradun</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" style={{ justifyContent: 'flex-start' }}>
          {dehradun.map(listing => (
            <ListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} />
          ))}
        </div>
      )}

      <h2>Stay in Goa</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" style={{ justifyContent: 'flex-start' }}>
          {goa.map(listing => (
            <ListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} />
          ))}
        </div>
      )}

      <h2>Places to stay in Manali</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" style={{ justifyContent: 'flex-start' }}>
          {manali.map(listing => (
            <ListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} />
          ))}
        </div>
      )}

      <h2>Homes in Rishikesh</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" style={{ justifyContent: 'flex-start' }}>
          {rishikesh.map(listing => (
            <ListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} />
          ))}
        </div>
      )}

      <h2>Checkout Homes in Mussoorie</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="listing-grid" style={{ justifyContent: 'flex-start' }}>
          {mussoorie.map(listing => (
            <ListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;