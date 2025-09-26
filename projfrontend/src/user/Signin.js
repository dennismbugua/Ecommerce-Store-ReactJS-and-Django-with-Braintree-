import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import Base from "../core/base";
import { signin, authenticate, isAuthenticated } from "../auth/helper";
import { showErrorToast, showSuccessToast, showInfoToast } from "../core/helper/ToastHelper";

import './Signin.css';

const Signin = () => {
    const [values, setValues] = useState({
        name: "",
        email: "dennis@starlaunch.org",
        password: "123456",
        error: "",
        success: false,
        loading: false,
        didRedirect: false,
    });
    const { email, password, error, success, loading, didRedirect } =
        values;

    const handleChange = (name) =>
        (event) => {
            setValues({ ...values, error: false, [name]: event.target.value });
        };

    const onSumit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });

        signin({ email, password })
            .then((data) => {
                console.log("DATA", data);
                if (data.token) {
                    //let sessionToken = data.token;
                    authenticate(data, () => {
                        console.log("TOKKEN ADDED");
                        showSuccessToast("🎉 Welcome back! Signing you in...");
                        setValues({
                            ...values,
                            didRedirect: true,
                        });
                    });
                } else {
                    setValues({
                        ...values,
                        loading: false,
                        error: true
                    });
                    showErrorToast("❌ Invalid email or password. Please try again.");
                }
            })
            .catch((e) => console.log(e));
    };

    const performRedirect = () => {
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    };

    const loadingMessage = () => {
        return (
            loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Signing you in...</p>
                </div>
            )
        );
    };

    const successMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div
                        className="alert alert-success"
                        style={{ display: success ? "" : "none" }}
                    >
                        New account created successfully. Please <Link
                            to="/signin"
                        >
                            login now.
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const errorMessage = () => {
        return null; // Using toast notifications instead
    };

    const signInForm = () => {
        return (
            <div className="signin-container">
                <div className="signin-card">
                    <div className="signin-header">
                        <div className="signin-icon">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <h2 className="signin-title">Welcome Back</h2>
                        <p className="signin-subtitle">Sign in to your account</p>
                    </div>
                    
                    <form className="signin-form" onSubmit={onSumit}>
                        <div className="input-group">
                            <div className="input-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <input
                                name="email"
                                className="modern-input"
                                value={email}
                                onChange={handleChange("email")}
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                            <label className="input-label">Email Address</label>
                        </div>
                        
                        <div className="input-group">
                            <div className="input-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <input
                                name="password"
                                className="modern-input"
                                value={password}
                                onChange={handleChange("password")}
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                            <label className="input-label">Password</label>
                        </div>
                        
                        <div className="form-options">
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>
                        
                        <button
                            type="submit"
                            className="signin-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                        
                        <div className="signup-link">
                            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                        </div>
                    </form>
                </div>
                
                {loadingMessage()}
            </div>
        );
    };

    return (
        <Base
            title="Welcome Back! 👋"
            description="Sign in to your account to continue shopping and access your personal dashboard"
        >
            <div className="signin-page">
                {signInForm()}
                {performRedirect()}
            </div>
        </Base>
    )
}

export default Signin
