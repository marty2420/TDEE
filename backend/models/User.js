  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');


  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    
  // tdee calculation results
    tdeeResults: {
      bmr: Number,
      tdee: Number,
      targetCalories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },
    input: {
      type: new mongoose.Schema({
        age: Number,
        gender: { type: String, enum: ['male', 'female'] },
        weight: Number,
        height: Number,
        activityLevel: {
          type: String,
          enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
        },
        goal: {
          type: String,
          enum: ['lose', 'maintain', 'gain']
        }
      }, { _id: false })
    },
    
  }, { 
    collection: 'users',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  });

  const User = mongoose.model('User', userSchema);
  module.exports = User;
