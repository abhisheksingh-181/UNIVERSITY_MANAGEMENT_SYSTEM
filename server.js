require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILES (frontend) =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// ===== CATCH-ALL — serve index.html =====
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🎓  UniFlow Management System          ║
  ║                                          ║
  ║   Server  → http://localhost:${PORT}        ║
  ║   Status  → Running ✅                   ║
  ║   Mode    → ${process.env.NODE_ENV || 'development'}                   ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
    `);
});
