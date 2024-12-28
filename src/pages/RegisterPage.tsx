import React, { useState } from 'react';
// @ts-ignore
import api from '../api';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState<string>(''); // Name state
    const [email, setEmail] = useState<string>(''); // Email state
    const [password, setPassword] = useState<string>(''); // Password state
    const [error, setError] = useState<string | null>(null); // Error state
    const [success, setSuccess] = useState<string | null>(null); // Success message state

    // Handle form submission
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Clear any previous errors
        setSuccess(null); // Clear previous success messages

        try {
            // Send a POST request to the register endpoint
            const response = await api.post('/auth/register', { name, email, password });
            setSuccess('Registration successful! You can now log in.');
            setName(''); // Clear the name field
            setEmail(''); // Clear the email field
            setPassword(''); // Clear the password field
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Failed to register. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                {success && <div className="alert alert-success">{success}</div>}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
