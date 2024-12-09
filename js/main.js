let cart = [];

window.addEventListener('load', loadCartFromLocalStorage);

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.product');
        const name = product.querySelector('.product-name').innerText;
        const price = parseFloat(product.querySelector('.product-price').innerText.replace('$', ''));
        addItemToCart(name, price);
    });
});

function addItemToCart(name, price) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    saveCartToLocalStorage();
}

function updateCart() {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemSubtotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
                <input type="number" class="quantity-input" min="1" value="${item.quantity}" data-name="${item.name}">
                <span>$${itemSubtotal.toFixed(2)}</span>
                <button class="remove-from-cart" data-name="${item.name}">Remove</button>
            </div>`;
    });

    document.querySelector('.summary').innerText = `${totalItems} items in your cart`;
    document.querySelector('.total').innerText = `Total: $${totalPrice.toFixed(2)}`;

    // Add event listeners for Remove buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', () => {
            removeItemFromCart(button.getAttribute('data-name'));
        });
    });

    // Add event listeners for quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value);
            const name = event.target.getAttribute('data-name');
            updateItemQuantity(name, newQuantity);
        });
    });
}

function updateItemQuantity(name, quantity) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct && quantity > 0) {
        existingProduct.quantity = quantity;
        updateCart();
        saveCartToLocalStorage();
    }
}

function removeItemFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        saveCartToLocalStorage();
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}