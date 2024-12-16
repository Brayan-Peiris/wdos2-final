document.addEventListener('DOMContentLoaded', () => {
    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert("No items in the cart. Please go back to the order page.");
        window.location.href = "index.html"; // Redirect to order page if cart is empty
        return;
    }

    // Function to display the cart summary
    function displayCartSummary() {
        const cartTable = document.querySelector('#cart-summary tbody');
        const totalPriceElem = document.getElementById('total-price');
        let totalPrice = 0;

        cartTable.innerHTML = ''; // Clear the table
        
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
            `;
            cartTable.appendChild(row);

            totalPrice += item.total;
        });

        totalPriceElem.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;
    }

    displayCartSummary();

    // Show/hide card details based on payment method selection
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const cardDetails = document.getElementById('card-details');
            if (document.getElementById('card-payment').checked) {
                cardDetails.style.display = 'block'; // Show card payment details
            } else {
                cardDetails.style.display = 'none'; // Hide card payment details
            }
        });
    });

    // Function to calculate the delivery date (3-5 business days)
    function calculateDeliveryDate() {
        const today = new Date();
        let deliveryDate = new Date(today);
        
        // Randomly pick between 3, 4, or 5 business days
        const businessDaysToAdd = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
        
        let addedDays = 0;
        while (addedDays < businessDaysToAdd) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            // Skip weekends
            if (deliveryDate.getDay() !== 6 && deliveryDate.getDay() !== 0) {
                addedDays++;
            }
        }
        
        return deliveryDate.toDateString(); // Return the date in a human-readable format
    }

    // Handle the form submission for payment
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Personal details validation
        const fullName = document.getElementById('full-name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        // Regular expressions for validation
        const nameRegex = /^[A-Za-z\s]+$/;  // Only letters and spaces
        const phoneRegex = /^\d{10}$/;      // Exactly 10 digits
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;  // Valid email format

        // Validate full name (only letters)
        if (!nameRegex.test(fullName)) {
            alert('Please enter a valid full name (only letters allowed).');
            return;
        }

        // Validate phone number (exactly 10 digits)
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Validate email address
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Payment method validation
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let paymentDetailsValid = false;

        if (paymentMethod === "card-payment") {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;

            // Validate credit card details (basic validation)
            const cardNumberRegex = /^\d{16}$/; // 16-digit card number
            const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
            const cvvRegex = /^\d{3}$/; // 3-digit CVV

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all credit card details.');
                return;
            }

            if (!cardNumberRegex.test(cardNumber)) {
                alert('Please enter a valid 16-digit card number.');
                return;
            }

            if (!expiryDateRegex.test(expiryDate)) {
                alert('Please enter a valid expiration date (MM/YY).');
                return;
            }

            if (!cvvRegex.test(cvv)) {
                alert('Please enter a valid 3-digit CVV.');
                return;
            }

            paymentDetailsValid = true;
        } else if (paymentMethod === "cash-on-delivery") {
            paymentDetailsValid = true; // No further details required for COD
        } else {
            alert('Please select a payment method.');
            return;
        }

        if (!paymentDetailsValid) {
            return;
        }

        // Calculate the delivery date
        const deliveryDate = calculateDeliveryDate();

        // If all fields are valid, show success message with delivery date
        alert(`Thank you for your purchase, ${fullName}!\nYour order will be delivered to ${address}.\nDelivery date: ${deliveryDate}`);

        localStorage.removeItem('cart'); // Clear the cart from localStorage after successful purchase
        window.location.href = "index.html"; // Redirect to the order page
    });
});
