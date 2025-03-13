
import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    stock: 0,
    category: '',
    keywords: '',
    base_unit: '',
    target_unit: '',
    conversion_factor: 1,
    shop_id: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Groceries',
    'Footwear',
    'Books',
    'Home Appliances',
    'Toys',
    'Furniture',
    'Medical Supplies',
    'Sports Equipment'
  ];

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleUnitConversion = () => {
    if (product.base_unit && product.target_unit && product.conversion_factor) {
      const convertedQuantity = product.quantity * product.conversion_factor;
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: convertedQuantity,
      }));
      alert(`Quantity converted to ${convertedQuantity} ${product.target_unit}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/v1.0/product/product', product);
      setMessage(response.data.message || 'Product added successfully');
      setMessageType('success');
    } catch (error) {
      console.error(error);
      setMessage('Failed to add product');
      setMessageType('error');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={product.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input name="price" type="number" value={product.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input name="quantity" type="number" value={product.quantity} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={product.stock} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Keywords</label>
            <input name="keywords" value={product.keywords} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Shop ID</label> {/*Added Shop ID Field */}
            <input name="shop_id" type="number" value={product.shop_id} onChange={handleChange} required />
          </div>
        </div>

        
       
        <div className="form-row">
          <div className="form-group">
            <label>Base Unit</label>
            <input name="base_unit" value={product.base_unit} onChange={handleChange} placeholder="e.g., kg" />
          </div>
          <div className="form-group">
            <label>Target Unit</label>
            <input name="target_unit" value={product.target_unit} onChange={handleChange} placeholder="e.g., g" />
          </div>
          <div className="form-group">
            <label>Conversion Factor</label>
            <input name="conversion_factor" type="number" value={product.conversion_factor} onChange={handleChange} placeholder="e.g., 1000" />
          </div>
          <button type="button" onClick={handleUnitConversion}>Convert Quantity</button>
        </div>

        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;


























// import React, { useState } from 'react';
// import axios from 'axios';
// import './AddProduct.css';

// const AddProduct = () => {
//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: 0,
//     quantity: 0,
//     stock: 0,
//     category: '',
//     keywords: '',  // Keywords as a string
//     base_unit: '',       // Base unit for conversion
//     target_unit: '',     // Target unit for conversion
//     conversion_factor: 1 // Conversion factor between units
//   });

//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   // Handle changes in input fields
//   const handleChange = (e) => {
//     setProduct({
//       ...product,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Function to handle unit conversion
//   const handleUnitConversion = () => {
//     if (product.base_unit && product.target_unit && product.conversion_factor) {
//       const convertedQuantity = product.quantity * product.conversion_factor;
//       setProduct((prevProduct) => ({
//         ...prevProduct,
//         quantity: convertedQuantity,
//       }));
//       alert(`Quantity converted to ${convertedQuantity} ${product.target_unit}`);
//     }
//   };

//   // Submit form to add a new product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3002/api/v1.0/product/product', product);
//       setMessage(response.data.message || 'Product added successfully');
//       setMessageType('success');
//     } catch (error) {
//       console.error(error);
//       setMessage('Failed to add product');
//       setMessageType('error');
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>Add Product</h2>

//       {/* Display success or error message */}
//       {message && (
//         <div className={`message ${messageType}`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="add-product-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label>Name</label>
//             <input name="name" value={product.name} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Category</label>
//             <input name="category" value={product.category} onChange={handleChange} />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Price</label>
//             <input name="price" type="number" value={product.price} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Quantity</label>
//             <input name="quantity" type="number" value={product.quantity} onChange={handleChange} />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Stock</label>
//             <input name="stock" type="number" value={product.stock} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Keywords</label>
//             <input name="keywords" value={product.keywords} onChange={handleChange} />
//           </div>
//         </div>

//         {/* Additional fields for Unit Conversion */}
//         <div className="form-row">
//           <div className="form-group">
//             <label>Base Unit</label>
//             <input name="base_unit" value={product.base_unit} onChange={handleChange} placeholder="e.g., kg" />
//           </div>
//           <div className="form-group">
//             <label>Target Unit</label>
//             <input name="target_unit" value={product.target_unit} onChange={handleChange} placeholder="e.g., g" />
//           </div>
//           <div className="form-group">
//             <label>Conversion Factor</label>
//             <input
//               name="conversion_factor"
//               type="number"
//               value={product.conversion_factor}
//               onChange={handleChange}
//               placeholder="e.g., 1000"
//             />
//           </div>
//           <button type="button" onClick={handleUnitConversion}>Convert Quantity</button>
//         </div>

//         <button type="submit" className="submit-button">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
























