// public/dashboard.js

const userEmailEl = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');

// You need to replace these with your actual Supabase project URL and anon key
// It's okay to expose the anon key in client-side code.
const SUPABASE_URL = 'https://tqazcuavwltsrfofubur.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYXpjdWF2d2x0c3Jmb2Z1YnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Njg5MzMsImV4cCI6MjA3NTM0NDkzM30.R_PMg2n3YpRrmOtCECcpHT-jBA8iXHli-AThEz9fNDU';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to check the user's session
async function checkSession() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        // If there's an error or no user, they are not logged in.
        // Redirect them to the login page.
        window.location.href = '/login.html';
    } else {
        // If a user is found, they are logged in.
        // Display their email on the dashboard.
        userEmailEl.textContent = data.user.email;
    }
}

// Add an event listener for the logout button
logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        // On successful logout, redirect to the login page
        window.location.href = '/login.html';
    }
});

// Run the session check as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});