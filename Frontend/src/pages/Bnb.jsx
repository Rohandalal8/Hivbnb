import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import BnbListingCard from '../components/BnbListingCard';
import Loader from '../components/Loader';
import api from '../api/axios';
import '../styles/home.css';

const Bnb = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
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

  const discountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  }

  const matchesSearch = listings.filter((listing) => {
    return listing.city.toLowerCase().includes(search.toLowerCase());
  });

  const filteredListings = [...matchesSearch].sort((a, b) => {
    switch (filter) {
      case 'all':
        return 0;
      case 'highest':
        return discountedPrice(b.price, b.discount) - discountedPrice(a.price, a.discount);
      case 'lowest':
        return discountedPrice(a.price, a.discount) - discountedPrice(b.price, b.discount);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '15px' }}>
      <div className="search-container">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader />
        </div>
      ) : (
        <div className="listing-grid" style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {filteredListings.map((listing) => (
            <BnbListingCard key={listing._id} listing={listing} wishlistIds={wishlistIds} setWishlistIds={setWishlistIds}/>
          ))}
        </div>
      )}

    </div>
  );
};

export default Bnb;
