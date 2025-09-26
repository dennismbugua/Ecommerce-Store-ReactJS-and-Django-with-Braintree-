import React, { useState } from 'react'
import ImageHelper from './helper/ImageHelper';
import { Redirect } from 'react-router';
import { addItemToCart, removeItemFromCart } from './helper/CartHelper';
import { isAuthenticated } from "../auth/helper";
import { showCartAddedToast, showCartRemovedToast, showLoginRequiredToast } from './helper/ToastHelper';
import './Card.css';

const Card = ({
    product,
    addtoCart = true,
    removeFromCart = false,
    reload = undefined,
    setReload = (f) => f,
    onRemoveClick = null, // Optional callback for remove confirmation
    // function(f){return f}
}) => {
    const [redirect, setRedirect] = useState(false);

    const cartTitle = product ? product.name : "A photo from pexels";
    const cartDescription = product ? product.description : "Default description";
    const cartPrice = product ? product.price : "Default";

    const addToCart = () => {
        if (isAuthenticated()) {
            addItemToCart(product, () => setRedirect(true));
            showCartAddedToast(product.name);
            console.log("Added to cart");
        } else {
            showLoginRequiredToast();
            console.log("Login Please!");
        }
    };

    const showAddToCart = (addToCart) => {
        return (
            addtoCart && (
                <button
                    onClick={addToCart}
                    className="modern-btn modern-btn-primary"
                >
                    <i className="fas fa-plus"></i>
                    Add to Cart
                </button>
            )
        );
    };

    const showRemoveFromCart = (removeFromCart) => {
        return (
            removeFromCart && (
                <button
                    onClick={() => {
                        if (onRemoveClick) {
                            // Use the callback if provided (for modal confirmation)
                            onRemoveClick();
                        } else {
                            // Direct removal for other cases
                            removeItemFromCart(product.id);
                            setReload(!reload);
                            showCartRemovedToast(product.name);
                            console.log("Product removed from cart");
                        }
                    }}
                    className="modern-btn modern-btn-danger"
                >
                    <i className="fas fa-trash"></i>
                    Remove from cart
                </button>
            )
        );
    };

    return (
        <div className="modern-card">
            <div className="modern-card-header">
                <h5 className="card-title">{cartTitle}</h5>
                <span className="price-badge">${cartPrice}</span>
            </div>
            <div className="modern-card-body">
                <div className="image-container">
                    <ImageHelper product={product} />
                </div>
                <p className="card-description">
                    {cartDescription}
                </p>
                <div className="card-actions">
                    {showAddToCart(addToCart)}
                    {showRemoveFromCart(removeFromCart)}
                </div>
            </div>
        </div>
    );
};

export default Card;