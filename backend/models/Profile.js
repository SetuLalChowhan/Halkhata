const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
