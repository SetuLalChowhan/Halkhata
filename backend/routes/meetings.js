const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { protect } = require('../middleware/authMiddleware');

// GET /api/meetings
router.get('/', protect, async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate('members', 'name')
            .populate('createdBy', 'name')
            .sort('-createdAt');
        res.json(meetings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/meetings
router.post('/', protect, async (req, res) => {
    try {
        const meeting = new Meeting({
            ...req.body,
            createdBy: req.user._id
        });
        await meeting.save();
        res.status(201).json(meeting);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /api/meetings/:roomName
router.get('/:roomName', protect, async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ roomName: req.params.roomName })
            .populate('members', 'name')
            .populate('createdBy', 'name');
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
        res.json(meeting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/meetings/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(meeting);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/meetings/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        await Meeting.findByIdAndDelete(req.params.id);
        res.json({ message: 'Meeting removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
