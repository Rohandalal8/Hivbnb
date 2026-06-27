import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";
import About from "./pages/About";
import ReturnPolicy from "./pages/ReturnPolicy";
import Disclaimer from "./pages/Disclaimer";
import AddListing from "./host/AddListing";
import Shop from "./pages/Shop";
import ListingDetail from "./pages/listingDetail";
import HostDashboard from "./host/HostDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 99999 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />
        <Route path="/return" element={<ReturnPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;