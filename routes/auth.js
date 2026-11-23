const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();

// ===== SIGNUP =====
router.post('/signup', (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        // Check if email exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Hash password & create user
        const hash = bcrypt.hashSync(password, 10);
        const initials = name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const validRole = ['student', 'faculty', 'admin'].includes(role) ? role : 'student';

        const result = db.prepare(
            'INSERT INTO users (name, email, password, role, initials) VALUES (?, ?, ?, ?, ?)'
        ).run(name.trim(), email.toLowerCase(), hash, validRole, initials);

        // Generate token
        const token = jwt.sign(
            { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase(), role: validRole, initials },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase(), role: validRole, initials }
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ===== LOGIN =====
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role, initials: user.initials },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, initials: user.initials }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ===== GET CURRENT USER =====
const { authMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, (req, res) => {
    const user = db.prepare('SELECT id, name, email, role, initials, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
});

module.exports = router;
