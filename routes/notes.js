const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected by authMiddleware
router.use(authMiddleware);

// @route   GET /api/notes
// @desc    Get all notes belonging to the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

// @route   POST /api/notes
// @desc    Create a new note linked to the logged-in user
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title: title || 'Untitled',
      content: content || '',
      user: req.user.userId
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ message: 'Server error while saving note' });
  }
});

module.exports = router;
