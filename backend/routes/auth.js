const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'User already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ username, password: hashedPassword, role: role || 'Manager' });
        res.status(201).json({ message: 'Registered successfully', user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
