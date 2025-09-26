import React, { useState, useEffect } from "react";
import Base from "./base";
import Card from "./Card";
import Modal from "./Modal";
import { loadCart } from "./helper/CartHelper";
import { showCartRemovedToast } from "./helper/ToastHelper";
import PaymentB from "./PaymentB";
import "./Cart.css";

const Cart = () => {
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    productToRemove: null,
    productName: ''
  });

  useEffect(() => {
    // Simulate loading state for smooth animation
    setIsLoading(true);
    setTimeout(() => {
      setProducts(loadCart());
      setIsLoading(false);
      setAnimateIn(true);
    }, 500);
  }, [reload]);

  const calculateTotal = () => {
    return products.reduce((total, product) => total + parseFloat(product.price || 0), 0).toFixed(2);
  };

  // Handle modal confirmation for item removal
  const handleRemoveItem = (product) => {
    setModalState({
      isOpen: true,
      productToRemove: product,
      productName: product.name
    });
  };

  const confirmRemoveItem = () => {
    if (modalState.productToRemove) {
      // Import and use removeItemFromCart directly here
      import('./helper/CartHelper').then(({ removeItemFromCart }) => {
        removeItemFromCart(modalState.productToRemove.id);
        setReload(!reload);
        showCartRemovedToast(modalState.productName);
      });
    }
    setModalState({ isOpen: false, productToRemove: null, productName: '' });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, productToRemove: null, productName: '' });
  };

  const loadAllProducts = (products) => {
    return (
      <div className="cart-products-container">
        <div className="cart-header">
          <h2 className="cart-title">
            <i className="fas fa-shopping-cart"></i>
            Shopping Cart ({products.length} items)
          </h2>
          <div className="cart-total-badge">
            Total: ${calculateTotal()}
          </div>
        </div>
        
        <div className="products-list">
          {products.map((product, index) => (
            <div 
              key={index} 
              className={`product-item-wrapper ${animateIn ? 'animate-in' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                product={product}
                removeFromCart={true}
                addtoCart={false}
                reload={reload}
                setReload={setReload}
                onRemoveClick={() => handleRemoveItem(product)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmptyCart = () => {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h3 className="empty-cart-title">Your Cart is Empty</h3>
          <p className="empty-cart-message">
            Looks like you haven't added any products to your cart yet.
          </p>
          <div className="empty-cart-animation">
            <div className="floating-items">
              <i className="fas fa-star"></i>
              <i className="fas fa-heart"></i>
              <i className="fas fa-gift"></i>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCheckoutSection = () => {
    return (
      <div className="checkout-section">
        <div className="checkout-container">
          <div className="checkout-header">
            <h2 className="checkout-title">
              <i className="fas fa-credit-card"></i>
              Checkout
            </h2>
          </div>
          
          {products.length > 0 ? (
            <div className="payment-wrapper">
              <div className="order-summary">
                <h4>Order Summary</h4>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Items ({products.length})</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="summary-row total-row">
                    <strong>
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </strong>
                  </div>
                </div>
              </div>
              
              <PaymentB products={products} setReload={setReload} />
            </div>
          ) : (
            <div className="checkout-empty">
              <div className="checkout-empty-content">
                <i className="fas fa-lock"></i>
                <h4>Ready to Checkout?</h4>
                <p>Add some products to your cart to proceed with payment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Base title="Cart page" description="Welcome to checkout">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </Base>
    );
  }

  return (
    <Base title="Cart page" description="Welcome to checkout">
      <div className="cart-container">
        <div className="cart-layout">
          <div className="cart-products-section">
            {products.length > 0 ? loadAllProducts(products) : renderEmptyCart()}
          </div>
          
          <div className="cart-checkout-section">
            {renderCheckoutSection()}
          </div>
        </div>
      </div>
      
      {/* Removal Confirmation Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmRemoveItem}
        type="warning"
        title="Remove Item from Cart"
        message={`Are you sure you want to remove "${modalState.productName}" from your cart? This action cannot be undone.`}
        confirmText="Remove Item"
        cancelText="Keep Item"
      />
    </Base>
  );
};

export default Cart;
