const express = require('express');
const router = express.Router();
const db = require('./db');
// Get all orders for a user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT o.id AS order_id, o.total, o.created_at,
           p.title, oi.qty, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Group items by order_id
    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = { id: row.order_id, total: row.total, created_at: row.created_at, items: [] };
      }
      orders[row.order_id].items.push({ title: row.title, qty: row.qty, price: row.price });
    });

    res.json(Object.values(orders));
  });
});


router.post('/', (req, res) => {
  const { userId, items } = req.body;
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  db.query("INSERT INTO orders (user_id, total) VALUES (?, ?)", [userId, total], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const orderId = result.insertId;

    const orderItems = items.map(i => [orderId, i.id, i.qty, i.price]);
    db.query("INSERT INTO order_items (order_id, product_id, qty, price) VALUES ?", [orderItems], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, orderId });
    });
  });
});

module.exports = router;
