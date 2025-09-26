import { API } from "../../backend";

export const getmeToken = (userId, token) => {
  return fetch(`${API}payment/gettoken/${userId}/${token}/`, {
    method: "GET",
  })
    .then((response) => {
      console.log(response)
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const processPayment = (userId, token, paymentInfo) => {
  const formData = new FormData();

  for (const name in paymentInfo) {
    // Handle nested objects (like paymentDetails) by stringifying them
    if (typeof paymentInfo[name] === 'object' && paymentInfo[name] !== null) {
      formData.append(name, JSON.stringify(paymentInfo[name]));
    } else {
      formData.append(name, paymentInfo[name]);
    }
  }

  console.log("Sending payment data to backend:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return fetch(`${API}payment/process/${userId}/${token}/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Payment process response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Payment process data:", data);
      return data;
    })
    .catch((error) => {
      console.error("Payment process error:", error);
      throw error;
    });
};
