import { API } from "../../backend"


export const getProducts = () => {
    return fetch(`${API}products`, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(err => {
            console.error("getProducts error:", err);
            // Return an error object instead of undefined
            return { error: err.message || "Failed to fetch products" };
        });
};