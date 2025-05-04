const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  age: { type: Number, required: false },
  gender: { type: String, enum: ['male', 'female'], required: false },
  weight: { type: Number, required: false },
  height: { type: Number, required: false },
  activityLevel: { 
    type: String, 
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], 
    required: false 
  },
  goal: { 
    type: String, 
    enum: ['lose', 'maintain', 'gain'], 
    required: false 
  },
}, { 
  collection: 'users',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }  // Automatically add createdAt and updatedAt
});



// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
