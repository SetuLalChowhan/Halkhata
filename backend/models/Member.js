const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    totalEarnings: { type: Number, default: 0 },
    projectsContributed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
