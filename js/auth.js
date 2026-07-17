// Replace these with your actual Supabase Project details

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility: Check if user is logged in
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Redirect if user is not authenticated (for protected pages)
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// Redirect if already authenticated (for login/signup pages)
async function redirectIfAuthenticated() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = "dashboard.html";
  }
}

// Register User
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  if (error) throw error;
  return data;
}

// Log In User
async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// Log Out User
async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
  window.location.href = "login.html";
}

// Request Password Reset Link
async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`
  });
  if (error) throw error;
}

// Update Password
async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

// Dynamically handle header link configurations without modifying your static HTML layouts
async function updateDynamicNavbar() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Clear any existing dynamic links to prevent duplicate rendering
  document.querySelectorAll(".dynamic-nav-item").forEach(item => item.remove());

  if (user) {
    // Add Dashboard option
    const dashboardLi = document.createElement("li");
    dashboardLi.className = "dynamic-nav-item";
    dashboardLi.innerHTML = `<a href="dashboard.html">Dashboard</a>`;
    navLinks.appendChild(dashboardLi);

    // Add Sign Out option
    const logoutLi = document.createElement("li");
    logoutLi.className = "dynamic-nav-item";
    logoutLi.innerHTML = `<a href="#" id="dynamic-logout-action">Sign Out</a>`;
    navLinks.appendChild(logoutLi);

    document.getElementById("dynamic-logout-action")?.addEventListener("click", (e) => {
      e.preventDefault();
      logOut();
    });
  } else {
    // Add Log In option
    const loginLi = document.createElement("li");
    loginLi.className = "dynamic-nav-item";
    loginLi.innerHTML = `<a href="login.html">Log In</a>`;
    navLinks.appendChild(loginLi);
  }
}

// Initialize navbar state
document.addEventListener("DOMContentLoaded", () => {
  updateDynamicNavbar();
});
// js/auth.js

// Set your Supabase credentials here to go live.
// If left as default, the app automatically runs in Mock Mode.
const SUPABASE_URL = "YOUR_SUPABASE_URL"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabaseClient = null;
let useMockBackend = true;

// Initialize Supabase only if valid keys are provided
if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY" && typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        useMockBackend = false;
        console.log("Database Status: Connected to live Supabase cloud.");
    } catch (e) {
        console.warn("Failed to initialize Supabase client. Falling back to Mock Storage.");
    }
} else {
    console.log("Database Status: Running in Local Mock Mode (Supabase not configured).");
}

// Authentication check on page load
document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.querySelector('a[href="login.html"]');
    if (!loginBtn) return;

    if (!useMockBackend) {
        // --- Live Supabase Auth Path ---
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;

            if (session) {
                loginBtn.textContent = "Member Dashboard";
                loginBtn.href = "dashboard.html";
            } else {
                loginBtn.textContent = "Member Log In";
                loginBtn.href = "login.html";
            }
        } catch (err) {
            console.error("Auth Session check failed:", err.message);
        }
    } else {
        // --- Local Mock Auth Path ---
        const mockUser = localStorage.getItem("mock_session_user");
        if (mockUser) {
            loginBtn.textContent = "Member Dashboard";
            loginBtn.href = "dashboard.html";
        } else {
            loginBtn.textContent = "Member Log In";
            loginBtn.href = "login.html";
        }
    }
});

// Unified Login Action
async function loginMember(email, password) {
    if (!useMockBackend && supabaseClient) {
        return await supabaseClient.auth.signInWithPassword({ email, password });
    } else {
        // Simulate a successful local login
        localStorage.setItem("mock_session_user", JSON.stringify({ email }));
        return { data: { user: { email } }, error: null };
    }
}

// Unified Logout Action
async function logoutMember() {
    if (!useMockBackend && supabaseClient) {
        await supabaseClient.auth.signOut();
    } else {
        localStorage.removeItem("mock_session_user");
    }
    window.location.href = "index.html";
}