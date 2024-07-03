const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Practice = require('./models/Practice');

const app = express();
const port = 3001;
const secret = 'mysecretkey';

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Registracija
app.post('/register', async (req, res) => {
  const { username, password, type, practice_id, practitioner_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, type, practice_id, practitioner_id });
  await newUser.save();
  res.json(newUser);
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ id: user._id, type: user.type }, secret, { expiresIn: '1h' });
  res.json({ token, type: user.type });
});

// Middleware za autorizaciju
const authMiddleware = (roles) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1]; // Split Bearer token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (!roles.includes(decoded.type)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// CRUD operacije za praksu
app.get('/practices', async (req, res) => {
  try {
    const practices = await Practice.find();
    res.json(practices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching practices' });
  }
});

app.post('/practices', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newPractice = new Practice({ name, email });
    await newPractice.save();
    res.status(201).json(newPractice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating practice', error });
  }
});

app.put('/practices/:id', authMiddleware([1]), async (req, res) => {
  const { name, email } = req.body;
  const updatedPractice = await Practice.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
  res.json(updatedPractice);
});

app.delete('/practices/:id', authMiddleware([1]), async (req, res) => {
  await Practice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Practice deleted' });
});

// CRUD operacije za admina
app.get('/users', authMiddleware([1]), async (req, res) => {
  try {
    const users = await User.find({ type: { $ne: 1 } })
      .populate('practice_id', 'name')
      .populate('practitioner_id', 'username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
})

app.post('/users', authMiddleware([1]), async (req, res) => {
  const { username, password, type, practice_id, practitioner_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, type, practice_id, practitioner_id });
  await newUser.save();
  res.json(newUser);
});

app.put('/users/:id', authMiddleware([1]), async (req, res) => {
  const { username, password, type, practice_id, practitioner_id } = req.body;
  let updateData = { username, type };
  
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (type === 2) {
    updateData.practice_id = practice_id;
  } else if (type === 3) {
    updateData.practitioner_id = practitioner_id;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

app.delete('/users/:id', authMiddleware([1]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Protected route
app.get('/dashboard', authMiddleware([1, 2, 3]), (req, res) => {
  res.json({ message: `Logged in as ${req.user.type === 1 ? 'Admin' : req.user.type === 2 ? 'Practitioner' : 'User'}` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
