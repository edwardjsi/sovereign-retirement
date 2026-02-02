const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
// Add this BEFORE your other routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.use(cors());
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

// ------------------------------------
// 🏥 HEALTH CHECK (Required for AWS ALB)
// ------------------------------------
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Your existing debugging middleware...
app.use((req, res, next) => {
    console.log(`📡 Request received: ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Add this new root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Sovereign Retirement API',
        version: '1.0.0',
        endpoints: ['/health', '/register', '/login', '/financials/:userId', '/financials/update']
    });
});


// ------------------------------------
// 📝 DEBUGGING TOOL (Log every request)
// ------------------------------------
app.use((req, res, next) => {
    console.log(`📡 Request received: ${req.method} ${req.url}`);
    next();
});

// ------------------------------------
// 👤 REGISTER ROUTE
// ------------------------------------
app.post('/register', async (req, res) => {
    try {
        console.log("📝 PROCESSING REGISTRATION:", req.body);

        const { name, email, password } = req.body;
        const age = req.body.age || 30;
        const retirement_age = req.body.retirement_age || 60;
        const monthly_expenses = req.body.monthly_expenses || 0;

        // 1. Check User Existence
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            console.log("❌ Error: User already exists");
            return res.status(401).json({ error: "User already exists!" }); // JSON Error
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert User
        console.log("...Inserting User into Database...");
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, bcryptPassword]
        );
        const newUserId = newUser.rows[0].id;
        console.log(`✅ User Created. ID: ${newUserId}`);

        // 4. Insert Financials
        console.log("...Inserting Financial Data...");
        await pool.query(
            "INSERT INTO financials (user_id, current_age, retirement_age, monthly_expenses, current_savings, monthly_contribution) VALUES ($1, $2, $3, $4, 0, 0)",
            [newUserId, parseInt(age), parseInt(retirement_age), parseInt(monthly_expenses)]
        );
        console.log("✅ Financials Created.");

        // 5. Success Response
        res.json({ message: "Success", user: newUser.rows[0] });

    } catch (err) {
        console.error("🔥 SERVER CRASH:", err.message);
        // 👇 THIS IS THE FIX: Send JSON error so frontend doesn't hang
        res.status(500).json({ error: err.message }); 
    }
});

// ------------------------------------
// 💰 FINANCIAL ROUTES
// ------------------------------------
app.get('/financials/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM financials WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) return res.json({}); 
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/financials/update', async (req, res) => {
    try {
        const { user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses } = req.body;
        
        // Upsert Logic
        const check = await pool.query('SELECT * FROM financials WHERE user_id = $1', [user_id]);
        if (check.rows.length === 0) {
            await pool.query(
                'INSERT INTO financials (user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses) VALUES ($1, $2, $3, $4, $5, $6)',
                [user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses]
            );
        } else {
            await pool.query(
                'UPDATE financials SET current_savings = $2, monthly_contribution = $3, current_age = $4, retirement_age = $5, monthly_expenses = $6 WHERE user_id = $1',
                [user_id, current_savings, monthly_contribution, current_age, retirement_age, monthly_expenses]
            );
        }
        res.json({ message: "Updated Successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Incorrect details" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Incorrect details" });

        res.json({ message: "Login Successful!", user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
