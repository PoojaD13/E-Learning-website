// routes/courseRoutes.js

const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Admin middleware
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.status(403).send(`<script>alert('Access denied. Admins only.'); window.location.href='/login';</script>`);
}

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Course routes
router.get("/course-manager", isAdmin, async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("admin", { courses });
  } catch (err) {
    res.send("Error loading course manager.");
  }
});

router.post("/create-course", isAdmin, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newCourse = new Course({ title, description });
    await newCourse.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error creating course.");
  }
});

router.post("/add-content", isAdmin, upload.single("content"), async (req, res) => {
  const { courseId, title } = req.body;
  const contentPath = req.file ? req.file.path : null;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    course.content.push({ title, contentPath });
    await course.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error adding content.");
  }
});

router.post("/delete-content", isAdmin, async (req, res) => {
  const { courseId, contentId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    const content = course.content.id(contentId);
    if (!content) return res.send("Content not found.");

    const filePath = path.join(__dirname, "..", content.contentPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    course.content.pull(contentId);
    course.markModified("content");
    await course.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error deleting content.");
  }
});

router.post("/add-quiz", isAdmin, async (req, res) => {
  const { courseId, question, options, correctAnswer } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    course.quizzes.push({
      question,
      options: options.split(",").map(o => o.trim()),
      correctAnswer
    });
    await course.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error adding quiz.");
  }
});

// router.post("/delete-quiz", isAdmin, async (req, res) => {
//   const { courseId, quizId } = req.body;
//   try {
//     const course = await Course.findById(courseId);
//     if (!course) return res.send("Course not found.");

//     course.quizzes.id(quizId).remove();
//     await course.save();
//     res.redirect("/courses/course-manager");
//   } catch {
//     res.send("Error deleting quiz.");
//   }
// });

router.post("/delete-quiz", isAdmin, async (req, res) => {
  const { courseId, quizId } = req.body;
  console.log("🔍 Attempting to delete quiz");
  console.log("Course ID:", courseId);
  console.log("Quiz ID:", quizId);

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    const index = course.quizzes.findIndex(q => q._id.toString() === quizId);
    if (index === -1) return res.send("Quiz not found.");

    course.quizzes.splice(index, 1); // ✅ this line deletes the quiz
    await course.save();

    console.log("✅ Quiz removed and course saved");
    return res.redirect("/courses/course-manager");
  } catch (err) {
    console.error("❌ Error deleting quiz:", err);
    return res.send("Error deleting quiz.");
  }
});


router.post("/add-challenge", isAdmin, async (req, res) => {
  const { courseId, question } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    course.challenge.push({ question });
    await course.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error adding challenge.");
  }
});

router.post("/delete-challenge", isAdmin, async (req, res) => {
  const { courseId, challengeId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.send("Course not found.");

    course.challenge.id(challengeId).remove();
    await course.save();
    res.redirect("/courses/course-manager");
  } catch {
    res.send("Error deleting challenge.");
  }
});


module.exports = router;
