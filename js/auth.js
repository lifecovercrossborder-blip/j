/// js/auth.js>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone

// 1. Initialize Supabase Client
const SUPABASE_URL = "https://uygivlgukgzplrxxtwbb.supabase.coy, ''),
    coalesce(new.raw_user_meta_data->>'sadc_country',supabase.co"; // Replace with your Project URL
const SUPABASE_ANON_KEY = "your-public-anon-key";          '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
// Replace with your Anon Key

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.```

---

### Step 2: Implement the Authentication Logic (`js/auth.js`)
This complete version of `js/auth.error("Supabase CDN not loaded. Make sure the script tag is placed in the head/body.");
}

// 2. Global State Listener & Protected Routes Manager
document.addEventListener("DOMContentLoaded", () => {
    if (!supabaseClient) return;

    js` manages sessions, enforces page-level route protection (unauthorized users are kicked off the dashboard), updates databases, and manages// Listen to Auth State Changes (Login, Logout, Token Refreshes)
    supabaseClient.auth.on password reset hooks.

Replace your existing **`js/auth.js`** file with this code:

```javascript
// js/AuthStateChange(async (event, session) => {
        const loginBtn = document.querySelector('aauth.js

// 1. Initialize Supabase Client
const SUPABASE_URL = "https://uygivlgukgzplrxxtwbb.supabase.co.[href="login.html"]');
        const currentPage = window.location.pathname.split("/").pop();

        if (session) {
            // Userco"; // Replace with your project URL
const SUPABASE_ANON_KEY = "your-anon-public is Authenticated globally
            if (loginBtn) {
                loginBtn.textContent = "Dashboard";
                loginBtn.href =-key";          // Replace with your anon key

let supabaseClient = null;

if (typeof supabase !== 'undefined "dashboard.html";
            }
            // Redirect logged-in users away from the login page
            if (') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {currentPage === "login.html") {
                window.location.href = "dashboard.html";
            }
        } else {
            // User is Unauthenticated
            if (loginBtn) {
                loginBtn.textContent = "Member Log In";
                loginBtn.
    console.warn("Supabase library not loaded. Check script order in your HTML files.");
}

// href = "login.html";
            }
            // Protect private pages (e.g. dashboard.html)
            if (currentPage2. Global Route Guard and UI Handler
document.addEventListener("DOMContentLoaded", async () => {
    if (!supabaseClient) return;

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
         === "dashboard.html") {
                window.location.href = "login.html";
            }
        }
    });
if (error) throw error;

        const loginBtn = document.querySelector('a});

// 3. Register New Account (Sign Up + Profile Creation)
async function signUpUser(email, password, fullName, phone, country[href="login.html"]');
        const currentPath = window.location.pathname;

        if (session) {
            // Update) {
    try {
        // Create user credentials in Supabase Auth Auth table
        const { data, error navigation button to show Dashboard link if logged in
            if (loginBtn) {
                loginBtn.textContent = "Member Dashboard";
                 } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;

loginBtn.href = "dashboard.html";
            }

            // If on the protected dashboard, populate dynamic user        if (data.user) {
            // Insert custom profile information into public.profiles
            const { error: profileError } data
            if (currentPath.includes("dashboard.html")) {
                loadDashboardData(session.user);
            } = await supabaseClient
                .from('profiles')
                .insert(
        } else {
            // Kick users out of dashboard.html if they are not logged in
            if (currentPath[
                    {
                        id: data.user.id,
                        full_name: fullName,
                        phone: phone,
                        country: country
                    }
                ]);
            if.includes("dashboard.html")) {
                window.location.href = "login.html?status=unauthorized";
            } (profileError) throw profileError;
        }
        return { data, error: null };
    } catch (err
            if (loginBtn) {
                loginBtn.textContent = "Member Log In";
                loginBtn) {
        return { data: null, error: err };
    }
}

// 4. Log In User (Authentication.href = "login.html";
            }
        }
    } catch (err) {
        console.error(" + History Logging)
async function signInUser(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw errorAuth initialization failed:", err.message);
    }
});

// 3. User Sign Up Routine (Passes custom variables;

        if (data.user) {
            // Log successful login session details
            await supabaseClient
                . to public profiles via metadata)
async function signUpUser(email, password, firstName, lastName, phone, country) {from('login_history')
                .insert([
                    {
                        user_id: data.user.id,
                        user_agent: navigator.userAgent
                    }
                ]);
        }
        return { data, error: null };
    } catch (err) {
        return { data: null, error:
    if (!supabaseClient) return { error: { message: "Client uninitialized" } };

    return await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
 err };
    }
}

// 5. Trigger Password Reset Email
async function triggerPasswordReset(email) {
    const            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                sad redirectToUrl = `${window.location.origin}/reset-password.html`;
    return await supabaseClient.auth.c_country: country
            }
        }
    });
}

// 4. User Sign In &resetPasswordForEmail(email, {
        redirectTo: redirectToUrl,
    });
}

// 6. Complete Password Update Log Session History Routine
async function signInUser(email, password) {
    if (!supabaseClient) return { error: { (Processing incoming tokens)
async function updatePassword(newPassword) {
    return await supabaseClient.auth.update message: "Client uninitialized" } };

    const response = await supabaseClient.auth.signInWithPassword({ email, password });
User({ password: newPassword });
}

// 7. Sign Out Action
async function signOutUser() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    window.location.href = "index.html    
    // Log login event in audit table upon success
    if (response.data && response.data.user";
}