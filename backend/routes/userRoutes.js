const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware
const jwt = require('jsonwebtoken');
const { input } = require('framer-motion/client');


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // You can adjust the expiry time as needed
  });
};


const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  console.log('login asd');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      input: user.input || {},           // nested input object
      tdeeResults: user.tdeeResults || {} // nested tdeeResults object
    };

    // Generate a JWT token after successful login
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token  // Send the token in response
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Signup route
router.post('/signup', async (req, res) => {
  console.log('asd signup');
  const { 
    name, 
    email, 
    password, 
    age, 
    gender, 
    weight, 
    height, 
    activityLevel, 
    goal }
     = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    // Save input data nested under input object
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      input: {
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal
      },
      tdeeResults: {} // initialize empty TDEE results
    });

    await newUser.save().catch(err => {
      console.error('Mongoose validation error:', err);
      return res.status(400).json({ error: 'Validation failed', details: err.message });
    });

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      input: newUser.input,
      tdeeResults: newUser.tdeeResults,
    };

    res.status(201).json({ message: 'Account created successfully', user: userResponse });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Update TDEE input + results
router.put('/tdee', authenticateToken, async (req, res) => {
  console.log('asd tdee');
  const { input, tdeeResults } = req.body;
  const userId = req.user.id;

  if (!input || !tdeeResults) {
    return res.status(400).json({ error: 'Input and TDEE results are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { input, tdeeResults },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // OPTIONAL: remove sensitive data like password
    const { password, ...safeUser } = updatedUser.toObject();

    return res.status(200).json(safeUser); // ← Return updated user directly
  } catch (err) {
    console.error('Error updating TDEE:', err);
    res.status(500).json({ error: 'Server error while saving TDEE data' });
  }
});

router.get('/tdee/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      input: user.input,  
      tdeeResults: user.tdeeResults,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;  
