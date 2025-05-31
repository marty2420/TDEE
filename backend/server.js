const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'https://tdeecalc-r02u.onrender.com',  // Allow the React app to make requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true,
}));
app.use(express.json());


// Import Routes
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/users', userRoutes);  

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Define the server port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
