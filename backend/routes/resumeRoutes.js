const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitResume, getResumes, deleteResume, updateResume } = require('../controllers/ResumeController');
const { protect } = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes with authentication
router.post('/submit', protect, upload.single('resumeFile'), submitResume);
router.get('/', protect, getResumes);
router.delete('/:id', protect, deleteResume);
router.put('/:id', protect, upload.single('resumeFile'), updateResume);


module.exports = router;
