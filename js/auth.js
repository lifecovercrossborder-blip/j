// Replace these with your actual Supabase Project details
const SUPABASE_URL = "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = "your-supabase-anon-key";

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