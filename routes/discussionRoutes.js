const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');

// Get all discussions for a course
router.get('/:courseTitle/discussions', async (req, res) => {
  try {
    const discussions = await Discussion.find({ 
      courseTitle: new RegExp(`^${req.params.courseTitle}$`, 'i') 
    }).sort({ createdAt: 1 });
    res.json(discussions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Post a new discussion message
router.post('/:courseTitle/discussions', async (req, res) => {
  const { user, message } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    const newDiscussion = new Discussion({
      courseTitle: req.params.courseTitle,
      user: user || 'Anonymous',
      message: message.trim(),
    });
    await newDiscussion.save();
    res.json({ message: 'Discussion posted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
