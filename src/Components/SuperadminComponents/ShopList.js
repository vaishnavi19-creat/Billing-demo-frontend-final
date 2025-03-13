import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ShopList.css';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShop, setSelectedShop] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [viewMode, setViewMode] = useState('list'); 

    const itemsPerPage = 5;
    const apiUrl = 'http://localhost:3002/api/v1.0/shop/getAllShops';

    // Fetch all shops
    useEffect(() => {
        axios.get(apiUrl)
            .then((response) => {
                setShops(response.data.data || []);
                setFilteredShops(response.data.data || []);
            })
            .catch((error) => {
                console.error('Error fetching shops:', error);
            });
    }, []);

    // Filter, Search, and Sort logic
    useEffect(() => {
        let filtered = shops;

        if (searchQuery) {
            filtered = filtered.filter(shop =>
                shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.shopOwnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.shopCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.shopId.toString().includes(searchQuery) ||
                shop.shopType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(shop => shop.shopType === categoryFilter);
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.shopName.localeCompare(b.shopName));
        } else {
            filtered.sort((a, b) => b.shopName.localeCompare(a.shopName));
        }

        setFilteredShops(filtered);
    }, [searchQuery, categoryFilter, sortOrder, shops]);

    // Pagination logic
    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
    const paginatedShops = filteredShops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    //  Delete Shop API
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/api/v1.0/shop/shop/${id}`);
            setShops(shops.filter(shop => shop.shopId !== id));
        } catch (error) {
            console.error(' Error deleting shop:', error.response?.data || error.message);
        }
    };

    // Open modal for update or view
    const openModal = (shop, type) => {
        setSelectedShop({ ...shop });
        setModalType(type);
        setIsModalOpen(true);
    };

    // Handle input change for updating shop
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedShop({ ...selectedShop, [name]: value });

    };

    // Update Shop API
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3002/api/v1.0/shop/shop/${selectedShop.shopId}`, selectedShop);
    
            // Ensure the updated shop is reflected in the list
            setShops(shops.map(shop => shop.shopId === selectedShop.shopId ? selectedShop : shop));
            setFilteredShops(filteredShops.map(shop => shop.shopId === selectedShop.shopId ? selectedShop : shop));
    
            setIsModalOpen(false); // Close the modal after update
        } catch (error) {
            console.error(' Error updating shop:', error.response?.data || error.message);
        }
    };

    return (
        <div className="shop-list-container">
            <h2>Shop List</h2>

            {/*  Filter and Sorting Section */}
            <div className="filter-sort-container">
                <input
                    type="text"
                    placeholder="Search by name, owner, city, ID, or type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="General">General</option>
                    <option value="Medical">Medical</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Clothes">Clothes</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="asc">Sort Ascending</option>
                    <option value="desc">Sort Descending</option>
                </select>

                {/*  View Toggle Buttons */}
                <button onClick={() => setViewMode('list')}>List View</button>
                <button onClick={() => setViewMode('card')}>Card View</button>
            </div>

            {/*  Shop List / Card View */}
            {viewMode === 'list' ? (
                <table className="shop-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Shop Name</th>
                            <th>Owner Name</th>
                            <th>City</th>
                            <th>Shop Type</th>
                            <th>Package Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedShops.map(shop => (
                            <tr key={shop.shopId}>
                                <td>{shop.shopId}</td>
                                <td>{shop.shopName}</td>
                                <td>{shop.shopOwnerName}</td>
                                <td>{shop.shopCity}</td>
                                <td>{shop.shopType}</td>
                                <td>{shop.packageType}</td>
                                <td>
                                    <button onClick={() => openModal(shop, 'view')}>View</button>
                                    <button onClick={() => openModal(shop, 'update')}>Update</button>
                                    <button onClick={() => handleDelete(shop.shopId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="shop-cards">
                    {paginatedShops.map(shop => (
                        <div key={shop.shopId} className="shop-card">
                            <h3>{shop.shopName}</h3>
                            <p>Owner: {shop.shopOwnerName}</p>
                            <p>City: {shop.shopCity}</p>
                            <p>Type: {shop.shopType}</p>
                            <p>Package: {shop.packageType}</p>
                            <button onClick={() => openModal(shop, 'view')}>View</button>
                            <button onClick={() => openModal(shop, 'update')}>Update</button>
                            <button onClick={() => handleDelete(shop.shopId)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{modalType === 'view' ? 'View Shop' : 'Update Shop'}</h3>
                        <form>
                            <div>
                                <label>Name:</label>
                                <input type="text" name="name" value={selectedShop.name} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Owner Name:</label>
                                <input type="text" name="ownerName" value={selectedShop.ownerName} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                 <label>City:</label>
                                 <input type="text" name="shopCity" value={selectedShop.shopCity} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>

                            <div>
                                <label>Shop Type:</label>
                                <input type="text" name="shopType" value={selectedShop.shopType} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Package Type:</label>
                                <input type="text" name="packageType" value={selectedShop.packageType} readOnly={modalType === 'view'} onChange={handleInputChange} />
                            </div>

                            {modalType === 'update' && (
                                <div>
                                    <button type="button" onClick={handleUpdate}>Save Changes</button>
                                </div>
                            )}
                        </form>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopList;
























