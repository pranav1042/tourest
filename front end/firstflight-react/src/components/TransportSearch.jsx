import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaTrain, FaBus, FaSearch, FaSpinner, FaArrowRight, FaSuitcase } from 'react-icons/fa';

const TransportSearch = () => {
  const [searchParams, setSearchParams] = useState({ origin: '', destination: '', date: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('flights');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await axios.get(`https://tourest-cidj.vercel.app/api/transport/search`, {
        params: searchParams
      });

      if (res.data.success) {
        setResults(res.data.data);
        // Auto-switch tab to trains if no flights (rare), etc.
        if (res.data.data.flights.length > 0) setActiveTab('flights');
        else if (res.data.data.trains.length > 0) setActiveTab('trains');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const currentData = results ? results[activeTab] : [];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Live Transport Search</h2>
          <p style={styles.subtitle}>Find real-time flights, premium trains, and luxury buses for your journey.</p>
        </div>
        
        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Origin City</label>
            <input 
              type="text" placeholder="e.g. Mumbai" required
              value={searchParams.origin} onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.arrowBox}><FaArrowRight color="#94a3b8" /></div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination City</label>
            <input 
              type="text" placeholder="e.g. Dubai or Delhi" required
              value={searchParams.destination} onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Travel Date</label>
            <input 
              type="date" required
              value={searchParams.date} onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? <FaSpinner className="fa-spin" /> : <FaSearch />} {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* RESULTS SECTION */}
        {results && !loading && (
          <div style={{ marginTop: '40px' }}>
            
            {/* CUSTOM TABS */}
            <div style={styles.tabsContainer}>
              <button 
                onClick={() => setActiveTab('flights')} 
                style={{...styles.tab, ...(activeTab === 'flights' ? styles.activeTab : {})}}
              >
                <FaPlane /> Flights ({results.flights.length})
              </button>
              <button 
                onClick={() => setActiveTab('trains')} 
                style={{...styles.tab, ...(activeTab === 'trains' ? styles.activeTab : {})}}
                disabled={results.trains.length === 0}
              >
                <FaTrain /> Trains ({results.trains.length})
              </button>
              <button 
                onClick={() => setActiveTab('buses')} 
                style={{...styles.tab, ...(activeTab === 'buses' ? styles.activeTab : {})}}
                disabled={results.buses.length === 0}
              >
                <FaBus /> Buses ({results.buses.length})
              </button>
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={styles.resultsList}
              >
                {currentData.length === 0 ? (
                  <div style={styles.noDataBox}>No {activeTab} available for this specific route. Try another mode.</div>
                ) : (
                  currentData.map((opt, i) => (
                    <div key={i} style={styles.resultCard}>
                      <div style={styles.cardMain}>
                        <div style={styles.iconBox}>
                          {activeTab === 'flights' ? <FaPlane size={24}/> : activeTab === 'trains' ? <FaTrain size={24}/> : <FaBus size={24}/>}
                        </div>
                        <div>
                          <h4 style={styles.providerName}>{opt.provider}</h4>
                          <div style={styles.routeDetails}>
                            <strong>{opt.departureTime}</strong> 
                            <span style={styles.durationLine}></span> 
                            <span>{opt.duration}</span>
                          </div>
                          <div style={styles.classBadge}><FaSuitcase size={12}/> {opt.class || 'Standard'}</div>
                        </div>
                      </div>
                      
                      <div style={styles.priceSection}>
                        <h3 style={styles.price}>₹{opt.price.toLocaleString()}</h3>
                        <small style={styles.perPerson}>per person</small>
                        <button style={styles.bookBtn}>Book Now</button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .fa-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

const styles = {
  pageWrapper: { background: '#f8fafc', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { color: '#0F2435', fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', margin: '0 0 10px 0' },
  subtitle: { color: '#64748b', fontSize: '1.1rem', margin: 0 },
  
  searchForm: { display: 'flex', gap: '15px', background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', alignItems: 'center', flexWrap: 'wrap' },
  inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' },
  label: { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0F2435', background: '#f8fafc', transition: 'border 0.3s' },
  arrowBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '25px' },
  searchBtn: { padding: '0 35px', height: '52px', alignSelf: 'flex-end', background: '#0F2435', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(15,36,53,0.15)' },
  
  errorBox: { background: '#fef2f2', color: '#ef4444', padding: '15px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', fontWeight: '600' },
  
  tabsContainer: { display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
  tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', color: '#94a3b8', transition: 'all 0.3s' },
  activeTab: { background: '#0F2435', color: '#C5A059' },
  
  resultsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  noDataBox: { background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '20px', color: '#64748b', border: '1px dashed #cbd5e1' },
  
  resultCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(15,36,53,0.03)' },
  cardMain: { display: 'flex', alignItems: 'center', gap: '25px' },
  iconBox: { width: '60px', height: '60px', background: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C5A059' },
  providerName: { margin: '0 0 10px 0', color: '#0F2435', fontSize: '1.3rem', fontWeight: '800' },
  routeDetails: { display: 'flex', alignItems: 'center', gap: '15px', color: '#0F2435', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' },
  durationLine: { width: '50px', height: '2px', background: '#cbd5e1', position: 'relative' },
  classBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' },
  
  priceSection: { textAlign: 'right' },
  price: { margin: '0 0 5px 0', fontSize: '1.8rem', color: '#0F2435', fontWeight: '800' },
  perPerson: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '600' },
  bookBtn: { background: '#C5A059', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(197, 160, 89, 0.3)' }
};

export default TransportSearch;