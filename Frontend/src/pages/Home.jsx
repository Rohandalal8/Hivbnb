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
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;