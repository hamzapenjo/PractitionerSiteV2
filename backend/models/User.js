const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: Number, required: true },
  practice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Practice' },
  practitioner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
