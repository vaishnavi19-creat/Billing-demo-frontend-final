import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [viewType, setViewType] = useState('list');

  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/v1.0/product/getAllProducts');
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    let filtered = products;

    // Apply search and filters
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toString().includes(searchQuery)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, sortOrder, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle delete product API call
  const handleDelete = async (id) => {
    if (!id || isNaN(id)) {
        console.error('Invalid Product ID:', id);
        return;
    }
    try {
        await axios.delete(`http://localhost:3002/api/v1.0/product/product/${parseInt(id, 10)}`);
        console.log(`Product ID ${id} deleted successfully.`);
        fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

  

  const openModal = (product, type) => {
    setSelectedProduct({ ...product });
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  // Handle update product API call
  const handleUpdate = async () => {
    if (!selectedProduct.id || isNaN(selectedProduct.id)) {
        console.error('Invalid Product ID:', selectedProduct.id);
        return;
    }

    try {
        // Corrected API URL to match backend
        await axios.put(`http://localhost:3002/api/v1.0/product/product/${parseInt(selectedProduct.id, 10)}`, selectedProduct);

        console.log(`Product ID ${selectedProduct.id} updated successfully.`);
        
        fetchProducts(); // Refresh list after update
        setIsModalOpen(false);
    } catch (error) {
        console.error(' Error updating product:', error);
    }
};

  

  const toggleView = (view) => {
    setViewType(view);
  };

  return (
    <div className="product-list-container">
      <h2>Product List</h2>

      {/* Filter and Sorting Section */}
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, description, category, or price"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Groceries">Groceries</option>
          <option value="Footwear">Footwear</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>
      </div>

      {/* Admin View Mode Dropdown */}
      <div className="admin-view-mode-dropdown">
        {/* Hamburger Menu Icon */}
        <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          &#9776;
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="admin-dropdown-menu">
            <button onClick={() => toggleView('list')}>List View</button>
            <button onClick={() => toggleView('card')}>Card View</button>
          </div>
        )}
      </div>

      {/* Product List Display */}
      {viewType === 'list' ? (
        <table className="Product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>
                  <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
                  <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
                  <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="product-card-container">
          {paginatedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Id: {product.id}</p>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <div className="product-card-actions">
                <button className="action-button view" onClick={() => openModal(product, 'view')}>View</button>
                <button className="action-button update" onClick={() => openModal(product, 'update')}>Update</button>
                <button className="action-button delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalType === 'view' ? 'View Product' : 'Update Product'}</h2>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={selectedProduct.name || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={selectedProduct.description || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={selectedProduct.price || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={selectedProduct.quantity || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={selectedProduct.category || ''}
                onChange={handleInputChange}
                disabled={modalType === 'view'}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              {modalType === 'update' && (
                <button onClick={handleUpdate}>Update</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

















































