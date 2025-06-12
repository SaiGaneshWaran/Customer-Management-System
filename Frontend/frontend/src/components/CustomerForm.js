import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [customer, setCustomer] = useState({
        name: '',
        nicNumber: '',
        dateOfBirth: '',
        mobileNumbers: [''],
        addresses: [{ addressLine1: '', addressLine2: '', countryId: '', cityId: '' }],
    });

    const [countries, setCountries] = useState([]);
    const [citiesByAddress, setCitiesByAddress] = useState([[]]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError('');
            try {
                const countriesRes = await api.getCountries();
                setCountries(countriesRes.data);

                if (isEditing) {
                    const customerRes = await api.getCustomer(id);
                    const customerData = customerRes.data;
                    
                    const citiesPromises = customerData.addresses.map(addr =>
                        api.getCitiesByCountry(addr.city.country.id)
                    );
                    const citiesResults = await Promise.all(citiesPromises);
                    setCitiesByAddress(citiesResults.map(res => res.data));

                    setCustomer({
                        ...customerData,
                        mobileNumbers: customerData.mobileNumbers?.length ? customerData.mobileNumbers : [''],
                        addresses: customerData.addresses?.length ? customerData.addresses.map(addr => ({ 
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2,
                            countryId: addr.city.country.id,
                            cityId: addr.city.id
                        })) : [{ addressLine1: '', addressLine2: '', countryId: '', cityId: '' }],
                    });
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError('Failed to load required data. Please ensure the backend is running and refresh.');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...customer.addresses];
        newAddresses[index][field] = value;
        
        if (field === 'countryId') {
            newAddresses[index]['cityId'] = ''; 
            fetchCitiesForAddress(index, value);
        }
        setCustomer(prev => ({ ...prev, addresses: newAddresses }));
    };
    
    const fetchCitiesForAddress = async (index, countryId) => {
        setError(''); // Clear previous errors
        if (!countryId) {
            setCitiesByAddress(prev => {
                const newCities = [...prev];
                newCities[index] = [];
                return newCities;
            });
            return;
        }
        try {
            const res = await api.getCitiesByCountry(countryId);
            setCitiesByAddress(prev => {
                const newCities = [...prev];
                newCities[index] = res.data;
                return newCities;
            });
        } catch (error) {
            console.error("Failed to fetch cities:", error);
            setError("Could not load cities for the selected country.");
        }
    };
    
    const addAddressField = () => {
        setCustomer(prev => ({ ...prev, addresses: [...prev.addresses, { addressLine1: '', addressLine2: '', countryId: '', cityId: '' }] }));
        setCitiesByAddress(prev => [...prev, []]);
    };
    
    const removeAddressField = (index) => {
        if (customer.addresses.length > 1) {
            setCustomer(prev => ({ ...prev, addresses: prev.addresses.filter((_, i) => i !== index) }));
            setCitiesByAddress(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleMobileChange = (index, value) => {
        const newMobileNumbers = [...customer.mobileNumbers];
        newMobileNumbers[index] = value;
        setCustomer(prev => ({ ...prev, mobileNumbers: newMobileNumbers }));
    };

    const addMobileField = () => {
        setCustomer(prev => ({ ...prev, mobileNumbers: [...prev.mobileNumbers, ''] }));
    };


    const removeMobileField = (index) => {
        if (customer.mobileNumbers.length > 1) {
            setCustomer(prev => ({ ...prev, mobileNumbers: prev.mobileNumbers.filter((_, i) => i !== index)}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                name: customer.name,
                nicNumber: customer.nicNumber,
                dateOfBirth: customer.dateOfBirth,
                mobileNumbers: customer.mobileNumbers.filter(num => num.trim() !== ''),
                addresses: customer.addresses.map(addr => ({
                    addressLine1: addr.addressLine1,
                    addressLine2: addr.addressLine2,
                    cityId: addr.cityId,
                })).filter(addr => addr.cityId), // Only include addresses where a city is selected
                familyMemberIds: customer.familyMemberIds || [],
            };
            if (isEditing) {
                await api.updateCustomer(id, payload);
            } else {
                await api.createCustomer(payload);
            }
            navigate('/customers');
        } catch (err) {
            console.error('Failed to save customer:', err);
            setError(err.response?.data?.message || 'Failed to save customer. An unknown error occurred.');
        }
    };


    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-header"><h3>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h3></div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <fieldset className="mb-4">
                        <legend className="h5">Personal Details</legend>
                        <div className="mb-3"><label htmlFor="name" className="form-label">Full Name</label><input type="text" className="form-control" id="name" name="name" value={customer.name} onChange={handleChange} required /></div>
                        <div className="mb-3"><label htmlFor="nicNumber" className="form-label">NIC Number</label><input type="text" className="form-control" id="nicNumber" name="nicNumber" value={customer.nicNumber} onChange={handleChange} required disabled={isEditing} /></div>
                        <div className="mb-3"><label htmlFor="dateOfBirth" className="form-label">Date of Birth</label><input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" value={customer.dateOfBirth} onChange={handleChange} required /></div>
                    </fieldset>

                    <fieldset className="mb-4">
                         <legend className="h5">Mobile Numbers</legend>
                        {customer.mobileNumbers.map((num, index) => (
                            <div key={index} className="input-group mb-2">
                                <input type="tel" className="form-control" value={num} onChange={(e) => handleMobileChange(index, e.target.value)} placeholder="Enter mobile number"/>
                                {customer.mobileNumbers.length > 1 && (<button type="button" className="btn btn-outline-danger" onClick={() => removeMobileField(index)}>Remove</button>)}
                            </div>
                        ))}
                        <button type="button" className="btn btn-sm btn-secondary" onClick={addMobileField}>Add Another Number</button>
                    </fieldset>

                    {/* RE-ADD THE CITY DROPDOWN */}
                    <fieldset className="mb-4">
                        <legend className="h5">Addresses</legend>
                        {customer.addresses.map((addr, index) => (
                            <div key={index} className="p-3 border rounded mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Address {index + 1}</h6>
                                    {customer.addresses.length > 1 && (<button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeAddressField(index)}>Remove Address</button>)}
                                </div>
                                <div className="mb-2"><label className="form-label">Address Line 1</label><input type="text" className="form-control" value={addr.addressLine1} onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)} required/></div>
                                <div className="mb-2"><label className="form-label">Address Line 2</label><input type="text" className="form-control" value={addr.addressLine2} onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)} /></div>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Country</label>
                                        <select className="form-select" value={addr.countryId} onChange={(e) => handleAddressChange(index, 'countryId', e.target.value)} required>
                                            <option value="">Select a Country</option>
                                            {countries.map(country => (<option key={country.id} value={country.id}>{country.name}</option>))}
                                        </select>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                         <button type="button" className="btn btn-sm btn-secondary" onClick={addAddressField}>Add Another Address</button>
                    </fieldset>

                    <button type="submit" className="btn btn-primary px-4">Save Customer</button>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;