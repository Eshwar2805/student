// public/script.js
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const messageEl = document.getElementById('message');

// Use a placeholder for the backend URL. We will change this when we deploy.
const BACKEND_URL = 'https://mytrail-bz08.onrender.com';

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const response = await fetch(`${BACKEND_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email, password,role }),
        });

        const data = await response.json();
        messageEl.textContent = data.message || data.error;
        messageEl.className = response.ok ? 'success' : 'error';
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

       if (response.ok) {
    // On successful login, redirect the user to the dashboard page.
    // The Supabase client library has already stored the session token.
    window.location.href = '/dashboard.html';
} else {
    messageEl.textContent = data.error;
    messageEl.className = 'error';
}
    });
}