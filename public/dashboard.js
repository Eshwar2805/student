// public/dashboard.js
const dashboardContainer = document.getElementById('dashboard-container');

// ⚠️ STEP 1: Replace the placeholder below with a fresh, valid 'anon' key from your Supabase dashboard.
// The key you were using was invalid, which is the main cause of the login loop.
const SUPABASE_URL = 'https://tqazcuavwltsrfofubur.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYXpjdWF2d2x0c3Jmb2Z1YnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Njg5MzMsImV4cCI6MjA3NTM0NDkzM30.R_PMg2n3YpRrmOtCECcpHT-jBA8iXHli-AThEz9fNDU'; // <-- PASTE YOUR NEW KEY HERE

// This creates your Supabase client. The variable 'supabase' is from the library script in your HTML.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Main function to check user session and load the appropriate dashboard.
 */
async function checkSessionAndLoadDashboard() {
    // First, get the current logged-in user from Supabase Auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    // If there is no user, the session is invalid. Redirect to the login page.
    if (authError || !user) {
        window.location.href = '/login.html';
        return;
    }

    // ⚠️ STEP 2: Make sure your table in Supabase is named 'Users' with a capital 'U'.
    // If it's named 'users' (lowercase), you must change '.from("Users")' to '.from("users")' below.
    const { data: userProfile, error: profileError } = await supabaseClient
        .from('Users') // <-- THIS NAME MUST EXACTLY MATCH YOUR DATABASE TABLE
        .select('full_name, role')
        .eq('id', user.id)
        .single();

    // If the user's profile can't be found in the 'Users' table, show an error.
    if (profileError || !userProfile) {
        dashboardContainer.innerHTML = `<p class="error">Could not load user profile. Please try logging in again.</p>`;
        console.error('Error fetching profile:', profileError);
        return;
    }

    // If everything is successful, render the dashboard for the user's role.
    renderDashboardUI(userProfile);
}

/**
 * Renders the HTML for the dashboard based on the user's role.
 */
function renderDashboardUI(profile) {
    let dashboardHTML = `<h2>Welcome, ${profile.full_name}</h2>`;

    switch (profile.role) {
        case 'institution':
            dashboardHTML += `
                <div class="dashboard-section">
                    <h3>Issue a New Certificate</h3>
                    <form id="issue-cert-form">
                        <input type="email" id="student-email" placeholder="Student's Email Address" required>
                        <input type="text" id="cert-title" placeholder="Certificate Title (e.g., B.Sc. in Physics)" required>
                        <button type="submit">Issue Certificate</button>
                    </form>
                </div>`;
            break;
        case 'student':
            dashboardHTML += `
                <div class="dashboard-section">
                    <h3>Your Certificates</h3>
                    <p><i>You have no certificates yet.</i></p>
                </div>`;
            break;
        case 'recruiter':
            dashboardHTML += `
                <div class="dashboard-section">
                    <h3>Verify a Certificate</h3>
                    <form id="verify-cert-form">
                        <input type="text" id="cert-code" placeholder="Enter Certificate Verification Code" required>
                        <button type="submit">Verify</button>
                    </form>
                </div>`;
            break;
        default:
            dashboardHTML += `<p class="error">Your user role is undefined. Please contact support.</p>`;
            break;
    }

    dashboardHTML += `<button id="logout-button">Logout</button>`;
    dashboardContainer.innerHTML = dashboardHTML;
}

/**
 * Handles the user logout process.
 */
async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = '/login.html';
}

// --- Event Listeners ---

// Run the session check as soon as the page loads.
document.addEventListener('DOMContentLoaded', checkSessionAndLoadDashboard);

// This handles clicks on the logout button, which is added dynamically.
dashboardContainer.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout();
    }
});