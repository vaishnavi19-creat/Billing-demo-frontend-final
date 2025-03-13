import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import axios from 'axios'; 
import './css/CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('customerName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewType, setViewType] = useState('list');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/v1.0/account/getallaccounts")
      .then((response) => {
        console.log("API Response:", response.data);
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  useEffect(() => {
    if (!Array.isArray(customers)) return;

    const filtered = customers.filter((customer) =>
      customer.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerEmailId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerMobileNo?.includes(searchQuery)
    );

    const sorted = [...filtered].sort((a, b) => {
      if (!a[sortField] || !b[sortField]) return 0;
      return sortOrder === 'asc'
        ? a[sortField]?.localeCompare(b[sortField])
        : b[sortField]?.localeCompare(a[sortField]);
    });

    setFilteredCustomers(sorted);
  }, [searchQuery, customers, sortField, sortOrder]);

  const handleDeleteCustomer = (id) => {
    axios
      .delete(`http://localhost:3002/api/v1.0/account/delete/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.accountId !== id));
        setFilteredCustomers(filteredCustomers.filter((customer) => customer.accountId !== id));
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };
  

  const handleUpdateCustomer = (id) => {
    setIsEditing(true);
    setCurrentCustomer(customers.find((customer) => customer.accountId === id));
    setIsModalOpen(true);
  };

  const handleViewCustomer = (id) => {
    setIsEditing(false);
    setCurrentCustomer(customers.find((customer) => customer.accountId === id));
    setIsModalOpen(true);
  };

  // const handleAddShop = () => {
  //   navigate('/add-shop'); 
  // };

  
  const handleAddShop = () => {
    navigate("/add-shop/:account_id"); 
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:3002/api/v1.0/account/update/${currentCustomer.accountId}`, currentCustomer)
      .then(() => {
        setCustomers(
          customers.map((customer) =>
            customer.accountId === currentCustomer.accountId ? currentCustomer : customer
          )
        );
        setFilteredCustomers(
          filteredCustomers.map((customer) =>
            customer.accountId === currentCustomer.accountId ? currentCustomer : customer
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error updating customer:", error));
  };
  
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(firstIndex, lastIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };


  const toggleView = (type) => {
    setViewType(type);
    setShowMenu(false); // Close the menu after selection
  };

  
  


  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>

      {console.log("Filtered Customers:", filteredCustomers)} {/*  Debugging */}

      {/* Filter and Sorting Section */}
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, email, phone or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-dropdown"
        >
          <option value="customerName">Sort by Name</option>
          <option value="CustomerEmailId">Sort by Email</option>
          <option value="customerMobileNo">Sort by Phone</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>

        {/* View Mode Toggle */}
        <div className="view-mode-dropdown">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            &#9776;
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => toggleView('list')}>List View</button>
              <button onClick={() => toggleView('card')}>Card View</button>
            </div>

            
          )}
        </div>
      </div>

      {/* Render Customers in List or Card View */}
      {viewType === 'list' ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.accountId}>
                  <td>{customer.accountId}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.customerEmailId}</td>
                  <td>{customer.customerMobileNo}</td>
                  <td>{customer.customerAddress}</td>

                  <td>
                    <button
                      className="action-button view"
                      onClick={() => handleViewCustomer(customer.accountId)}
                    >
                      View
                    </button>
                    <button
                      className="action-button update"
                      onClick={() => handleUpdateCustomer(customer.accountId)}
                    >
                      Update
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDeleteCustomer(customer.accountId)}
                    >
                      Delete
                    </button>

                    {/* <button
                      className="action-button add-shop" onClick={handleAddShop}>Add Shop</button>
                     <a href={`/add-shop/{customer.accountId}`}>Add Shop</a> */}

 <Link to={`/add-shop/${customer.accountId}`} className="ayny"><button className="btn btn-sm  btn-info">Add Shop</button></Link>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="card-container">
          {currentCustomers.map((customer) => (
            <div className="customer-card" key={customer.accountId}>
              <h3>{customer.customerName}</h3>
              <p>Email: {customer.customerEmailId}</p>
              <p>Phone: {customer.customerMobileNo}</p>
              <p>Address: {customer.customerAddress}</p>


              <div className="card-actions">
                <button
                  className="action-button view"
                  onClick={() => handleViewCustomer(customer.accountId)}
                >
                  View
                </button>
                <button
                  className="action-button update"
                  onClick={() => handleUpdateCustomer(customer.accountId)}
                >
                  Update
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDeleteCustomer(customer.accountId)}
                >
                  Delete
                </button>
                <button
                  className="action-button add-shop"
                  onClick={handleAddShop}
                >
                  Add Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && currentCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Customer' : 'View Customer'}</h3>
            <form>
              <label>
                Name:
                <input
                  type="text"
                  name="customerName"
                  value={currentCustomer.customerName || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Email:
                <input
                  type="customerEmailId"
                  name="customerEmailId"
                  value={currentCustomer.customerEmailId || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="customerMobileNo"
                  value={currentCustomer.customerMobileNo || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="customerAddress"
                  value={currentCustomer.customerAddress || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>

              {isEditing && (
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              )}
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
    
    );
  }
export default CustomerList;



















































