// // const express = require("express");
// // const router = express.Router();
// // const Course = require("../models/Course");
// // const { isUser } = require("../middleware/authMiddleware");
// // const Student = require("../models/Student");

// // // Fetch course by topic/title for logged-in users
// // router.get("/course-details/:topic", isUser, async (req, res) => {
// //   try {
// //     const course = await Course.findOne({
// //       title: new RegExp(`^${req.params.topic}$`, "i"),
// //     }).lean(); // get plain JS object

// //     if (!course) {
// //       return res.status(404).json({ error: "Course not found" });
// //     }

// //     // Prevent caching (avoid 304 Not Modified)
// //     res.set("Cache-Control", "no-store");

// //     // Return only relevant fields expected by frontend
// //     res.json({
// //       title: course.title,
// //       description: course.description,
// //       videos: course.content || [],
// //       quizzes: course.quizzes || [],
// //       challenge: course.challenge || [],
// //     });
// //   } catch (err) {
// //     console.error("Error fetching course:", err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // // Route to mark a course as completed by the logged-in user
// // router.post('/complete-course', async (req, res) => {
// //   try {
// //     const { email, courseId } = req.body;

// //     if (!email || !courseId) {
// //       return res.status(400).json({ error: "Email and courseId are required" });
// //     }

// //     // Validate course exists (optional but recommended)
// //     const course = await Course.findById(courseId);
// //     if (!course) {
// //       return res.status(404).json({ error: "Course not found" });
// //     }

// //     const student = await Student.findOne({ email });

// //     if (!student) {
// //       return res.status(404).json({ error: "Student not found" });
// //     }

// //     // Check if course is enrolled first
// //     if (!student.enrolledCourses.includes(courseId)) {
// //       return res.status(400).json({ error: "Student is not enrolled in this course" });
// //     }

// //     // Check if already completed
// //     if (student.completedCourses.includes(courseId)) {
// //       return res.status(400).json({ error: "Course already marked as completed" });
// //     }

// //     // Mark as completed
// //     student.completedCourses.push(courseId);
// //     await student.save();

// //     return res.json({ success: true, message: "Course marked as completed!" });
// //   } catch (err) {
// //     console.error("Error marking course as completed:", err);
// //     return res.status(500).json({ error: "Server error" });
// //   }
// // });

// // const PDFDocument = require('pdfkit');

// // router.get('/certificate/:courseId/:studentId', async (req, res) => {
// //   try {
// //     const { courseId, studentId } = req.params;

// //     const student = await Student.findById(studentId);
// //     const course = await Course.findById(courseId);

// //     if (!student || !course) {
// //       return res.status(404).send("Student or Course not found");
// //     }

// //     if (!student.completedCourses.includes(courseId)) {
// //       return res.status(403).send("Course not completed yet");
// //     }

// //     const doc = new PDFDocument();

// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename=certificate_${student.name}_${course.title}.pdf`);

// //     doc.pipe(res);

// //     doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
// //     doc.moveDown();
// //     doc.fontSize(20).text(`This certifies that`, { align: 'center' });
// //     doc.moveDown();
// //     doc.fontSize(30).text(student.name, { align: 'center', underline: true });
// //     doc.moveDown();
// //     doc.fontSize(20).text(`has successfully completed the course`, { align: 'center' });
// //     doc.moveDown();
// //     doc.fontSize(25).text(course.title, { align: 'center', underline: true });
// //     doc.moveDown(2);
// //     doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

// //     doc.end();

// //   } catch (err) {
// //     console.error("Certificate generation error:", err);
// //     res.status(500).send("Server error");
// //   }
// // });



// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Course = require("../models/Course");
// const { isUser } = require("../middleware/authMiddleware");
// const Student = require("../models/Student");

// // Fetch course by topic/title for logged-in users
// router.get("/course-details/:topic", isUser, async (req, res) => {
//   try {
//     const course = await Course.findOne({
//       title: new RegExp(`^${req.params.topic}$`, "i"),
//     }).lean();

//     if (!course) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     res.set("Cache-Control", "no-store");

//     res.json({
//       title: course.title,
//       description: course.description,
//       videos: course.content || [],
//       quizzes: course.quizzes || [],
//       challenge: course.challenge || [],
//     });
//   } catch (err) {
//     console.error("Error fetching course:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Mark a course as completed by logged-in user
// router.post('/complete-course', isUser, async (req, res) => {
//   try {
//     const email = req.session.user.email; // safer than passing email in body
//     const { courseId } = req.body;

