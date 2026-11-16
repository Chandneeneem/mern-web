import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../../services/productService';

import type {
    IProduct,
    IProductPayload
} from '../../utils/types/product.types';

const Dashboard = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    );

    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState<IProductPayload>({
        name: '',
        price: 0,
        category: '',
        description: '',
        stock: 0,
        image: ''
    });

    // Get products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getProducts({
                page,
                limit,
                search,
                category
            });

            const list = response.products ?? response.data ?? [];

            setProducts(list);
            setTotalProducts(response.total ?? list.length);
            setTotalPages(response.totalPages ?? 1);

        } catch (error) {
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Failed to fetch products'
                    : 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, category]);

    // Input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'price' || name === 'stock'
                    ? Number(value)
                    : value
        }));
    };

    // Open add form
    const handleAdd = () => {
        setEditId(null);

        setFormData({
            name: '',
            price: 0,
            category: '',
            description: '',
            stock: 0,
            image: ''
        });

        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (product: IProduct) => {
        setEditId(product._id);

        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            stock: product.stock,
            image: product.image || ''
        });

        setShowForm(true);
    };

    // Add / Update product
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setError('');

            if (editId) {
                // await updateProduct(editId, formData);
                await updateProduct({
                    ...formData,
                    id: editId
                });
            } else {
                await addProduct(formData);
            }

            setShowForm(false);

            // Refresh listing and count
            if (!editId) {
                setPage(1);
            } else {
                fetchProducts();
            }

        } catch (error) {
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Operation failed'
                    : 'Something went wrong'
            );
        }
    };

    // Delete product
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this product?'
        );

        if (!confirmDelete) return;

        try {
            setError('');

            await deleteProduct(id);

            // Refresh current page or previous page if it becomes empty
            if (products.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
            } else {
                fetchProducts();
            }

        } catch (error) {
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Delete failed'
                    : 'Something went wrong'
            );
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login', { replace: true });
    };


