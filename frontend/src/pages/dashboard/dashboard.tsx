import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                await updateProduct(editId, formData);
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
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <nav className="navbar bg-white shadow-sm px-4">
                <span className="navbar-brand fw-bold">
                    MERN Admin
                </span>

                <div className="d-flex align-items-center gap-3">
                    <span>Welcome, {user?.name}</span>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container py-4">

                {/* Top Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">
                            Product Management
                        </h3>

                        <p className="text-muted mb-0">
                            Manage your products here
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleAdd}
                    >
                        + Add Product
                    </button>
                </div>

                {/* Product Count */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="text-muted mb-1">
                                    Total Products
                                </p>

                                <h2 className="fw-bold mb-0">
                                    {totalProducts}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-3">
                                {editId ? 'Update Product' : 'Add Product'}
                            </h5>

                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Category
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">
                                            Image URL
                                        </label>

                                        <input
                                            type="text"
                                            name="image"
                                            className="form-control"
                                            value={formData.image}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                >
                                    {editId ? 'Update Product' : 'Save Product'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row">

                            <div className="col-md-6 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search product name..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            <div className="col-md-4 mb-2">
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All Categories</option>

                                    {Array.from(
                                        new Set(products.map((p) => p.category))
                                    ).map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2 mb-2">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => {
                                        setSearch('');
                                        setCategory('');
                                        setPage(1);
                                    }}
                                >
                                    Reset
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Product Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body">

                        <h5 className="fw-bold mb-3">
                            Product Listing
                        </h5>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Loading products...
                                            </td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            width="45"
                                                            height="45"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        'No Image'
                                                    )}
                                                </td>

                                                <td>{product.name}</td>

                                                <td>₹{product.price}</td>

                                                <td>{product.category}</td>

                                                <td>{product.stock}</td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted">
                                Total: {totalProducts} products
                            </span>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={page === 1 || loading}
                                    onClick={() => setPage((prev) => prev - 1)}
                                >
                                    Previous
                                </button>

                                <span className="align-self-center">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={page >= totalPages || loading}
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;