import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import BulkUpload from './components/BulkUpload';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <header className="mb-4">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">Customer CMS</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customers">Customers</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/upload">Bulk Upload</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            <Route path="/upload" element={<BulkUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;