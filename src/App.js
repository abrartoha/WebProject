import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TransactionPage from './pages/TransactionPage';
import OrderSummary from './pages/OrderSummary';
import ProductDetails from './pages/ProductDetails';


// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';



function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/:category" element={<SearchPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/ordersummary" element={<OrderSummary />} />
        <Route path="/product/:productName" element={<ProductDetails />} />

        {/* Add any other routes here */}
      </Routes>

      <br/>
      <br/>
      <Footer />
    </Router>
  );
}

export default App;
