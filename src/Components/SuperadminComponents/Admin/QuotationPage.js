
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./QuotationPage.css";

const QuotationPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [quotationNumber] = useState("QT12345");
  const [quotationDate] = useState(new Date().toISOString().split("T")[0]);
  const [quotationTerms] = useState("Payment due within 30 days.");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const pdfRef = useRef();

  useEffect(() => {
    fetchShops();
    fetchProducts();
  }, []);

  // const fetchShops = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3002/api/v1.0/shop/getAllShops"
  //     );
  //     console.log("fetchShops API Response:", response.data.data);
  //     setShopList(response.data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching shops:", error);
  //   }
  // };

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1.0/shop/getAllShops"
      );
      console.log("fetchShops API Response===:", response.data.data);
  
      // Ensure response contains the correct structure
      if (response.data && Array.isArray(response.data.data)) {
        setShopList(response.data.data);
      } else {
        console.error("Invalid shop data format:", response.data);
        setShopList([]); // Reset shop list to empty if data is invalid
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };
  
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1.0/product/getAllProducts"
      );
      console.log("fetchProducts API Response:", response.data);

      // Ensure that response.data.data exists and is an array
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = () => {
    if (!selectedProduct) return;

    const existingProduct = products.find(
      (product) => product.id === parseInt(selectedProduct)
    );
    if (!existingProduct) return;

    const total = existingProduct.price * quantity;
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: existingProduct.id,
        name: existingProduct.name,
        price: existingProduct.price,
        quantity,
        total,
      },
    ]);
    setQuantity(1);
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const saveQuotation = async () => {
    if (!selectedShop) {
      alert("Please select a shop.");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const quotationData = {
      quotationNumber,
      quotationDate,
      quotationTerms,
      shopId: selectedShop,
      products: selectedProducts,
    };

    try {
      await axios.post(
        "http://localhost:3002/api/v1.0/quotation/quotation",
        quotationData
      );
      alert("Quotation Saved Successfully");
    } catch (error) {
      console.error("Error saving quotation:", error);
    }
  };

  shopList.map((shop, index) => (
   console.log(shop)
  ));

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`Quotation_${quotationNumber}.pdf`);
    });
  };
 

  return (
    <div className="quotation-container">
      <h2>Quotation Management</h2>
      <div ref={pdfRef} className="quotation-content">
        {/* Shop Selection */}
        <div className="shop-selection">
          <h5>Select Shop</h5>
          {/* <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="">-- Select Shop --</option>
            {shopList.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select> */}

          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="">-- Select Shop --</option>
            {shopList.length > 0 ? (
              shopList.map((shop, index) => (
                <option key={shop.id || index} value={shop.id}>
                  {shop.name}
                </option>              
              ))
            ) : (
              <option disabled>No shops available</option>
            )}
          </select>

          <ul>
            {selectedShop && (
              <li>
                {shopList.find((shop) => shop.id === parseInt(selectedShop))
                  ?.name || "Shop not found"}
              </li>
            )}
          </ul>
        </div>

        {/* Product Selection */}
        <div className="product-section">
          <h5>Select Products</h5>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">-- Select Product --</option>
            {products.length > 0 ? (
              products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))
            ) : (
              <option disabled>No products available</option>
            )}
          </select>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button onClick={addProduct}>Add Product</button>
          <ul>
            {selectedProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.quantity} x ${product.price} = $
                {product.total}
                <button onClick={() => removeProduct(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quotation Summary */}
      <div className="quotation-summary">
        <h4>Summary</h4>
        <p>
          <strong>Subtotal:</strong> $
          {selectedProducts
            .reduce((sum, p) => sum + p.total, 0)
            .toFixed(2)}
        </p>
        <p>
          <strong>Tax (10%):</strong> $
          {(selectedProducts.reduce((sum, p) => sum + p.total, 0) * 0.1).toFixed(
            2
          )}
        </p>
        <p>
          <strong>Total:</strong> $
          {(selectedProducts.reduce((sum, p) => sum + p.total, 0) * 1.1).toFixed(
            2
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <button onClick={saveQuotation}>Save Quotation</button>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default QuotationPage;


























