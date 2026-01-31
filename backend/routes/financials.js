const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. GET User's Financial Data
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM financials WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.json({}); // Return empty if no data yet
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. UPDATE or INSERT User's Financial Data
router.post('/update', async (req, res) => {
    try {
        const { user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses } = req.body;

        // Check if data exists for this user
        const check = await pool.query('SELECT * FROM financials WHERE user_id = $1', [user_id]);

        if (check.rows.length === 0) {
            // INSERT (First time)
            await pool.query(
                'INSERT INTO financials (user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses) VALUES ($1, $2, $3, $4, $5, $6)',
                [user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses]
            );
        } else {
            // UPDATE (Subsequent times)
            await pool.query(
                'UPDATE financials SET current_savings = $2, monthly_contribution = $3, current_age = $4, retirement_age = $5, monthly_expenses = $6 WHERE user_id = $1',
                [user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses]
            );
        }

        res.json({ message: "Financials Updated Successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;