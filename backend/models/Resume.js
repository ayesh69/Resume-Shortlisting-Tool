const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to user

  name: String,
  email: String,
  skills: [String],
  experience: Number,
  resumeFile: String,
});

module.exports = mongoose.model('Resume', ResumeSchema);
