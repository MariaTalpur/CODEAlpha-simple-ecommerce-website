// cart.js

const cartArea = document.getElementById("cartArea");
const checkoutBtn = document.getElementById("checkoutBtn");

// Load cart and display
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cartArea) return;

  if (cart.length === 0) {
    cartArea.innerHTML = "<p>Your cart is empty.</p>";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  let html = "<ul>";
  cart.forEach(item => {
    total += item.price * item.qty;
    html += `<li>${item.name} - ${item.qty} × $${item.price} = $${item.price * item.qty}</li>`;
  });
  html += `</ul><p><strong>Total: $${total}</strong></p>`;
  cartArea.innerHTML = html;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Global addToCart function
window.addToCart = function(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.title, price: product.price, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  alert(`${product.title} added to cart!`);
}

// Checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { 
      alert("Please login first!"); 
      window.location.href="login.html"; 
      return; 
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) { 
      alert("Cart is empty!"); 
      return; 
    }

    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || 1, items: cart })
      });

      if (res.ok) {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("cart"); // Clear cart
        // Redirect to orders page instead of index
        window.location.href = "orders.html";
      } else {
        const data = await res.json();
        alert("❌ Order failed: " + data.error);
      }

    } catch(err) { 
      console.error(err); 
      alert("❌ Server error while placing order."); 
    }
  });
}

document.addEventListener("DOMContentLoaded", loadCart);