const Resume = require('../models/Resume');

// Submit a resume
const submitResume = async (req, res) => {
  try {
    const { name, email, skills, experience } = req.body;
    const resumeFile = req.file ? req.file.filename : null;

    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const newResume = new Resume({
      user: req.user._id,
      name,
      email,
      skills: skills.split(',').map(skill => skill.trim()),
      experience: Number(experience),
      resumeFile
    });

    await newResume.save();
res.status(201).json(newResume); // <-- return the created resume object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting resume.' });
  }
};

// Get resumes of logged-in user
/*const getResumes = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching resumes.' });
  }
};*/

const getResumes = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const userId = req.user._id;

    // Only get resumes submitted by this user
    const resumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(resumes); // Return full resume objects
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching resumes' });
  }
};


// Delete a resume of logged-in user
const deleteResume = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted successfully', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

const updateResume = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this resume' });
    }

    if (req.body.name) resume.name = req.body.name;
    if (req.body.email) resume.email = req.body.email;
    if (req.body.skills) resume.skills = req.body.skills.split(',').map(s => s.trim());
    if (req.body.experience) resume.experience = Number(req.body.experience);
    if (req.file) resume.resumeFile = req.file.filename;

    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update resume' });
  }
};


module.exports = {
  submitResume,
  getResumes,
  deleteResume,
  updateResume
};
