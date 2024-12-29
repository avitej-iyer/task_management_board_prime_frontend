import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const token = localStorage.getItem('token'); // Check if the user is logged in

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/'); // Redirect to the login page
    };

    // Determine if we are on the login or register page
    const isAuthPage = location.pathname === '/' || location.pathname === '/register';

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                {/* Branding Text */}
                <span className="navbar-brand mb-0 h1">Task Manager</span>

                {/* Collapsible Section for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!token && !isAuthPage && (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                        {token && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
