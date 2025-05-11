import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Dashboard.css";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";

/**
 * Dashboard component for displaying and managing user products.
 * Allows file uploads for product imports and handles logout.
 *
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch products with pagination
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get(`/products?page=${page}`);
      setProducts(response.data.data.data || []);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle file upload
  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);
      if (!data.file[0]) {
        setError("Please select a CSV file");
        return;
      }

      const formData = new FormData();
      formData.append("file", data.file[0]);

      await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("File uploaded successfully");
      fetchProducts(pagination.current_page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload file");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.message || "Logout failed. Please try again.");
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
      fetchProducts(page);
    }
  };

  return (
    <div className="dashboard">
      {/* Logout Button */}
      <div className="logout-section">
        <button
          onClick={handleLogout}
          disabled={isSubmitting}
          className="logout-btn"
          aria-label="Log out"
        >
          Logout
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* File Upload Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="upload-form">
        <div className="form-field">
          <label htmlFor="file" className="form-label">
            Upload CSV File
          </label>
          <input
            type="file"
            id="file"
            accept=".csv"
            {...register("file", {
              required: "Please select a CSV file",
              validate: (files) =>
                files[0]?.type === "text/csv" || "Only CSV files are allowed",
            })}
            className="file-upload"
          />
          {errors.file && (
            <p className="error-text">{errors.file.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="upload-btn"
        >
          {isSubmitting ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {/* Products Table */}
      {loading ? (
        <div className="loading-text">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products-text">No products found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="pagination-btn"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="pagination-text">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="pagination-btn"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;