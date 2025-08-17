const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: [String],
    experience: Number,
    resumeFile: String
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
