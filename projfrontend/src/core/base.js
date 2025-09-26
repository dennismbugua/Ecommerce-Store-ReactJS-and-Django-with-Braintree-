import React from 'react'
import Menu from './Menu';
import './base.css';

const Base = ({
    title = "My title",
    description = "My description",
    className = "",
    children
}) => {
    return (
        <div className="base-container">
            <Menu />
            <div className="base-content">
                {(title || description) && (
                    <div className="base-header">
                        <div className="base-header-content">
                            <h1 className="base-title">{title}</h1>
                            <p className="base-description">{description}</p>
                        </div>
                    </div>
                )}
                <div className={`base-body ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Base;