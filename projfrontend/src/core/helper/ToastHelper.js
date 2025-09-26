import { toast } from 'react-toastify';

// Enhanced toast notifications with consistent styling and animations
export const showSuccessToast = (message, options = {}) => {
    return toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        ...options
    });
};

export const showErrorToast = (message, options = {}) => {
    return toast.error(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        ...options
    });
};

export const showWarningToast = (message, options = {}) => {
    return toast.warn(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        ...options
    });
};

export const showInfoToast = (message, options = {}) => {
    return toast.info(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        ...options
    });
};

// Specialized cart notifications
export const showCartAddedToast = (productName) => {
    return showSuccessToast(`🛒 ${productName} added to your cart!`);
};

export const showCartRemovedToast = (productName) => {
    return showWarningToast(`🗑️ ${productName} removed from your cart`);
};

export const showLoginRequiredToast = () => {
    return showInfoToast('🔐 Please sign in to add items to your cart');
};

export const showCartEmptyToast = () => {
    return showInfoToast('🛒 Your cart has been emptied');
};