import React, { useRef, useState } from 'react';
import axios from 'axios';
import './AddAdminCustomer.css';

function AddAdminCustomer() {
  const formRef = useRef(null);
  const [admincustomerData, setAdminCustomerData] = useState({
    Name: '',
    Email: '',
    MobileNo: '',
    Address: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      console.log('Sending request to server with data:', admincustomerData);

      // Send POST request to backend API
      const response = await axios.post('http://localhost:3002/api/v1.0/customer/customer',admincustomerData,);

      // console.log('Server response:', response);

      // Handle successful response
      if (response.status === 201) {
        setMessage({ text: 'Customer added successfully!', type: 'success' });
        setAdminCustomerData({ name: '', email: '', phone: '', address: '' });
        formRef.current.scrollIntoView({ behavior: 'smooth' }); // Scrolls form into view
      } else {
        setMessage({ text: 'Error: Could not add customer.', type: 'error' });
      }
    } catch (error) {
      console.error('Error while submitting:', error);

      // Handle error response
      if (error.response) {
        // Backend error response
        setMessage({ text: `Error: ${error.response.data.message}`, type: 'error' });
      } else {
        // Network or CORS error
        setMessage({ text: 'Error: Unable to connect to the server.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-admin-customer-wrapper" ref={formRef}>
      {/* Title Section */}
      <div className="admin-title-section">
        <h3>Add Customer</h3>
      </div>

      {/* Form Section */}
      <div className="admin-form-section">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-customer-form">
          <div className="adminrow">
            <div className="admin-field-group">
              <label htmlFor="Name">Name:</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={admincustomerData.Name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="admin-field-group">
              <label htmlFor="Email">Email:</label>
              <input
                type="Email"
                id="Email"
                name="Email"
                value={admincustomerData.Email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="adminrow">
            <div className="admin-field-group">
              <label htmlFor="MobileNo">MobileNo:</label>
              <input
                type="tel"
                id="MobileNo"
                name="MobileNo"
                value={admincustomerData.MobileNo}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="admin-field-group">
              <label htmlFor="Address">Address:</label>
              <input
                type="text"
                id="Address"
                name="Address"
                value={admincustomerData.Address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="admin-submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAdminCustomer;


























