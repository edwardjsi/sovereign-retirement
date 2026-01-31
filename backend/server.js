require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import our new database bridge

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 1. Basic Route (The one the frontend uses)
app.get('/', (req, res) => {
    res.send('Sovereign Retirement API is running!');
});

// 2. Database Test Route (New!)
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()'); // Ask database for current time
        res.json({ 
            status: 'success', 
            message: 'Database connection established!', 
            time: result.rows[0].now 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
