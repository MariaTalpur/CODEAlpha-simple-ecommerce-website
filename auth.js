(function () {
  const API_BASE = "http://localhost:3000/api/auth";

  async function apiPost(url, body) {
    const res = await fetch(API_BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Network error");
    }
    return res.json();
  }

  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = { email: fd.get("email"), password: fd.get("password") };

    try {
      const res = await apiPost("/login", body);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      alert("✅ Login successful!");
      window.location.href = "index.html"; // redirect to home
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = { name: fd.get("name"), email: fd.get("email"), password: fd.get("password") };

    try {
      const res = await apiPost("/register", body);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      alert("✅ Registration successful!");
      window.location.href = "login.html"; // ✅ register ke baad login page
    } catch (err) {
      alert("❌ Registration failed: " + err.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const regForm = document.getElementById("regForm");
    if (regForm) regForm.addEventListener("submit", handleRegister);
  });
})();
