const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Member = require('../models/Member');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
    try {
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        const projects = await Project.find();
        
        let totalProjects = projects.length;
        let totalDelivered = 0;
        let totalInProgress = 0;
        let totalValue = 0;
        let currentMonthValue = 0;

        projects.forEach(p => {
            totalValue += p.projectValue;
            
            if (p.status === 'Delivered') {
                totalDelivered++;
            }
            if (p.status === 'In Progress') {
                totalInProgress++;
            }

            if (new Date(p.assignedDate) >= currentMonthStart) {
                currentMonthValue += p.projectValue;
            }
        });
        
        res.json({
            totalProjects,
            totalDelivered,
            totalInProgress,
            totalValue,
            currentMonthValue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/members', protect, async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/members', protect, async (req, res) => {
    try {
        const m = await Member.create(req.body);
        res.json(m);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/members/:id', protect, async (req, res) => {
    try {
        const m = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(m);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/members/:id', protect, async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/profiles', protect, async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/profiles', protect, async (req, res) => {
    try {
        const p = await Profile.create(req.body);
        res.json(p);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/profiles/:id', protect, async (req, res) => {
    try {
        const p = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(p);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/profiles/:id', protect, async (req, res) => {
    try {
        await Profile.findByIdAndDelete(req.params.id);
        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
