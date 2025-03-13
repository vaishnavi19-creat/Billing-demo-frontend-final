import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddInvoice.css";

// Function to fetch the token from backend
const fetchToken = async () => {
  try {
    const response = await axios.get("http://localhost:3002/api/v1.0/generateToken");
    return response.data.token; // Returns the generated token from backend
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

const AddInvoice = () => {
  const [shopId, setShopId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("Direct");
  const [taxAmount, setTaxAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [status, setStatus] = useState("Pending"); // ✅ Added missing status field
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [token, setToken] = useState(""); // Store token here

  // Items Array
  const [items, setItems] = useState([
    { productId: "", productName: "", quantity: 1, price: 0, total: 0 }
  ]);

  // Fetch the token when the component mounts
  useEffect(() => {
    const getToken = async () => {
      const fetchedToken = await fetchToken();
      if (fetchedToken) {
        setToken(fetchedToken);
      } else {
        console.error("Failed to fetch token");
      }
    };
    getToken();
  }, []);

 
  useEffect(() => {
    if (token && shopId) {
      axios
        .get(`http://localhost:3002/api/v1.0/product/getAllProductsByShop?shopId=${shopId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && Array.isArray(res.data.products)) {
            setProducts(res.data.products);
          } else {
            console.error("Invalid product data received:", res.data);
          }
        })
        .catch((err) => console.error("Error fetching all products:", err));
    }
  }, [shopId, token]);
  

  // Handle adding a new item
  const handleAddItem = () => {
    setItems([...items, { productId: "", productName: "", quantity: 1, price: 0, total: 0 }]);
  };

  // Handle item changes (quantity, price, productId)
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "productId") {
      const selectedProduct = products.find(product => product.id === value);
      newItems[index].productName = selectedProduct ? selectedProduct.name : "";
    }

    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }

    setItems(newItems);
  };

  // Calculate totals
  const calculateTotal = () => {
    const newSubtotal = items.reduce((acc, item) => acc + item.total, 0);
    setSubtotal(newSubtotal);

    const discountValue = discountType === "Percentage" ? (newSubtotal * discount) / 100 : discount;
    setAmount(newSubtotal - discountValue + taxAmount);
  };

  // Handle form submission (creating the invoice)
  const handleSubmit = async () => {
    if (!token) {
      setMessage("Authentication error. Please log in again.");
      setMessageType("error");
      return;
    }

    try {
      const invoiceData = {
        shopId,
        customerId,
        amount,
        paymentMode,
        invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
        dueDate,
        discount,
        discountType,
        taxAmount,
        status, // Sends status field in API request
        items: items.map(item => ({
          productId: item.productId || 0, 
          productName: item.productName || "Unknown",
          quantity: item.quantity || 1,  
          price: item.price || 0,  
          total: (item.quantity || 1) * (item.price || 0)  
        })),
        createdBy: 1,
        createdOn: new Date(),
      };

      await axios.post("http://localhost:3002/api/v1.0/invoice/createInvoice", invoiceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Invoice added successfully!");
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (error) {
      console.error("Error creating invoice", error);
      setMessage("Failed to add invoice. Please try again.");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };

  return (
    <div className="invoice-container">
      <h2>Create New Invoice</h2>

      {/* Display success or error messages */}
      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <div className="form-group">
            <label>Shop ID:</label>
            <input type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Customer ID:</label>
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              placeholder="Enter Customer Name"
              value={customerName}  
              onChange={(e) => setCustomerName(e.target.value)} // Update customerName state
            />
          </div>
          <div className="form-group">
            <label>Payment Mode:</label>
            <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Invoice Number:</label>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          {items.map((item, index) => (
            <div key={index} className="item-group">
              

              <select value={item.productId} onChange={(e) => handleItemChange(index, "productId", e.target.value)}>
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
              />
              <span>Total: {item.total.toFixed(2)}</span>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
        </div>

        <div className="summary-section">
          <h3>Invoice Summary</h3>
          <div className="form-group">
            <label>Subtotal:</label>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="form-group">
            <label>Discount:</label>
            <input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="Direct">Direct</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tax Amount:</label>
            <input
              type="number"
              placeholder="Tax"
              value={taxAmount}
              onChange={(e) => setTaxAmount(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Total Amount:</label>
            <span>{amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={calculateTotal}>
            Calculate Total
          </button>
          <button type="button" onClick={handleSubmit}>
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;































































  


































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AddInvoice.css";

// const AddInvoice = () => {
//   const [shopId, setShopId] = useState("");
//   const [customerId, setCustomerId] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [discountType, setDiscountType] = useState("Direct");
//   const [taxAmount, setTaxAmount] = useState(0);
//   const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0, total: 0 }]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [createdBy] = useState(1);

//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);  // Initialize as an empty array

//   // Success & Error Messages
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   useEffect(() => {
//     if (shopId) {
//       // Fetch customers
//       axios.get(`http://localhost:3002/api/v1.0/customer/getAllCustomers`)
//         .then((res) => setCustomers(res.data))
//         .catch((err) => console.error("Error fetching customers", err));

//       // Fetch products
//       axios.get(`http://localhost:3002/api/v1.0/product/getAllProducts?limit=10&pageNumber=1`)
//         .then((res) => {
//           console.log("Fetched Products:", res.data);  // Debug log
//           // Ensure products are set only if the response is an array
//           if (Array.isArray(res.data)) {
//             setProducts(res.data);
//           } else {
//             setProducts([]);  // If not an array, set to empty array
//           }
//         })
//         .catch((err) => console.error("Error fetching products", err));
//     }
//   }, [shopId]);

//   const handleAddItem = () => {
//     setItems([...items, { productId: "", quantity: 1, price: 0, total: 0 }]);
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;

//     if (field === "quantity" || field === "price") {
//       newItems[index].total = newItems[index].quantity * newItems[index].price;
//     }

//     setItems(newItems);
//   };

//   const calculateTotal = () => {
//     const newSubtotal = items.reduce((acc, item) => acc + item.total, 0);
//     setSubtotal(newSubtotal);

//     const discountValue = discountType === "Percentage" ? (newSubtotal * discount) / 100 : discount;
//     setAmount(newSubtotal - discountValue + taxAmount);
//   };

//   const handleSubmit = async () => {
//     try {
//       const invoiceData = {
//         shopId,
//         customerId,
//         amount,
//         paymentMode,
//         invoiceNumber,
//         dueDate,
//         discount,
//         discountType,
//         taxAmount,
//         items,
//         createdBy,
//         createdOn: new Date(),
//       };

//       await axios.post("http://localhost:3002/api/v1.0/invoice/createInvoice", invoiceData);

//       setMessage("Invoice added successfully!");
//       setMessageType("success");

//       setTimeout(() => {
//         setMessage("");
//         setMessageType("");
//       }, 5000);
//     } catch (error) {
//       console.error("Error creating invoice", error);
//       setMessage("Failed to add invoice. Please try again.");
//       setMessageType("error");

//       setTimeout(() => {
//         setMessage("");
//         setMessageType("");
//       }, 5000);
//     }
//   };

//   return (
//     <div className="invoice-container">
//         <h2>Create New Invoice</h2>

//         {/* Success and Error Messages */}
//         {message && <div className={`message ${messageType}`}>{message}</div>}

//         <form onSubmit={(e) => e.preventDefault()}>
//             <div className="form-section">
//                 <div className="form-group">
//                     <label>Shop ID:</label>
//                     <input type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} />
//                 </div>
//                 <div className="form-group">
//                     <label>Customer ID:</label>
//                     <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
//                 </div>
//                 <div className="form-group">
//                     <label>Customer Name:</label>
//                     <input
//                         type="text"
//                         placeholder="Enter Customer Name"
//                         value={customerId}
//                         onChange={(e) => setCustomerId(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Payment Mode:</label>
//                     <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
//                         <option value="Cash">Cash</option>
//                         <option value="Card">Card</option>
//                         <option value="Online">Online</option>
//                     </select>
//                 </div>
//                 <div className="form-group">
//                     <label>Due Date:</label>
//                     <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
//                 </div>
//                 <div className="form-group">
//                     <label>Invoice Number:</label>
//                     <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
//                 </div>
//             </div>

//             <div className="items-section">
//                 <h3>Items</h3>
//                 {items.map((item, index) => (
//                     <div key={index} className="item-group">
//                         <select
//                             value={item.productId}
//                             onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
//                         >
//                             <option value="">Select Product</option>
//                             {products.map((product) => (
//                                 <option key={product.id} value={product.id}>
//                                     {product.name}
//                                 </option>
//                             ))}
//                         </select>
//                         <input
//                             type="number"
//                             placeholder="Quantity"
//                             value={item.quantity}
//                             onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Price"
//                             value={item.price}
//                             onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
//                         />
//                         <span>Total: {item.total.toFixed(2)}</span>
//                     </div>
//                 ))}
//                 <button type="button" onClick={handleAddItem}>
//                     Add Item
//                 </button>
//             </div>

//             <div className="summary-section">
//                 <h3>Invoice Summary</h3>
//                 <div className="form-group">
//                     <label>Subtotal:</label>
//                     <span>{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="form-group">
//                     <label>Discount:</label>
//                     <input
//                         type="number"
//                         placeholder="Discount"
//                         value={discount}
//                         onChange={(e) => setDiscount(Number(e.target.value))}
//                     />
//                     <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
//                         <option value="Direct">Direct</option>
//                         <option value="Percentage">Percentage</option>
//                     </select>
//                 </div>
//                 <div className="form-group">
//                     <label>Tax Amount:</label>
//                     <input
//                         type="number"
//                         placeholder="Tax"
//                         value={taxAmount}
//                         onChange={(e) => setTaxAmount(Number(e.target.value))}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Total Amount:</label>
//                     <span>{amount.toFixed(2)}</span>
//                 </div>
//             </div>

//             <div className="form-actions">
//                 <button type="button" onClick={calculateTotal}>
//                     Calculate Total
//                 </button>
//                 <button type="button" onClick={handleSubmit}>
//                     Create Invoice
//                 </button>
//             </div>
//         </form>
//     </div>
// );
// };

// export default AddInvoice;





