return (
    <div className="dashboard-wrapper">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">M</div>
                <div>
                    <h4>MERN<span>STACK</span></h4>
                    <small>ADMIN PANEL</small>
                </div>
            </div>

            <div className="sidebar-section">MAIN MENU</div>

            <div className="sidebar-link active">
                <span>▦</span> Dashboard
            </div>



            <div className="sidebar-bottom">
                <div className="sidebar-help">
                    <div className="help-icon">?</div>
                    <div>
                        <strong>Need help?</strong>
                        <small>Contact support</small>
                    </div>
                </div>
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="user-info">
                        <strong>{user?.name || 'Admin'}</strong>
                        <small>Administrator</small>
                    </div>
                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        ↗
                    </button>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">

            {/* Top Navbar */}
            <header className="dashboard-header">
                <div>
                    <div className="header-breadcrumb">
                        Pages / <strong>Dashboard</strong>
                    </div>
                    <h5>Dashboard Overview</h5>
                </div>

                <div className="header-right">
                    <div className="header-date">
                        <span>◷</span> Product Management
                    </div>

                    <div className="header-profile">
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <strong>{user?.name || 'Admin'}</strong>
                            <small>Admin Account</small>
                        </div>
                    </div>

                    <button
                        className="header-logout"
                        onClick={handleLogout}
                    >
                        Logout ↗
                    </button>
                </div>
            </header>

            <div className="dashboard-content">

                {/* Welcome Section */}
                <section className="welcome-section">
                    <div>
                        <span className="welcome-tag">
                            ✦ YOUR WORKSPACE
                        </span>
                        <h2>Welcome back, {user?.name || 'Admin'}!</h2>
                        <p>
                            Here's what's happening with your products today.
                        </p>
                    </div>

                    <button
                        className="add-product-btn"
                        onClick={handleAdd}
                    >
                        <span>＋</span> Add New Product
                    </button>
                </section>

                {/* Statistics */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-top">
                            <div className="stat-icon purple">▣</div>
                            <span className="stat-label">TOTAL PRODUCTS</span>
                        </div>
                        <h2>{totalProducts}</h2>
                        <p>Products in your inventory</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-top">
                            <div className="stat-icon blue">▦</div>
                            <span className="stat-label">CURRENT PAGE</span>
                        </div>
                        <h2>{products.length}</h2>
                        <p>Products displayed on this page</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-top">
                            <div className="stat-icon orange">⚠</div>
                            <span className="stat-label">LOW STOCK</span>
                        </div>
                        <h2>
                            {products.filter(p => p.stock <= 5).length}
                        </h2>
                        <p>Products with stock of 5 or less</p>
                    </div>
                </section>

                {/* Add / Edit Form */}
                {showForm && (
                    <section className="product-form-card">
                        <div className="form-heading">
                            <div>
                                <span className="form-subtitle">
                                    PRODUCT MANAGEMENT
                                </span>
                                <h4>
                                    {editId ? 'Edit Product' : 'Add New Product'}
                                </h4>
                                <p>Enter the product details below.</p>
                            </div>

                            <button
                                className="close-form-btn"
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        placeholder="Enter price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                        placeholder="Enter category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Available Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        className="form-control"
                                        placeholder="Enter stock quantity"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows={3}
                                        placeholder="Write product description..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">
                                        Product Image URL
                                    </label>
                                    <input
                                        type="text"
                                        name="image"
                                        className="form-control"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    {editId ? '✓ Update Product' : '＋ Save Product'}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Product Listing */}
                <section className="product-section">

                    <div className="product-section-header">
                        <div>
                            <h4>Product Inventory</h4>
                            <p>Manage and monitor all your products.</p>
                        </div>

                        <span className="total-badge">
                            {totalProducts} Products
                        </span>
                    </div>

                    {/* Search & Filter */}
                    <div className="filter-toolbar">
                        <div className="search-box">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search products by name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        <select
                            className="category-select"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Categories</option>
                            {Array.from(
                                new Set(products.map(p => p.category))
                            ).map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSearch('');
                                setCategory('');
                                setPage(1);
                            }}
                        >
                            ↻ Reset
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="alert alert-danger mx-3 mt-3">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table product-table align-middle">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>STOCK STATUS</th>
                                    <th>QUANTITY</th>
                                    <th className="text-center">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="empty-state">
                                            <div className="spinner-border text-primary mb-2" />
                                            <p>Loading products...</p>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="empty-state">
                                            <div className="empty-icon">▣</div>
                                            <h6>No products found</h6>
                                            <p>Try changing your search or add a new product.</p>
                                            <button
                                                className="add-product-btn"
                                                onClick={handleAdd}
                                            >
                                                ＋ Add Product
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(product => (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="product-info">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="product-thumbnail"
                                                        />
                                                    ) : (
                                                        <div className="product-placeholder">
                                                            ▣
                                                        </div>
                                                    )}

                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <small>
                                                            ID: {product._id.slice(-8)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <strong className="product-price">
                                                    ₹{product.price}
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="category-badge">
                                                    {product.category}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`stock-badge ${
                                                    product.stock === 0
                                                        ? 'out-stock'
                                                        : product.stock <= 5
                                                        ? 'low-stock'
                                                        : 'in-stock'
                                                }`}>
                                                    {product.stock === 0
                                                        ? 'Out of stock'
                                                        : product.stock <= 5
                                                        ? 'Low stock'
                                                        : 'In stock'}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>{product.stock}</strong>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="edit-action"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        ✎ Edit
                                                    </button>

                                                    <button
                                                        className="delete-action"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-footer">
                        <span>
                            Showing {products.length} of {totalProducts} products
                        </span>

                        <div className="pagination-controls">
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => setPage(prev => prev - 1)}
                            >
                                ← Previous
                            </button>

                            <span className="page-number">
                                {page} <small>/ {totalPages}</small>
                            </span>

                            <button
                                disabled={page >= totalPages || loading}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                </section>

                <footer className="dashboard-footer">
                    {/* © 2026 MERN Stack Admin Dashboard. All rights reserved. */}
                </footer>

            </div>
        </main>
    </div>
);

};

export default Dashboard;