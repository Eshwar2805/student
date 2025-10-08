// public/dashboard.js

const dashboardContainer = document.getElementById('dashboard-container');

// ⚠️ IMPORTANT: Replace these with your actual Supabase project URL and anon key
// You can get these from your Supabase project's API settings.
const SUPABASE_URL = 'https://tqazcuavwltsrfofubur.supabase.co'; // e.g., 'https://xyz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYXpjdWF2d2x0c3Jmb2Z1YnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Njg5MzMsImV4cCI6MjA3NTM0NDkzM30.R_PMg2n3YpRrmOtCECcpHT-jBA8iXHli-AThEz9fNDU'; // The long string starting with 'eyJ...'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Main function to check user session and load the appropriate dashboard.
 */
async function checkSessionAndLoadDashboard() {
    // 1. Get the current user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        // If there's an error or no user, they are not logged in.
        // Redirect them to the login page.
        window.location.href = '/login.html';
        return;
    }

    // 2. Fetch the user's profile from your 'users' table to get their role
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single(); // Use .single() as we expect only one user profile

    if (profileError || !userProfile) {
        dashboardContainer.innerHTML = `<p class="error">Could not load user profile. Please try again.</p>`;
        console.error('Error fetching profile:', profileError);
        return;
    }

    // 3. Render the dashboard UI based on the user's role
    renderDashboardUI(userProfile);
}

/**
 * Renders the HTML for the dashboard based on the user's role.
 * @param {object} profile - The user's profile data (e.g., { full_name: 'Jane Doe', role: 'student' })
 */
function renderDashboardUI(profile) {
    let dashboardHTML = `<h2>Welcome, ${profile.full_name}</h2>`;

    // Use a switch statement to build the UI for each role
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
                </div>
                <div class="dashboard-section">
                    <h3>Previously Issued Certificates</h3>
                    <p><i>Feature coming soon...</i></p>
                </div>
            `;
            break;

        case 'student':
            dashboardHTML += `
                <div class="dashboard-section">
                    <h3>Your Certificates</h3>
                    <p><i>You have no certificates yet.</i></p>
                </div>
            `;
            break;

        case 'recruiter':
            dashboardHTML += `
                <div class="dashboard-section">
                    <h3>Verify a Certificate</h3>
                    <form id="verify-cert-form">
                        <input type="text" id="cert-code" placeholder="Enter Certificate Verification Code" required>
                        <button type="submit">Verify</button>
                    </form>
                </div>
            `;
            break;

        default:
            dashboardHTML += `<p class="error">Your user role is undefined. Please contact support.</p>`;
            break;
    }

    // Add the logout button, which is common to all roles
    dashboardHTML += `<button id="logout-button">Logout</button>`;

    // Set the container's final HTML
    dashboardContainer.innerHTML = dashboardHTML;
}

/**
 * Handles the user logout process.
 */
async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        // On successful logout, redirect to the login page
        window.location.href = '/login.html';
    }
}

// --- Event Listeners ---

// Run the session check as soon as the page loads
document.addEventListener('DOMContentLoaded', checkSessionAndLoadDashboard);

// Use event delegation to handle clicks on the dynamically added logout button
dashboardContainer.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logout-button') {
        handleLogout();
    }
});

// You can add event listeners for the new forms here as you build the features
// For example:
// dashboardContainer.addEventListener('submit', (e) => {
//     if (e.target && e.target.id === 'issue-cert-form') {
//         e.preventDefault();
//         // Logic to issue a certificate goes here
//         console.log('Issuing certificate...');
//     }
// });