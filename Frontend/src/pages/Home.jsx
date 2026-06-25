import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
// import listingCards from "../components/listingCard";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";

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
        const manaliResponse = await api.get("/listings?city=Manali");
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
      <div>
        <input
          type="text"
          placeholder="Search City..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="search-bar"
        >
          <option value="selling">Filter</option>
          <option value="discount">High to Low</option>
          <option value="recent">Low to High</option>
          <option value="price">Most Discounted</option>
          <option value="name">Most Rated</option>
        </select>
      </div>

      <h2>Available in Dehradun</h2>
      <div className="listing-cards">
        {dehradun.map((listing) => (
          <div key={listing._id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
          </div>
        ))}
      </div>

      <h2>Stay in Goa</h2>
      <div className="listing-cards">
        {goa.map((listing) => (
          <div key={listing._id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
          </div>
        ))}
      </div>

      <h2>Places to stay in Manali</h2>
      <div className="listing-cards">
        {manali.map((listing) => (
          <div key={listing._id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
          </div>
        ))}
      </div>

      <h2>Homes in Rishikesh</h2>
      <div className="listing-cards">
        {rishikesh.map((listing) => (
          <div key={listing._id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
          </div>
        ))}
      </div>

      <h2>Checkout Homes in Mussoorie</h2>
      <div className="listing-cards">
        {mussoorie.map((listing) => (
          <div key={listing._id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;