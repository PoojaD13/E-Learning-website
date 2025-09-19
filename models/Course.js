
const mongoose=require("mongoose");

const contentSchema = new mongoose.Schema({
    title: String,
    contentPath: String,
});

// const quizSchema = new mongoose.Schema({
//     question: String,
//     options: [String],
//     correctAnswer: String,
// });
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
}, { _id: true }); // 👈 this ensures each quiz gets its own ObjectId


const challengeSchema = new mongoose.Schema({
    question: String,
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: [contentSchema],
    quizzes: [quizSchema],
    challenge: [challengeSchema],
});

const Course =mongoose.model("Course",courseSchema);
module.exports=Course;
