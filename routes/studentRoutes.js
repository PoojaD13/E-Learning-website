

const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Middleware to restrict routes to admins only (optional but recommended)
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  return res.status(403).send(`<script>alert('Access denied. Admins only.'); window.location.href='/login';</script>`);
}

// Get student list (admin only)
router.get("/student-list", isAdmin, async (req, res) => {
  try {
    const students = await Student.find().populate("enrolledCourses");
    res.render("students", { students });
  } catch (err) {
    console.error("Error loading student list:", err);
    res.status(500).send("Error loading student list.");
  }
});

// Delete student (admin only)
router.post("/delete-student", isAdmin, async (req, res) => {
  try {
    const { studentId } = req.body;
    const result = await Student.findByIdAndDelete(studentId);
    if (!result) return res.status(404).send("Student not found");
    res.redirect("/student-list");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Error deleting student");
  }
});

// GET /student/completed-courses
const Course = require('../models/Course');
const { isUser } = require('../middleware/authMiddleware');

router.get('/completed-courses', isUser, async (req, res) => {
  try {
    const email = req.session.user.email;
    const student = await Student.findOne({ email });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const completed = await Promise.all(
      student.completedCourses.map(async (entry) => {
        const course = await Course.findById(entry.courseId);
        if (!course) return null;

        return {
          _id: course._id,
          title: course.title,
          completedAt: entry.completedAt,
        };
      })
    );

    res.json(completed.filter(c => c !== null));
  } catch (err) {
    console.error("Failed to fetch completed courses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
