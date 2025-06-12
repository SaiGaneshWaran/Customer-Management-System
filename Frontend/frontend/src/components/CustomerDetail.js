import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomer } from '../services/api';

const CustomerDetail = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await getCustomer(id);
                setCustomer(response.data);
            } catch (error) {
                console.error("Failed to fetch customer details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    if (loading) {
        return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
    }

    if (!customer) {
        return <div className="alert alert-danger">Customer not found.</div>;
    }

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>{customer.name}</h3>
                <Link to={`/customers/${id}/edit`} className="btn btn-warning">Edit Customer</Link>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <h5>Personal Details</h5>
                        <p><strong>NIC Number:</strong> {customer.nicNumber}</p>
                        <p><strong>Date of Birth:</strong> {customer.dateOfBirth}</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Mobile Numbers</h5>
                        {customer.mobileNumbers && customer.mobileNumbers.length > 0 ? (
                            <ul>
                                {customer.mobileNumbers.map((num, index) => <li key={index}>{num}</li>)}
                            </ul>
                        ) : <p>No mobile numbers provided.</p>}
                    </div>
                </div>
                <hr />
                <h5>Addresses</h5>
                {customer.addresses && customer.addresses.length > 0 ? (
                    customer.addresses.map((addr, index) => (
                        <div key={index} className="mb-2 p-2 border rounded">
                            <p className="mb-0">{addr.addressLine1}</p>
                            {addr.addressLine2 && <p className="mb-0">{addr.addressLine2}</p>}
                            <p className="mb-0">{addr.cityName}, {addr.countryName}</p>
                        </div>
                    ))
                ) : <p>No addresses provided.</p>}
            </div>
        </div>
    );
};

export default CustomerDetail;