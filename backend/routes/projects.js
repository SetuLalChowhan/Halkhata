const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');
const sendWebhook = require('../utils/webhook');

// GET /api/projects
router.get('/', protect, async (req, res) => {
    try {
        const { member, status, sort, search, isPlanned, urgent, page = 1, limit = 20 } = req.query;
        let matchStage = {};
        let andClauses = [];

        if (search) {
            andClauses.push({
                $or: [
                    { clientName: { $regex: search, $options: 'i' } },
                    { projectName: { $regex: search, $options: 'i' } },
                    { profileName: { $regex: search, $options: 'i' } }
                ]
            });
        }

        if (member) {
            andClauses.push({
                $or: [
                    { assignedTo: member },
                    { otherMembers: member }
                ]
            });
        }

        if (status) {
            matchStage.status = status;
        }

        if (isPlanned === 'true') {
            matchStage.isPlanned = true;
        }

        if (urgent === 'true') {
            const now = new Date();
            const fourDaysLater = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
            if (matchStage.status) {
                andClauses.push({ status: matchStage.status });
                delete matchStage.status;
            }
            andClauses.push({ status: { $ne: 'Delivered' } });
            matchStage.deliveryDate = { $lte: fourDaysLater };
        }

        if (andClauses.length > 0) {
            matchStage.$and = andClauses;
        }

        let projects = await Project.find(matchStage)
            .populate('assignedTo', 'name')
            .populate('otherMembers', 'name')
            .populate('valueDistribution.member', 'name')
            .sort(sort === 'val_high' ? '-projectValue' : sort === 'val_low' ? 'projectValue' : '-createdAt');

        const totalProjects = projects.length;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedProjects = projects.slice(skip, skip + parseInt(limit));

        res.json({
            projects: paginatedProjects,
            totalPages: Math.ceil(totalProjects / parseInt(limit)),
            currentPage: parseInt(page),
            totalProjects
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/projects
router.post('/', protect, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        
        // Trigger n8n Webhook
        const fullProject = await Project.findById(project._id).populate('assignedTo', 'name');
        sendWebhook('project_created', fullProject);
        
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Trigger n8n Webhook
        const fullProject = await Project.findById(project._id).populate('assignedTo', 'name');
        sendWebhook('project_updated', fullProject);

        res.json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            sendWebhook('project_deleted', project);
            await Project.findByIdAndDelete(req.params.id);
        }
        res.json({ message: 'Project removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/projects/:id/plan
router.patch('/:id/plan', protect, admin, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, { isPlanned: req.body.isPlanned }, { new: true });
        
        // Trigger n8n Webhook
        const fullProject = await Project.findById(project._id).populate('assignedTo', 'name');
        sendWebhook('plan_updated', fullProject);

        res.json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
