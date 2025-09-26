export const addItemToCart = (item, next) => {
    let cart = []
    if (typeof window != undefined) {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        cart.push({
            ...item,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        next();
    }
};

export const loadCart = () => {
    if (typeof window !== undefined) {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart"));
        }
    }
    return []; // Always return an empty array if no cart exists
};

export const removeItemFromCart = (productId) => {
    let cart = [];
    if (typeof window != undefined) {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        }

        cart.map((product, i) => {
            if (product.id === productId) {
                cart.splice(i, 1);
            }
        })
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    return cart
}

export const emptyCart = (next) => {
    if (typeof window != undefined) {
        localStorage.removeItem("cart");
        let cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        next();
    }
};