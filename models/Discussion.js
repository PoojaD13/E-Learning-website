// models/Discussion.js
const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },  // or courseId if you prefer
  user: { type: String, default: 'Anonymous' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;
