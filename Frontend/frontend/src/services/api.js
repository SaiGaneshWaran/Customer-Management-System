import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});


export const getCustomers = (page = 0, size = 10) => api.get(`/customers?page=${page}&size=${size}`);
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (customer) => api.post('/customers', customer);
export const updateCustomer = (id, customer) => api.put(`/customers/${id}`, customer);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const uploadFile = (formData) => api.post('/customers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});


// --- Master Data API (Updated) ---
export const getCountries = () => api.get('/countries');

// NEW: This function fetches cities for a *specific* country ID
export const getCitiesByCountry = (countryId) => {
    // If no countryId is provided, don't make a request.
    if (!countryId) {
        return Promise.resolve({ data: [] });
    }
    return api.get(`/cities?countryId=${countryId}`);
};


export default api;