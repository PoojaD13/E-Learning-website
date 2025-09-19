

require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session =require("express-session");
const quizRoutes = require('./routes/quize');
const discussionRoutes = require('./routes/discussionRoutes');
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const {isAuthenticated,isUser,isAdmin}=require("./middleware/authMiddleware");
const userCourseRoutes = require("./routes/userCourseRoutes");



const app = express();
const PORT = process.env.PORT || 3000;

// const Student=require("./models/Student");
// const Course=require("./models/Course");

const multer = require("multer");
const fs = require("fs");


// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));


//session middleware 

app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60 } // 1 hour or your preferred time
}));

//  Middleware
app.use(express.json()); // <== Needed to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'front-end')));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/courses', quizRoutes); // Enables /quiz/:courseTitle/...
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



 //Routes

app.use("/courses", courseRoutes);
app.use("/student", studentRoutes);
app.use('/',authRoutes);
// app.use('/api', authRoutes);
app.use("/api", userCourseRoutes); // all user course API endpoints like /api/course-details/:topic
app.use('/courses', discussionRoutes);

//  Multer Setup for File Upload

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//user dashboard
app.get("/user-dashboard", isUser, (req, res) => {
    res.sendFile(path.join(__dirname, "front-end", "index.html"));
});


// admin dashboard
app.get("/admin", isAdmin,(req, res) => {
    res.sendFile(path.join(__dirname, "views", "adminpanel.html"));
});


// if anything wrong in the server side
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});



//  Start Server

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
