import React, { useState } from 'react';
// @ts-ignore
import api from '../api';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>(''); // Email state
    const [password, setPassword] = useState<string>(''); // Password state
    const [error, setError] = useState<string | null>(null); // Error message state
  
    // Handle the login form submission
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent the default form submission
      setError(null); // Clear any previous errors
  
      try {
        // Send login request to the backend
        const response = await api.post('/auth/login', { email, password });
  
        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);
  
        // Redirect the user to the tasks page
        window.location.href = '/tasks';
      } catch (err: any) {
        // Handle any errors returned by the backend
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error); // Backend error message
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    };
  
    return (
      <div className="container mt-5">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  };
  
  export default LoginPage;