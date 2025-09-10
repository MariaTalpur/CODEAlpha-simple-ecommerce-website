 const API_BASE = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type":"application/json" }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(path, body, auth=false) {
  const headers = { "Content-Type":"application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
  const res = await fetch(`${API_BASE}${path}`, { method:"POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function fmtPKR(n) {
  return "PKR " + (n/1).toLocaleString();
}

function setAuthUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const el = document.querySelector("#authArea");
  if (!el) return;
  if (user) {
    el.innerHTML = `<span class="badge">Hi, ${user.name}</span>
    <a href="cart.html">Cart</a>
    <a href="#" id="logoutLink">Logout</a>`;
    const link = document.getElementById("logoutLink");
    link.onclick = () => { 
      localStorage.removeItem("user"); 
      localStorage.removeItem("token"); 
      location.reload(); 
    };
  } else {
    el.innerHTML = `<a href="login.html">Login</a> <a href="register.html">Register</a>`;
  }
}

document.addEventListener("DOMContentLoaded", setAuthUI);


