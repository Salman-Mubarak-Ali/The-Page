// Authentication system using Express/MongoDB backend
const CURRENT_USER_KEY = 'thepage_current_user';
const TOKEN_KEY = 'thepage_auth_token';
const API_URL = '/api/auth';

export function initAuth(onLoginSuccess) {
  const authView = document.getElementById('authView');
  const mainApp = document.getElementById('mainApp');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  const showSignupBtn = document.getElementById('showSignup');
  const showLoginBtn = document.getElementById('showLogin');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check if already logged in
  const token = getToken();
  const currentUser = getCurrentUser();
  if (token && currentUser) {
    showMainApp();
    if (typeof onLoginSuccess === 'function') onLoginSuccess();
  } else {
    logout();
  }

  // Toggle between login and signup
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('d-none');
      signupForm.classList.remove('d-none');
    });
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.classList.add('d-none');
      loginForm.classList.remove('d-none');
    });
  }

  // Login
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(CURRENT_USER_KEY, email);
          showMainApp();
          if (typeof onLoginSuccess === 'function') onLoginSuccess();
        } else {
          alert(data.message || 'Invalid email or password');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Could not connect to the authentication server');
      }
    });
  }

  // Signup
  if (signupBtn) {
    signupBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;

      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }

      if (password.length < 4) {
        alert('Password must be at least 4 characters');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Account created! Please login.');
          signupForm.classList.add('d-none');
          loginForm.classList.remove('d-none');
          const loginEmailEl = document.getElementById('loginEmail');
          if (loginEmailEl) loginEmailEl.value = email;
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        alert('Could not connect to the authentication server');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      hideMainApp();
    });
  }

  function showMainApp() {
    if (authView) authView.classList.add('d-none');
    if (mainApp) mainApp.classList.remove('d-none');
    
    const user = getCurrentUser();
    const userDisplay = document.getElementById('currentUser');
    if (userDisplay && user) {
      userDisplay.textContent = `👤 ${user}`;
    }
  }

  function hideMainApp() {
    if (mainApp) mainApp.classList.add('d-none');
    if (authView) authView.classList.remove('d-none');
    const loginEmailEl = document.getElementById('loginEmail');
    const loginPasswordEl = document.getElementById('loginPassword');
    if (loginEmailEl) loginEmailEl.value = '';
    if (loginPasswordEl) loginPasswordEl.value = '';
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function getUserStorageKey(key) {
  const user = getCurrentUser();
  return user ? `${user}_${key}` : key;
}