//     if (!courseId) {
//       return res.status(400).json({ error: "CourseId is required" });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ error: "Course not found" });

//     const student = await Student.findOne({ email });
//     if (!student) return res.status(404).json({ error: "Student not found" });

//     if (!student.enrolledCourses.some(cId => cId.toString() === courseId)) {
//       return res.status(400).json({ error: "Student is not enrolled in this course" });
//     }

//     const hasCompleted = student.completedCourses.some(c => c.courseId.toString() === courseId);
//     if (hasCompleted) {
//       return res.status(400).json({ error: "Course already marked as completed" });
//     }

//     student.completedCourses.push({ courseId, completedAt: new Date() });
//     await student.save();

//     return res.json({ success: true, message: "Course marked as completed!" });
//   } catch (err) {
//     console.error("Error marking course as completed:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// // Enroll logged-in student in a course
// router.post('/enroll-course', isUser, async (req, res) => {
//   try {
//     const email = req.session.user.email;
//     const { topic } = req.body;

//     if (!topic) {
//       return res.status(400).json({ error: "Course topic is required" });
//     }

//     const course = await Course.findOne({ title: new RegExp(`^${topic}$`, "i") });
//     if (!course) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     console.log("Student enrolledCourses before update:", student.enrolledCourses.map(id => id.toString()));
//     console.log("Course to enroll:", course._id.toString());

//     // Check if already enrolled (string compare)
//     if (student.enrolledCourses.some(cId => cId.toString() === course._id.toString())) {
//       console.log("Already enrolled detected");
//       return res.status(409).json({ message: "Already enrolled in this course" });
//     }

//     // Use atomic update to add course ID to enrolledCourses array if not already present
//     const updatedStudent = await Student.findByIdAndUpdate(
//       student._id,
//       { $addToSet: { enrolledCourses: course._id } },
//       { new: true }
//     );

//     console.log("Student enrolledCourses after update:", updatedStudent.enrolledCourses.map(id => id.toString()));

//     res.json({ success: true, message: `Enrolled in course: ${course.title}` });
//   } catch (err) {
//     console.error("Error enrolling course:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });



// module.exports = router;


// finaaly

const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { isUser } = require("../middleware/authMiddleware");
const Student = require("../models/Student");

// Fetch course by topic/title for logged-in users
router.get("/course-details/:topic", isUser, async (req, res) => {
  try {
    const course = await Course.findOne({
      title: new RegExp(`^${req.params.topic}$`, "i"),
    }).lean();

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.set("Cache-Control", "no-store");

    res.json({
      title: course.title,
      description: course.description,
      videos: course.content || [],
      quizzes: course.quizzes || [],
      challenge: course.challenge || [],
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark a course as completed by logged-in user
router.post('/complete-course', isUser, async (req, res) => {
  try {
    const email = req.session.user.email; // safer than passing email in body
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "CourseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (!student.enrolledCourses.some(cId => cId.toString() === courseId)) {
      return res.status(400).json({ error: "Student is not enrolled in this course" });
    }

    const hasCompleted = student.completedCourses.some(c => c.courseId.toString() === courseId);
    if (hasCompleted) {
      return res.status(400).json({ error: "Course already marked as completed" });
    }

    student.completedCourses.push({ courseId, completedAt: new Date() });
    await student.save();

    return res.json({ success: true, message: "Course marked as completed!" });
  } catch (err) {
    console.error("Error marking course as completed:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Enroll logged-in student in a course
router.post('/enroll-course', isUser, async (req, res) => {
  try {
    const email = req.session.user.email;
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Course topic is required" });
    }

    const course = await Course.findOne({ title: new RegExp(`^${topic}$`, "i") });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    console.log("Student enrolledCourses before update:", student.enrolledCourses.map(id => id.toString()));
    console.log("Course to enroll:", course._id.toString());

    if (student.enrolledCourses.some(cId => cId.toString() === course._id.toString())) {
      console.log("Already enrolled detected");
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      { $addToSet: { enrolledCourses: course._id } },
      { new: true }
    );

    console.log("Student enrolledCourses after update:", updatedStudent.enrolledCourses.map(id => id.toString()));

    res.json({ success: true, message: `Enrolled in course: ${course.title}` });
  } catch (err) {
    console.error("Error enrolling course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
