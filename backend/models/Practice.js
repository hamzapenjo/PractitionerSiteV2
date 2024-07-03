const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;
