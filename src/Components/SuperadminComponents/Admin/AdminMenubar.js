import React, { useState } from 'react';
import './AdminMenubar.css';
import { useNavigate } from 'react-router-dom';

export default function AdminMenubar({ onLogout }) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [toggleProduct, setToggleProduct] = useState(false);
  const [toggleInvoice, setToggleInvoice] = useState(false);
  const [toggleQuotation, setToggleQuotation] = useState(false);


  const navigate = useNavigate();

  const toggleMenu = () => setMenuExpanded(!menuExpanded);
  const handleNavigation = (path) => navigate(path);
  const handleToggleProduct = () => setToggleProduct(!toggleProduct);
  const handleToggleInvoice = () => setToggleInvoice(!toggleInvoice);
  const handleToggleQuotation = () => setToggleQuotation(!toggleQuotation);


  // Logout function
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Call the logout handler from AdminBase
    }
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="admin-menubar-wrapper">
      {/* Horizontal Menu */}
      <div className="admin-horizontal-menu">
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Search..."
            onKeyDown={(e) => e.key === 'Enter' && console.log('Search:', e.target.value)}
          />
        </div>
        <div className="admin-menu-icons">
          <i className="fas fa-bell"></i>
          <i className="fas fa-cog"></i>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Vertical Menu */}
      <div className="admin-vertical-menu">
        <div className="admin-logo">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.v0gwPzt2xe6H-Ld0rOvglwHaFj&pid=Api&P=0&h=180"
            alt="Admin Logo"
          />
          <h3>Management</h3>
        </div>
        <ul className="admin-menu-list">
          {/* Customer Section */}
          <li>
            <button onClick={toggleMenu}>Customer</button>
            {menuExpanded && (
              <ul className="admin-submenu">
                <li onClick={() => handleNavigation('/admin/addadmin-customer')}>Add Customer</li>
                <li onClick={() => handleNavigation('/admin/admincustomer-list')}>Customer List</li>
              </ul>
            )}
          </li>

          {/* Product Section */}
          <li>
            <button onClick={handleToggleProduct}>Product</button>
            {toggleProduct && (
              <ul className="admin-submenu">
                <li onClick={() => handleNavigation('/admin/add-product')}>Add Product</li>
                <li onClick={() => handleNavigation('/admin/product-list')}>Product List</li>
              </ul>
            )}
          </li>

          {/* Invoice Section */}
          <li>
            <button onClick={handleToggleInvoice}>Invoice</button>
            {toggleInvoice && (
              <ul className="admin-submenu">
                <li onClick={() => handleNavigation('/admin/add-invoice')}>Create Invoice</li>
              </ul>
            )}
          </li>

          {/* Quotation Section */}
          <li>
            <button onClick={handleToggleQuotation}>Quotation</button>
            {toggleQuotation && (
              <ul className="admin-submenu">
                <li onClick={() => handleNavigation('/admin/create-quotation')}>Create Quotation</li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}





























// import React, { useState } from 'react';
// import './AdminMenubar.css';
// import { useNavigate } from 'react-router-dom';

// export default function AdminMenubar() {
//   const [menuExpanded, setMenuExpanded] = useState(false);
//   const [toggleProduct, setToggleProduct] = useState(false);

//   const navigate = useNavigate();

//   const toggleMenu = () => setMenuExpanded(!menuExpanded);
//   const handleNavigation = (path) => navigate(path);
//   const handleToggleProduct = () => setToggleProduct(!toggleProduct);

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('auth-token');
//     console.log('Logged out and token removed');
//     navigate('/login'); // Navigate to login form
//   };

//   return (
//     <div className="admin-menubar-wrapper">
//       {/* Horizontal Menu */}
//       <div className="admin-horizontal-menu">
//         <div className="admin-search-bar">
//           <input
//             type="text"
//             placeholder="Search..."
//             onKeyDown={(e) => e.key === 'Enter' && console.log('Search:', e.target.value)}
//           />
//         </div>
//         <div className="admin-menu-icons">
//           <i className="fas fa-bell"></i>
//           <i className="fas fa-cog"></i>
//           <button className="logout-button" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Vertical Menu */}
//       <div className="admin-vertical-menu">
//         <div className="admin-logo">
//           <img
//             src="https://tse3.mm.bing.net/th?id=OIP.v0gwPzt2xe6H-Ld0rOvglwHaFj&pid=Api&P=0&h=180"
//             alt="Admin Logo"
//           />
//           <h3>Management</h3>
//         </div>
//         <ul className="admin-menu-list">
//           <li>
//             <button onClick={toggleMenu}>Customer</button>
//             {menuExpanded && (
//               <ul className="admin-submenu">
//                 <li onClick={() => handleNavigation('/admin/addadmin-customer')}>Add Customer</li>
//                 <li onClick={() => handleNavigation('/admin/admincustomer-list')}>Customer List</li>
//               </ul>
//             )}
//           </li>
//           <li>
//             <button onClick={handleToggleProduct}>Product</button>
//             {toggleProduct && (
//               <ul className="admin-submenu">
//                 <li onClick={() => handleNavigation('/admin/add-product')}>Add Product</li>
//                 <li onClick={() => handleNavigation('/admin/product-list')}>Product List</li>
//               </ul>
//             )}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }













































