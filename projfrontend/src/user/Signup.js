import React, { useState } from "react";
import Base from "../core/base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";
import { showErrorToast, showSuccessToast } from "../core/helper/ToastHelper";

import './Signup.css';


const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        error: "",
        success: false,
        loading: false,
    });
    const { name, email, password, gender, error, success, loading } = values;

    const handleChange = (name) =>
        (event) => {
            setValues({ ...values, error: false, [name]: event.target.value });
        };

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        
        // Basic validation
        if (!name || !email || !password) {
            setValues({ ...values, error: true, loading: false });
            showErrorToast("Please fill in all required fields");
            return;
        }

        if (password.length < 6) {
            setValues({ ...values, error: true, loading: false });
            showErrorToast("Password must be at least 6 characters long");
            return;
        }

        signup({ name, email, gender, password })
            .then((data) => {
                console.log("DATA", data);
                if (data.email === email) {
                    setValues({
                        ...values,
                        name: "",
                        email: "",
                        password: "",
                        gender: "",
                        error: "",
                        success: true,
                        loading: false,
                    });
                    showSuccessToast("Account created successfully! Please sign in to continue.");
                } else {
                    setValues({
                        ...values,
                        error: true,
                        success: false,
                        loading: false,
                    });
                    showErrorToast("Something went wrong. Please check your information and try again.");
                }
            })
            .catch((e) => {
                console.log(e);
                setValues({ ...values, error: true, loading: false });
                showErrorToast("Network error. Please try again.");
            });
    };

    const loadingMessage = () => {
        return (
            loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Creating your account...</p>
                </div>
            )
        );
    };

    const successMessage = () => {
        return (
            success && (
                <div className="success-message">
                    <div className="success-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>Account Created Successfully! 🎉</h3>
                    <p>Welcome to our clothing store! You can now sign in to start shopping.</p>
                    <Link to="/signin" className="success-button">
                        <i className="fas fa-sign-in-alt"></i>
                        Sign In Now
                    </Link>
                </div>
            )
        );
    };

    const errorMessage = () => {
        return null; // Using toast notifications instead
    };

    const signUpForm = () => {
        if (success) return null; // Don't show form if successful

        return (
            <div className="signup-form-container">
                <div className="signup-form-wrapper">
                    <div className="signup-form-header">
                        <div className="signup-icon">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <h2 className="signup-title">Create Your Account</h2>
                        <p className="signup-subtitle">Join thousands of happy customers</p>
                    </div>

                    <form className="signup-form" onSubmit={onSubmit}>
                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    className="form-input"
                                    value={name}
                                    onChange={handleChange("name")}
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                />
                                <label className="form-label">Full Name *</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    className="form-input"
                                    value={email}
                                    onChange={handleChange("email")}
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                />
                                <label className="form-label">Email Address *</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className="fas fa-venus-mars input-icon"></i>
                                <select 
                                    value={gender} 
                                    onChange={handleChange("gender")} 
                                    className="form-input form-select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="N.S.">Prefer not to say</option>
                                </select>
                                <label className="form-label">Gender (Optional)</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    className="form-input"
                                    value={password}
                                    onChange={handleChange("password")}
                                    type="password"
                                    placeholder="Password"
                                    minLength="6"
                                    required
                                />
                                <label className="form-label">Password *</label>
                            </div>
                            <div className="password-strength">
                                <small>Password must be at least 6 characters long</small>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus"></i>
                                    Create Account
                                </>
                            )}
                        </button>

                        <div className="signin-link">
                            <p>Already have an account?</p>
                            <Link to="/signin" className="link-button">
                                <i className="fas fa-sign-in-alt"></i>
                                Sign In Instead
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <Base 
            title="Join Our Community! 🛍️" 
            description="Create your account and discover amazing fashion deals, exclusive offers, and personalized shopping experience"
        >
            <div className="signup-page">
                {loadingMessage()}
                {successMessage()}
                {signUpForm()}
            </div>
        </Base>
    );

};

export default Signup


