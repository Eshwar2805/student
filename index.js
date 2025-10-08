// Import necessary libraries
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');

// Initialize the Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing
app.use(express.static('public')); // Serve static files from the 'public' folder

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- API ENDPOINTS ---

// 1. SIGNUP Endpoint
app.post('/signup', async (req, res) => {
    const { full_name, email, password , role } = req.body;

    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }
    if (!authData.user) {
        return res.status(500).json({ error: "Signup successful, but no user data returned." });
    }

    // Step 2: Insert the full name into the 'students' table
    const { error: insertError } = await supabase
        .from('Users')
        .insert([{ id: authData.user.id, full_name: full_name, email: email ,role: role }]);

    if (insertError) {
        // This is tricky. The user is created in Auth, but profile failed.
        // For this guide, we'll just log the error. In a real app, you'd handle this.
        console.error("Error inserting into users table:", insertError.message);
        return res.status(500).json({ error: insertError.message });
    }

    res.status(200).json({ message: 'Signup successful! Please check your email to verify.' });
});

// 2. LOGIN Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Login successful!', user: data.user });
});

// Start the server
// Redirect root URL to the signup page
app.get('/', (req, res) => {
    res.redirect('/signup.html');
});

// Start the server (this line should already be in your file)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
