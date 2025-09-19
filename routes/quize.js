const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get quizzes for a course without revealing correct answers
router.get('/:courseTitle/quizzes', async (req, res) => {
  try {
    const course = await Course.findOne({
      title: new RegExp(`^${req.params.courseTitle}$`, 'i')
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const safeQuizzes = course.quizzes.map((quiz, index) => ({
      id: index,
      question: quiz.question,
      options: quiz.options
    }));

    res.json(safeQuizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz answer
router.post('/:courseTitle/submit', async (req, res) => {
  const { questionIndex, selectedAnswer } = req.body;

  try {
    const course = await Course.findOne({
      title: new RegExp(`^${req.params.courseTitle}$`, 'i')
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const quiz = course.quizzes[questionIndex];
    if (!quiz) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = quiz.correctAnswer.trim().toLowerCase() === selectedAnswer.trim().toLowerCase();

    res.json({
      correct: isCorrect,
      message: isCorrect ? '✅ Correct!' : '❌ Incorrect!'
    });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
