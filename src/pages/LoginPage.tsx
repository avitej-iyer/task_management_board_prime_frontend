import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import api from '../api';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>(''); 
    const [password, setPassword] = useState<string>(''); 
    const [error, setError] = useState<string | null>(null); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/tasks';
        } catch (err: any) {
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="text-center mt-3">
                        <Link to="/register" className="text-decoration-none">Register a new account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
