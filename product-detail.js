document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Create a full-page pink wrapper
  let wrapper = document.getElementById("productWrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "productWrapper";
    wrapper.style.backgroundColor = "#ffc0cb"; // pink background
    wrapper.style.minHeight = "100vh"; // full page
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "flex-start";
    wrapper.style.padding = "50px 0";
    
    // Move productArea inside wrapper
    const productArea = document.getElementById("productArea");
    if (!productArea) return alert("Product area not found!");
    productArea.parentNode.insertBefore(wrapper, productArea);
    wrapper.appendChild(productArea);
  }

  const el = document.getElementById("productArea");
  el.innerHTML = "Loading...";

  try {
    const id = new URL(location.href).searchParams.get("id");
    const p = await apiGet(`/products/${id}`);

    // 2️⃣ Set card HTML with white background
    el.innerHTML = `
      <div class="card" style="
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: center;">
        <img src="${p.image_url || ''}" alt="Product image" style="max-width:100%; border-radius:8px; margin-bottom:20px;">
        <h2 style="color:#333; margin-bottom:15px;">${p.title}</h2>
        <p style="color:#555; margin-bottom:20px;">${p.description || ''}</p>
        <div class="price" style="color:#000; font-weight:bold; font-size:18px; margin-bottom:20px;">${fmtPKR(p.price)}</div>
        <div class="row" style="display:flex; gap:10px; justify-content:center;">
          <button class="btn btn-primary" id="addBtn" style="
            padding:10px 20px;
            background-color:#ff4081;
            border:none;
            color:white;
            font-weight:bold;
            border-radius:5px;
            cursor:pointer;
            transition: background-color 0.3s;">Add to Cart</button>
          <a class="btn btn-outline" href="cart.html" style="
            padding:10px 20px;
            border:2px solid #ff4081;
            color:#ff4081;
            border-radius:5px;
            text-decoration:none;
            transition: all 0.3s;">Go to Cart</a>
        </div>
      </div>
    `;

    // 3️⃣ Button hover
    const addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("mouseenter", () => addBtn.style.backgroundColor = "#e91e63");
    addBtn.addEventListener("mouseleave", () => addBtn.style.backgroundColor = "#ff4081");

    addBtn.onclick = () => addToCart({
      id: p.id,
      title: p.title,
      price: p.price,
      image_url: p.image_url || ''
    });

  } catch (e) {
    el.innerHTML = "Product not found.";
  }
});

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const idx = cart.findIndex(x => x.id === item.id);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ ...item, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}
