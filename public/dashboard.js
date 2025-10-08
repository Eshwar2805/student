// public/dashboard.js
const dashboardContainer = document.getElementById('dashboard-container');

// ⚠️ IMPORTANT: Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://tqazcuavwltsrfofubur.supabase.co'; // e.g., 'https://xyz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYXpjdWF2d2x0c3Jmb2Z1YnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Njg5MzMsImV4cCI6MjA3NTM0NDkzM30.R_PMg2n3YpRrmOtCECcpHT-jBA8iXHli-AThEz9fNDU'; // The long string starting with 'eyJ...'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Main function to check user session and load the appropriate dashboard.
 */
async function checkSessionAndLoadDashboard() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        window.location.href = '/login.html';
        return;
    }

    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

    if (profileError || !userProfile) {
        dashboardContainer.innerHTML = `<p class="error">Could not load user profile.</p>`;
        console.error('Error fetching profile:', profileError);
        return;
    }

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
            dashboardHTML += `<p class="error">Your user role is undefined.</p>`;
            break;
    }

    dashboardHTML += `<button id="logout-button">Logout</button>`;
    dashboardContainer.innerHTML = dashboardHTML;
}

/**
 * Handles the user logout process.
 */
async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', checkSessionAndLoadDashboard);

dashboardContainer.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout();
    }
});