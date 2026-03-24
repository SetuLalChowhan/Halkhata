const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    orderId: { type: String, default: '' },
    currentPhase: [{ type: String, required: true }],
    profileName: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    otherMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    resourceLink: { type: String },
    projectNotes: { type: String, default: '' },
    lastUpdateNote: { type: String, default: '' },
    lastUpdateDate: { type: Date, default: Date.now },
    firstDeliveryDate: { type: Date },
    deliveryDate: { type: Date, required: true },
    assignedDate: { type: Date, default: Date.now },
    isPlanned: { type: Boolean, default: false },
    isOldProject: { type: Boolean, default: false },
    clientMood: { type: String, enum: ['Happy', 'Neutral', 'Angry'], default: 'Neutral' },
    status: { type: String, enum: ['In Progress', 'Delivered', 'Revision', 'Cancelled'], default: 'In Progress' },
    phases: [{
        name: { type: String, required: true },
        value: { type: Number, required: true, default: 0 }
    }],
    projectValue: { type: Number, required: true, default: 0 },
    valueDistribution: [{
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
        amount: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
