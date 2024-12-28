import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Check if the user is logged in
    const [theme, setTheme] = useState<'light' | 'dark'>('light'); // State for theme

    // Apply the theme to the document when it changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme); // Set the theme attribute on the root element
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/'); // Redirect to the login page
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                {/* Logo/Brand */}
                <Link to="/" className="navbar-brand">Task Manager</Link>

                {/* Collapsible Section */}
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                        ) : null}
                    </ul>
                    {/* Theme Toggle Button */}
                    <button
                        className="btn btn-outline-secondary me-2"
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    </button>
                    {/* Logout Button */}
                    {token && (
                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
