import React, { useRef, useState } from 'react';
import axios from 'axios'; 
import './css/AddCustomer.css'; 

function AddCustomer() {
  const formRef = useRef(null); 
  const [customerData, setCustomerData] = useState({
      customerName: "",
      customerMobileNo: "",
      customerEmailId: "",
      customerAddress: ""
    
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Axios API call
      const response = await axios.post('http://localhost:3002/api/v1.0/account/addaccount', customerData);

      if (response.status === 200 || response.status === 201) { // Success response
        setMessage({ text: 'Customer added successfully!', type: 'success' });
        setCustomerData({ customerName: '', customerEmail: '', customerMobileNo: '', customerAddress: '' });
        formRef.current.scrollIntoView({ behavior: 'smooth' }); // Scrolls form into view
      } else {
        setMessage({ text: 'Error: Could not add customer.', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Error: Unable to connect to the server.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-customer-wrapper" ref={formRef}>
      {/* Title Section */}
      <div className="title-section">
        <h2>Add Customer</h2>
      </div>

      {/* Form Section */}
      <div className="form-section">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="row">
            <div className="field-group">
              <label htmlFor="customerName">Name:</label>
              <input
                type="text" 
                id="customerName"
                name="customerName"
                value={customerData.customerName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>


          <div className="row">
            <div className="field-group">
              <label htmlFor="customerMobileNo">MobileNo:</label>
              <input
                type="text" 
                id="customerMobileNo"
                name="customerMobileNo"
                value={customerData.customerMobileNo}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="customerEmailId">Email:</label>
              <input
                type="text" 
                id="customerEmailId"
                name="customerEmailId"
                value={customerData.customerEmailId}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

            <div className="field-group">
              <label htmlFor="customerAddress">Address:</label>
              <input
                type="text"
                id="customerAddress"
                name="customerAddress"
                value={customerData.customerAddress}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;



































