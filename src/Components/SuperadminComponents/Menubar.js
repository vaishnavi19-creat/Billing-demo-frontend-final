import React, { useState } from 'react';
import './css/Menubar.css';
import { useNavigate } from 'react-router-dom'; 

import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome

export default function Menubar() {
  const [customerExpanded, setCustomerExpanded] = useState(false);
  const [shopExpanded, setShopExpanded] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

  const toggleCustomerMenu = () => setCustomerExpanded(!customerExpanded);
  const toggleShopMenu = () => setShopExpanded(!shopExpanded);

  const handleNavigation = (path) => {
    navigate(path); // Use navigate for routing
  };

  return (
    <div className="menubar-wrapper">
      {/* Horizontal Menu */}
      <div className="horizontal-menu">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            onKeyDown={(e) => e.key === 'Enter' && console.log('Search:', e.target.value)}
          />
        </div>
        <div className="menu-icons">
          <i className="fas fa-bell"></i>
          <i className="fas fa-cog"></i>
        </div>
      </div>

      {/* Vertical Menu */}
      <div className="vertical-menu">
        {/* Management Logo */}
        <div className="logo">
          <img src="https://tse3.mm.bing.net/th?id=OIP.v0gwPzt2xe6H-Ld0rOvglwHaFj&pid=Api&P=0&h=180" alt="Management Logo" />
          <h3>Management</h3>
        </div>

        {/* Menu Items */}
        <ul className="menu-list">
          <li>
            <button onClick={toggleCustomerMenu}>Customer</button>
            {customerExpanded && (
              <ul className="submenu">
                <li onClick={() => handleNavigation('/add-customer')}>Add Customer</li>
                <li onClick={() => handleNavigation('/customer-list')}>Customer List</li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleShopMenu}>Shop</button>
            {shopExpanded && (
              <ul className="submenu">
                <li onClick={() => handleNavigation('/add-shop')}>Add Shop</li>
                <li onClick={() => handleNavigation('/shop-list')}>Shop List</li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
