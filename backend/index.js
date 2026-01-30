const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow us to parse JSON bodies

// A simple "Health Check" route
app.get('/', (req, res) => {
  res.send('Sovereign Retirement API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});