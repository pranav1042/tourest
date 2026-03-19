import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Hero from './pages/Hero';
import Locations from './pages/Locations';
import Packages from './pages/Packages';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import Login from './pages/login';
import Register from './pages/Register';
import Profile from './pages/Profile'; 
import MyBookings from './pages/MyBookings'; // <-- Imported MyBookings

// Components
import LiveDestinationMap from './components/LiveDestinationMap';
import './index.css';

/**
 * HOME PAGE
 * Combines the Hero section, the Premium Map, and Services.
 */
const Home = () => (
  <>
    <Hero />
    {/* This is your premium interactive map component */}
    <LiveDestinationMap />
    <Services />
  </>
);

/**
 * LAYOUT WRAPPER
 * Handles the conditional rendering of Navbar and Footer.
 */
const Layout = ({ children }) => {
  const location = useLocation();

  // Define paths where Navbar and Footer should NOT appear
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      
      <main className="content">
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/packages" element={<Packages />} />
          
          {/* --- USER ACCOUNT ROUTES --- */}
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/my-bookings" element={<MyBookings />} /> {/* <-- Added MyBookings Route */}
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback for 404 - Optional */}
          <Route path="*" element={<div style={{color: 'white', padding: '100px', textAlign: 'center'}}><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;