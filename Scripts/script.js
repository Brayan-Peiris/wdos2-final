// Fetch the medicines data from the JSON file
fetch('medicines.json')
  .then(response => response.json())
  .then(data => {
    const medicines = data;

    // Function to create medicine selection form dynamically
    function createMedicineCategory(category, container) {
      medicines[category].forEach(medicine => {
        const div = document.createElement('div');
        div.classList.add('medicine-item');
        div.innerHTML = `
          <img src="${medicine.image}" alt="${medicine.name}" class="medicine-img" />
          <div class="medicine-info">
            <label>${medicine.name} - $${medicine.price}</label>
            <p>${medicine.description}</p>
            <p><strong>Weight:</strong> ${medicine.weight}</p>
            <p><strong>How to Use:</strong> ${medicine.howToUse}</p>
            <input type="number" min="0" data-name="${medicine.name}" data-price="${medicine.price}" placeholder="Quantity" id="quantity-${medicine.name}" />
            <button class="add-to-cart-btn" data-name="${medicine.name}" data-price="${medicine.price}">Add to Cart</button>
          </div>
        `;
        container.appendChild(div);
      });
    }

    // Add all categories to the page
    const categories = ['analgesics', 'antibiotics', 'antidepressants', 'antihistamines', 'antihypertensives'];
    categories.forEach(category => {
      createMedicineCategory(category, document.getElementById(category));
    });

    // Variables for cart and favourites
    let cart = [];
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    // Update the cart and display it in the table
    function updateCart() {
      const orderTable = document.querySelector('#order-table tbody');
      const totalPriceElem = document.getElementById('total-price');
      orderTable.innerHTML = ''; // Clear the table

      let total = 0;
      cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitPrice.toFixed(2)}</td>
          <td>$${item.total.toFixed(2)}</td>
          <td><button class="remove-btn" data-index="${index}">Remove</button></td>
        `;
        orderTable.appendChild(row);
        total += item.total;
      });

      totalPriceElem.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    // Add medicine to the cart when "Add to Cart" button is clicked
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        const quantityInput = document.getElementById(`quantity-${name}`);
        let quantity = parseFloat(quantityInput.value) || 0;

        // Round quantity to the nearest whole number
        quantity = Math.round(quantity);

        if (quantity > 0) {
          const existingItem = cart.find(item => item.name === name);

          if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * existingItem.unitPrice;
          } else {
            cart.push({
              name,
              quantity,
              unitPrice: price,
              total: price * quantity
            });
          }

          updateCart();
          quantityInput.value = '';  // Reset quantity input after adding to cart
        } else {
          alert('Please enter a valid quantity.');
        }
      });
    });

    // Handle removal of items from the cart
    document.querySelector('#order-table').addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) {
        const index = e.target.dataset.index; // Get the index of the item to be removed
        cart.splice(index, 1);  // Remove the item from the cart array
        updateCart();  // Update the cart display after removal
      }
    });

    // Save current order as favourite
    document.getElementById('add-to-favourites').addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add some items to your cart before saving it to favourites.');
      } else {
        localStorage.setItem('favourites', JSON.stringify(cart));
        alert('Your cart has been saved to favourites!');
      }
    });

    // Apply favourite order
    document.getElementById('apply-favourites').addEventListener('click', () => {
      if (favourites.length === 0) {
        alert('No favourite order found! Please save an order to favourites first.');
      } else {
        cart = [...favourites];
        updateCart();
        alert('Your favourite order has been applied!');
      }
    });

    // Handle "Buy Now" button click (checkout)
    document.getElementById('buy-now-btn').addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
      } else {
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
      window.location.href = 'checkout.html'; // Proceed to checkout if cart is not empty
      }
    });
  });

