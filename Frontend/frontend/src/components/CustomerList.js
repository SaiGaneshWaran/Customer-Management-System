import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/api';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async (currentPage) => {
        setLoading(true);
        try {
            const response = await getCustomers(currentPage, 10);
            setCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                fetchCustomers(page);
            } catch (error) {
                console.error("Failed to delete customer:", error);
                alert('Failed to delete customer.');
            }
        }
    };

    if (loading) {
        return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
    }

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Customer List</h3>
                <Link to="/customers/new" className="btn btn-primary">Add New Customer</Link>
            </div>
            <div className="card-body">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>NIC Number</th>
                            <th>Date of Birth</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.nicNumber}</td>
                                <td>{customer.dateOfBirth}</td>
                                <td>
                                    <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-info me-2">View</Link>
                                    <Link to={`/customers/${customer.id}/edit`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                    <button onClick={() => handleDelete(customer.id)} className="btn btn-sm btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="card-footer">
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">Page {page + 1} of {totalPages}</span>
                        </li>
                        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CustomerList;