// products.js
document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("products");

  async function loadProducts() {
    try {
      const response = await fetch("/products"); // ✅ same origin call
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const products = await response.json();

      productContainer.innerHTML = products.map(p => `
        <div class="product-card">
          <img src="${p.image_url}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <p>Price: Rs.${p.price}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      `).join("");
    } catch (err) {
      console.error("❌ Failed to load products:", err);
      productContainer.innerHTML = `<p style="color:red;">Failed to load products.</p>`;
    }
  }

  loadProducts();
});

// Simple cart example
function addToCart(id) {
  alert("Added product ID: " + id);
}
