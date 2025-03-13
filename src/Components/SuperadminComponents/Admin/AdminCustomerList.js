import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./AdminCustomerList.css";

const AdminCustomerList = () => {
  const [customers, setCustomers] = useState([]); // Full customer list
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Filtered list
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("customerName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewType, setViewType] = useState("list");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch customers from API
  useEffect(() => {
    axios
      .get("http://localhost:3002/api/v1.0/customer/getAllCustomers")
      .then((response) => {
        console.log("API Response in Frontend:", response.data); // Debugging
  
        // Extract "data" correctly
        const customersData = Array.isArray(response.data.data) ? response.data.data : [];
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        setCustomers([]);
        setFilteredCustomers([]);
      });
  }, []);
  

  // Filter & Sort Customers
  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerEmailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerMobileNo.includes(searchQuery)
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") return a[sortField]?.localeCompare(b[sortField]);
      return b[sortField]?.localeCompare(a[sortField]);
    });

    setFilteredCustomers(sorted);
  }, [searchQuery, customers, sortField, sortOrder]);

  // Delete Customer
  const handleDeleteCustomer = (id) => {
    axios
      .delete(`http://localhost:3002/api/v1.0/customer/customer/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.customerId !== id));
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  //  Update Customer
  const handleUpdateCustomer = (id) => {
    setIsEditing(true);
    setCurrentCustomer(customers.find((customer) => customer.customerId === id));
    setIsModalOpen(true);
  };

  //  View Customer
  const handleViewCustomer = (id) => {
    setIsEditing(false);
    setCurrentCustomer(customers.find((customer) => customer.customerId === id));
    setIsModalOpen(true);
  };

  //  Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  // Save Customer Updates
  const handleSave = () => {
    axios
      .put(`http://localhost:3002/api/v1.0/customer/customer/${currentCustomer.customerId}`, currentCustomer)
     
      .then(() => {
        setCustomers(
          customers.map((customer) =>
            customer.customerId === currentCustomer.customerId ? currentCustomer : customer
          )
        );
        setIsEditing(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  //  Pagination Setup
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCustomers = Array.isArray(filteredCustomers) ? filteredCustomers.slice(firstIndex, lastIndex) : [];

  //  Pagination Controls
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleView = (type) => {
    setViewType(type);
    setShowMenu(false);
  };

  return (
    <div className="admin-customer-list-container">
      <h3>Customer List</h3>

      {/* Filter and Sorting Section */}
      <div className="admin-filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, email, phone or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search-input"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="admin-sort-dropdown"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="phone">Sort by Phone</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="admin-sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>

        {/* View Mode Toggle */}
        <div className="admin-view-mode-dropdown">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            &#9776;
          </button>
          {showMenu && (
            <div className="admin-dropdown-menu">
              <button onClick={() => toggleView('list')}>List View</button>
              <button onClick={() => toggleView('card')}>Card View</button>
            </div>
          )}
        </div>
      </div>

      {/* Render Customers in List or Card View */}
      {viewType === 'list' ? (
        <table className="admin-customer-table">
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
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer) => (
      <tr key={customer.customerId}>
        <td>{customer.customerId}</td>
        <td>{customer.customerName}</td>
        <td>{customer.customerEmailId}</td>
        <td>{customer.customerMobileNo}</td>
        <td>{customer.customerAddress}</td>
        <td>
          <button onClick={() => handleViewCustomer(customer.customerId)}>View</button>
          <button onClick={() => handleUpdateCustomer(customer.customerId)}>Update</button>
          <button onClick={() => handleDeleteCustomer(customer.customerId)}>Delete</button>
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
        <div className="admin-card-container">
          {currentCustomers.map((customer) => (
  <div className="admin-customer-card" key={customer.customerId}>
    <h3><strong>Name:</strong> {customer.customerName}</h3>  
    <p><strong>Email:</strong> {customer.customerEmailId}</p>  
    <p><strong>Phone:</strong> {customer.customerMobileNo}</p>  
    <p><strong>Address:</strong> {customer.customerAddress}</p>

    <div className="admin-card-actions">
      <button className="admin-action-button view" onClick={() => handleViewCustomer(customer.customerId)}>
        View
      </button>
      <button className="admin-action-button update" onClick={() => handleUpdateCustomer(customer.customerId)}>
        Update
      </button>
      <button className="admin-action-button delete" onClick={() => handleDeleteCustomer(customer.customerId)}>
        Delete
      </button>
    </div>
  </div>
))}

        </div>
      )}

      {/* Modal */}
  

      {isModalOpen && currentCustomer && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-content">
      <h4>{isEditing ? "Edit Customer" : "View Customer"}</h4>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="customerName"
            value={currentCustomer.customerName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="customerEmailId"
            value={currentCustomer.customerEmailId || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="customerMobileNo"
            value={currentCustomer.customerMobileNo || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="customerAddress"
            value={currentCustomer.customerAddress || ""}
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

  
{isModalOpen && currentCustomer && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-content">
      <h4>{isEditing ? "Edit Customer" : "View Customer"}</h4>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="customerName"
            value={currentCustomer.customerName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="customerEmailId"
            value={currentCustomer.customerEmailId || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="customerMobileNo"
            value={currentCustomer.customerMobileNo || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="customerAddress"
            value={currentCustomer.customerAddress || ""}
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
      <div className="admin-pagination-container">
        <button
          className="admin-pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          className="admin-pagination-button"
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminCustomerList;















































