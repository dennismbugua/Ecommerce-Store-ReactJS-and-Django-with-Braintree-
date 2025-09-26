import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { emptyCart } from "./helper/CartHelper";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated, signout } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";


const PaymentB = ({
    products,
    reload = undefined,
    setReload = (f) => f,
}) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: null,
    });

    const userId = isAuthenticated() && isAuthenticated().user ? isAuthenticated().user.id : null;
    const token = isAuthenticated() && isAuthenticated().token ? isAuthenticated().token : null;

    const getToken = (userId, token) => {
        if (!userId || !token) {
            console.log('User not authenticated, redirecting...');
            setInfo(prevInfo => ({ ...prevInfo, error: 'Please sign in to continue with payment' }));
            return;
        }
        
        console.log('Fetching Braintree token for user:', userId);
        getmeToken(userId, token)
            .then((info) => {
                console.log('Token response:', info);
                if (info.error) {
                    console.error('Token error:', info.error);
                    setInfo({
                        ...info,
                        error: info.error,
                    });
                    signout(() => {
                        return <Redirect to="/" />;
                    });
                } else {
                    const clientToken = info.clientToken;
                    console.log('Client token received:', clientToken ? 'Yes' : 'No');
                    
                    // Decode and log the client token to check PayPal configuration
                    if (clientToken) {
                        try {
                            const decodedToken = JSON.parse(atob(clientToken));
                            console.log('PayPal enabled in token:', decodedToken?.paypal?.accessToken ? 'Yes' : 'No');
                            console.log('Environment from token:', decodedToken?.environment);
                        } catch (e) {
                            console.log('Could not decode token for PayPal check');
                        }
                    }
                    
                    setInfo(prevInfo => ({ ...prevInfo, clientToken, error: "" }));
                }
            })
            .catch((error) => {
                console.error('Token fetch error:', error);
                setInfo(prevInfo => ({ ...prevInfo, error: 'Failed to initialize payment system' }));
            });
    };

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const getAmount = () => {
        let amount = 0;
        products.map((p) => {
            amount = amount + parseInt(p.price);
        });
        return amount;
    };
    const onPurchase = () => {
        // Check authentication first
        if (!userId || !token) {
            alert('Please sign in to complete your purchase.');
            return;
        }

        // Check if instance is available
        if (!info.instance || typeof info.instance.requestPaymentMethod !== 'function') {
            console.error('Payment instance not available');
            alert('Payment form is not ready. Please refresh the page and try again.');
            return;
        }

        setInfo(prevInfo => ({ ...prevInfo, loading: true }));
        
        console.log("Requesting payment method from instance...");
        
        info.instance.requestPaymentMethod()
            .then((data) => {
                console.log("PAYMENT DATA RECEIVED:", data);
                console.log("Payment method type:", data.type);
                console.log("Payment method nonce:", data.nonce);
                
                // Handle different payment methods
                const isPayPal = data.type === 'PayPalAccount';
                console.log("Is PayPal payment:", isPayPal);
                
                if (isPayPal) {
                    console.log("PayPal payment details:", data.details);
                    console.log("PayPal payer info:", {
                        payerId: data.details?.payerId,
                        email: data.details?.email,
                        firstName: data.details?.firstName,
                        lastName: data.details?.lastName
                    });
                }

                const nonce = data.nonce;
                
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount(),
                    ...(isPayPal && {
                        payment_method: 'PayPalAccount',
                        paypal_data: JSON.stringify({
                            payerId: data.details?.payerId || '',
                            email: data.details?.email || '',
                            firstName: data.details?.firstName || '',
                            lastName: data.details?.lastName || '',
                            paypalPayerId: data.details?.payerId,
                            paypalFirstName: data.details?.firstName,
                            paypalLastName: data.details?.lastName
                        })
                    })
                };
                
                console.log("Enhanced payment data:", paymentData);
                return processPayment(userId, token, paymentData);
            })
            .catch((paymentMethodError) => {
                console.error("Payment method request error:", paymentMethodError);
                console.error("Error details:", {
                    name: paymentMethodError.name,
                    message: paymentMethodError.message,
                    type: paymentMethodError.type,
                    code: paymentMethodError.code
                });
                
                setInfo(prevInfo => ({ ...prevInfo, loading: false, error: paymentMethodError.message }));
                
                // Handle specific PayPal errors
                if (paymentMethodError.type === 'CUSTOMER_CANCELED') {
                    console.log("Customer canceled PayPal payment");
                    alert('PayPal payment was canceled. Please try again if you want to complete the purchase.');
                } else if (paymentMethodError.type === 'PAYPAL_POPUP_CLOSED') {
                    console.log("PayPal popup was closed");
                    alert('PayPal payment window was closed. Please try again.');
                } else if (paymentMethodError.message && paymentMethodError.message.toLowerCase().includes('paypal')) {
                    console.log("PayPal specific error");
                    alert('PayPal authentication failed: ' + paymentMethodError.message);
                } else {
                    console.log("General payment method error");
                    alert(`Payment method error: ${paymentMethodError.message || 'Unknown error'}`);
                }
                
                throw paymentMethodError; // Re-throw to stop the chain
            })
            .then((response) => {
                console.log("PAYMENT RESPONSE", response);
                
                if (response && response.error) {
                    console.error("Payment error:", response.error);
                    setInfo(prevInfo => ({ ...prevInfo, loading: false, error: response.error }));
                    
                    if (response.code == "1") {
                        console.log("PAYMENT Failed!");
                        signout(() => {
                            return <Redirect to="/" />;
                        });
                    } else {
                        alert(`Payment failed: ${response.error}`);
                    }
                    return null; // Stop the chain
                } else if (response && response.success) {
                    setInfo(prevInfo => ({ ...prevInfo, success: response.success, loading: false }));
                    console.log("PAYMENT SUCCESS", response);

                    let product_names = "";
                    products.forEach(function (item) {
                        product_names += item.name + ", ";
                    });

                    // Enhanced order data with transaction details
                    const orderData = {
                        products: product_names,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount,
                        payment_method: response.transaction.paymentInstrumentType || 'unknown',
                        transaction_status: response.transaction.status,
                        currency_code: response.transaction.currencyIsoCode || 'USD',
                        // Add PayPal specific fields if available
                        ...(response.transaction.paypal && {
                            paypal_payer_email: response.transaction.paypal.payerEmail,
                            paypal_payer_id: response.transaction.paypal.payerId,
                            paypal_authorization_id: response.transaction.paypal.authorizationId,
                            paypal_capture_id: response.transaction.paypal.captureId
                        }),
                        // Add timestamp
                        created_at: new Date().toISOString(),
                        // Include all products details for better record keeping
                        product_details: products.map(p => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            category: p.category
                        }))
                    };
                    
                    console.log("Enhanced order data:", orderData);
                    return createOrder(userId, token, orderData);
                }
            })
            .then((response) => {
                if (response && response.error) {
                    console.error("Order creation error:", response.error);
                    if (response.code == "1") {
                        console.log("Order Failed!");
                        signout(() => {
                            return <Redirect to="/" />;
                        });
                    } else {
                        alert(`Order creation failed: ${response.error}`);
                        setInfo(prevInfo => ({ ...prevInfo, loading: false }));
                    }
                } else if (response && response.success == true) {
                    console.log("ORDER PLACED SUCCESSFULLY!!", response);
                    
                    // Show success message based on payment method
                    const paymentMethod = response.payment_method || 'Card';
                    const successMessage = paymentMethod === 'PayPalAccount' 
                        ? 'PayPal payment successful! Your order has been placed.'
                        : 'Payment successful! Your order has been placed.';
                    
                    setInfo(prevInfo => ({ 
                        ...prevInfo, 
                        success: true, 
                        loading: false,
                        successMessage: successMessage
                    }));
                    
                    // Clear cart and reload
                    emptyCart(() => {
                        console.log("Cart emptied successfully after PayPal/Card payment");
                    });
                    
                    setReload(!reload);
                    
                    // Optional: Show detailed success info
                    if (response.transaction_id) {
                        console.log(`Transaction ID: ${response.transaction_id}`);
                        console.log(`Payment Method: ${paymentMethod}`);
                    }
                }
            })
            .catch((error) => {
                console.error("PAYMENT/ORDER ERROR:", error);
                setInfo(prevInfo => ({ ...prevInfo, loading: false, success: false }));
                
                // Enhanced error handling for PayPal
                if (error.message && error.message.includes('PayPal')) {
                    alert('PayPal payment failed. Please try again or use a different payment method.');
                } else if (error.message && error.message.includes('PAYMENT_METHOD_NONCE')) {
                    alert('Payment method error. Please refresh the page and try again.');
                } else {
                    console.log('Full error object:', error);
                    alert(`Payment failed: ${error.message || 'Unknown error'}. Please try again.`);
                }
            });
    };

    const showbtnDropIn = () => {
        return (
            <div>
                {info.error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        Error: {info.error}
                    </div>
                )}
                
                {info.success && (
                    <div style={{ 
                        color: 'green', 
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}>
                        <strong>✅ {info.successMessage || 'Payment successful! Order has been placed.'}</strong>
                        <div style={{ marginTop: '10px', fontSize: '14px' }}>
                            Your order is being processed and you will receive a confirmation email shortly.
                        </div>
                    </div>
                )}
                
                {info.clientToken === null ? (
                    <div>Loading payment system...</div>
                ) : products.length > 0 ? (
                    <div>
                        {/* Popup blocker warning */}
                        <div style={{ 
                            backgroundColor: '#fff3cd', 
                            border: '1px solid #ffeaa7', 
                            padding: '10px', 
                            marginBottom: '15px', 
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#856404'
                        }}>
                            <strong>Note:</strong> If you plan to use PayPal, please ensure popup blockers are disabled for this site. 
                            PayPal payments require a popup window to complete authentication.
                        </div>
                        
                        <DropIn
                            options={{ 
                                authorization: info.clientToken,
                                // Enhanced configuration for PayPal sandbox
                                card: {
                                    cardholderName: {
                                        required: false
                                    }
                                },
                                // PayPal configuration - trying vault flow for better popup stability
                                paypal: {
                                    flow: 'vault',
                                    // Remove amount and currency for vault flow
                                    // amount: getAmount().toFixed(2),
                                    // currency: 'USD',
                                    locale: 'en_US',
                                    
                                    // PayPal button styling
                                    buttonStyle: {
                                        size: 'responsive',
                                        color: 'blue',
                                        shape: 'rect',
                                        label: 'paypal',
                                        tagline: false,
                                        layout: 'horizontal'
                                    }
                                },
                                // Simplified data collector
                                dataCollector: {
                                    paypal: true
                                }
                            }}
                            onInstance={(instance) => {
                                console.log('DropIn instance ready:', instance);
                                setInfo(prevInfo => ({ ...prevInfo, instance: instance }));
                                
                                // Add PayPal specific event listeners for debugging
                                if (instance.on) {
                                    instance.on('paymentMethodRequestable', (event) => {
                                        console.log('Payment method requestable:', event);
                                    });
                                    
                                    instance.on('noPaymentMethodRequestable', (event) => {
                                        console.log('No payment method requestable:', event);
                                    });
                                    
                                    instance.on('paymentOptionSelected', (event) => {
                                        console.log('Payment option selected:', event.paymentOption);
                                        
                                        // If PayPal is selected, add additional debugging
                                        if (event.paymentOption === 'paypal') {
                                            console.log('PayPal option selected - popup should open');
                                            
                                            // Add a small delay to help with popup handling
                                            setTimeout(() => {
                                                console.log('PayPal popup should be visible now');
                                            }, 500);
                                        }
                                    });
                                    
                                    // Add PayPal specific events if available
                                    instance.on('paypalFlowStart', () => {
                                        console.log('PayPal flow started');
                                    });
                                    
                                    instance.on('paypalFlowEnd', (event) => {
                                        console.log('PayPal flow ended:', event);
                                    });
                                }
                            }}
                            onError={(error) => {
                                console.error('DropIn error:', error);
                                setInfo(prevInfo => ({ ...prevInfo, error: error.message }));
                                
                                // Specific error handling for PayPal
                                if (error.message && error.message.toLowerCase().includes('paypal')) {
                                    alert('PayPal configuration error: ' + error.message);
                                }
                            }}
                            onPaymentMethodRequestable={(event) => {
                                console.log('Payment method is requestable:', event);
                            }}
                            onNoPaymentMethodRequestable={() => {
                                console.log('No payment method is requestable');
                            }}
                        />
                        <button
                            onClick={onPurchase}
                            disabled={info.loading || !info.instance}
                            style={{ 
                                width: '100%',
                                marginTop: '20px', 
                                padding: '12px 20px',
                                backgroundColor: info.loading || !info.instance ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: info.loading || !info.instance ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {info.loading ? 'Processing Payment...' : `Buy Now - $${getAmount()}`}
                        </button>
                    </div>
                ) : (
                    <h3>Please add items to your cart first</h3>
                )}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            {!userId || !token ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>Authentication Required</h3>
                    <p>Please <a href="/signin">sign in</a> to continue with your purchase.</p>
                </div>
            ) : (
                <>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Your bill is ${getAmount()}
                    </h3>
                    {showbtnDropIn()}
                </>
            )}
        </div>
    );
};

export default PaymentB;