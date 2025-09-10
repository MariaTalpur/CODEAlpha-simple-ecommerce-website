import express from "express";
import path from "path";
import cors from "cors";
const cors = require("cors");
app.use(cors());
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Frontend routes fallback
const pages = ["index.html", "login.html", "register.html", "cart.html", "orders.html", "product.html"];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "../public", page));
  });
});

// Products (dummy)
const products = [
  { id: 1, title: "Laptop", price: 120000, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLxfuAFX0nY82Jv5B61R0XEDe3C6ANGHjhEQ&s" },
  { id: 2, title: "Smartphone", price: 80000, image_url: "https://m.media-amazon.com/images/I/61nqgl4atFL._AC_SL1500_.jpg" },
  { id: 3, title: "Headphones", price: 5000, image_url: "https://m.media-amazon.com/images/G/01/us-manual-merchandising/D285452997_mob_beats_750x447_en.png" },
  { id: 5, title: "Camera", price: 95000, image_url: "https://cdn.mos.cms.futurecdn.net/GXHa4PWwDPx7tGQG9MDQvK-1200-80.jpg" }, { id: 6, title: "Tablet", price: 60000, image_url: "https://tv-it.com/storage/screenshot-2022-04-25-at-14-18-31-tab-p12-pro-premium-tablet-with-12-6-2k-amoled-display-lenovo-us.webp" }, { id: 7, title: "Gaming Console", price: 70000, image_url: "https://cdn.thewirecutter.com/wp-content/media/2023/05/gamingconsoles-2048px-00702.jpg?auto=webp&quality=75&width=1024" }, { id: 8, title: "Bluetooth Speaker", price: 8000, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZPzIk1vAHmKEZT0J3b6lfG0CNEvk1rEMxDR101S6ekRgAkQ20ZajF7ybaBME8vEE0zZg&usqp=CAU" }, { id: 9, title: "Keyboard", price: 2500, image_url: "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:250,cw:1500,ch:1125,q:80,w:1500/4ohzXW2UdqpXoiTduBM7Dc.jpg" }, { id: 10, title: "Mouse", price: 1500, image_url: "https://upload.wikimedia.org/wikipedia/commons/2/22/3-Tasten-Maus_Microsoft.jpg" }, { id: 11, title: "Monitor", price: 22000, image_url: "https://cdn.thewirecutter.com/wp-content/media/2024/07/27-inch-monitor-2048px-233796-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp" }, { id: 12, title: "Printer", price: 30000, image_url: "https://www.digitaltrends.com/wp-content/uploads/2024/01/HP-includes-full-ink-bottles-with-the-Smart-Tank-7602.jpg?p=1" }, { id: 13, title: "Power Bank", price: 5000, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-6CSV1vhKdh0nUBzRGxrRPHLpwR99rbol9g&s" }, { id: 14, title: "External Hard Drive", price: 10000, image_url: "https://cdn.thewirecutter.com/wp-content/media/2023/05/externalhardrives-2048px-09422.jpg?auto=webp&quality=75&crop=1.91:1&width=1200" }, { id: 15, title: "Webcam", price: 7000, image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Logicool_StreamCam_%28cropped%29.jpg/1200px-Logicool_StreamCam_%28cropped%29.jpg" }, { id: 16, title: "VR Headset", price: 85000, image_url: "https://sm.pcmag.com/pcmag_me/review/m/meta-quest/meta-quest-3s_m9zt.jpg" }, { id: 17, title: "Microwave Oven", price: 40000, image_url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/5a565b42-f978-470f-b30e-c162f04e40e5.__CR0,0,600,450_PT0_SX600_V1___.png" },
];

app.get("/products", (req, res) => res.json(products));

// ------------------ Auth Routes (demo mode) ------------------

// Login: Accept any email/password
app.post("/api/auth/login", async (req, res) => {
  const { email } = req.body;

  const user = { id: Date.now(), name: "Demo User", email };
  res.json({ token: "fake-jwt-token", user });
});

// Register: Accept any name/email/password
app.post("/api/auth/register", async (req, res) => {
  const { name, email } = req.body;

  const user = { id: Date.now(), name: name || "Demo User", email };
  res.json({ token: "fake-jwt-token", user });
});

// ------------------ Orders (in-memory) ------------------
const ordersDB = [];

app.post("/api/orders", (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order" });
  }

  const newOrder = {
    id: ordersDB.length + 1,
    userId,
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    created_at: new Date(),
  };

  ordersDB.push(newOrder);
  res.json({ success: true, order: newOrder });
});

app.get("/api/orders/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Invalid user ID" });

  const userOrders = ordersDB.filter(o => o.userId === userId);
  res.json(userOrders);
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

