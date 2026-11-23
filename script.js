// ===== DATABASE (localStorage Fallback & Offline) =====
function getUsers() {
    return JSON.parse(localStorage.getItem('umsUsers') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('umsUsers', JSON.stringify(users));
}

// Seed default account if no users exist
if (getUsers().length === 0) {
    saveUsers([
        { name: 'Abhishek Singh', email: 'abhishek@uniflow.edu', password: 'password', role: 'student', initials: 'AS' },
        { name: 'Dr. Sharma', email: 'sharma@uniflow.edu', password: 'password', role: 'faculty', initials: 'DS' },
        { name: 'Admin', email: 'admin@uniflow.edu', password: 'password', role: 'admin', initials: 'AD' }
    ]);
}

// ===== HELPER =====
function getInitials(name) {
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ===== VIEW TOGGLE =====
const loginView = document.getElementById('loginView');
const signupView = document.getElementById('signupView');

function showView(view) {
    loginView.classList.toggle('hidden', view !== 'login');
    signupView.classList.toggle('hidden', view !== 'signup');
    document.querySelectorAll('.login-error, .login-success').forEach(el => el.hidden = true);
}

document.getElementById('showSignup')?.addEventListener('click', e => { e.preventDefault(); showView('signup'); });
document.getElementById('showSignup2')?.addEventListener('click', e => { e.preventDefault(); showView('signup'); });
document.getElementById('showLogin')?.addEventListener('click', e => { e.preventDefault(); showView('login'); });
document.getElementById('showLogin2')?.addEventListener('click', e => { e.preventDefault(); showView('login'); });

// ===== LOGIN =====
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');
let selectedRole = 'admin';

const defaultRoleEmails = {
    admin: 'admin@uniflow.edu',
    faculty: 'sharma@uniflow.edu',
    student: 'abhishek@uniflow.edu'
};

// Role tabs on login
document.querySelectorAll('.role-tabs button').forEach(button =>
    button.addEventListener('click', () => {
        selectedRole = button.dataset.role;
        document.querySelectorAll('.role-tabs button').forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');
        if (defaultRoleEmails[selectedRole]) {
            emailInput.value = defaultRoleEmails[selectedRole];
        }
        loginError.hidden = true;
    })
);

// Toggle password visibility (login)
document.getElementById('togglePassword')?.addEventListener('click', event => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    event.currentTarget.textContent = visible ? '◌' : '◉';
});

// Login submit
document.getElementById('loginForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    loginError.hidden = true;
    loginSuccess.hidden = true;

    const email = emailInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();

    if (!email || !pass) {
        loginError.textContent = 'Please enter your email and password.';
        loginError.hidden = false;
        return;
    }

    // Try backend API first
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.ok) {
            if (data.token) localStorage.setItem('umsToken', data.token);
            localStorage.setItem('umsUser', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1),
                roleKey: data.user.role,
                initials: data.user.initials
            }));
            window.location.href = 'dashboard.html';
            return;
        } else if (res.status === 401 || res.status === 400) {
            loginError.textContent = data.error || 'Invalid credentials.';
            loginError.hidden = false;
            return;
        }
    } catch (apiErr) {
        // Backend not reachable, fall through to localStorage
        console.log('Backend not reachable, using localStorage fallback');
    }

    // LocalStorage fallback
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email && u.password === pass);

    if (!user) {
        loginError.textContent = 'Invalid email or password. Please try again.';
        loginError.hidden = false;
        return;
    }

    // Success — save session and redirect
    localStorage.setItem('umsUser', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        roleKey: user.role,
        initials: user.initials
    }));
    window.location.href = 'dashboard.html';
});

// ===== SIGNUP =====
let signupRole = 'student';

// Role selector buttons
document.querySelectorAll('.role-option').forEach(btn =>
    btn.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        signupRole = btn.dataset.role;
    })
);

// Toggle password visibility (signup)
document.getElementById('toggleSignupPassword')?.addEventListener('click', event => {
    const input = document.getElementById('signupPassword');
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    event.currentTarget.textContent = visible ? '◌' : '◉';
});

// Signup submit
document.getElementById('signupForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const signupError = document.getElementById('signupError');
    const signupSuccess = document.getElementById('signupSuccess');
    signupError.hidden = true;
    signupSuccess.hidden = true;

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const pass = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    // Validations
    if (!name || !email || !pass || !confirm) {
        signupError.textContent = 'Please fill in all fields.';
        signupError.hidden = false;
        return;
    }

    if (pass.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters.';
        signupError.hidden = false;
        return;
    }

    if (pass !== confirm) {
        signupError.textContent = 'Passwords do not match.';
        signupError.hidden = false;
        return;
    }

    // Try backend API first
    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass, role: signupRole })
        });
        const data = await res.json();
        if (res.ok) {
            if (data.token) localStorage.setItem('umsToken', data.token);
            // Also sync to localStorage
            const users = getUsers();
            if (!users.find(u => u.email.toLowerCase() === email)) {
                users.push({
                    name: name,
                    email: email,
                    password: pass,
                    role: signupRole,
                    initials: getInitials(name)
                });
                saveUsers(users);
            }

            signupSuccess.textContent = '✅ Account created successfully! Redirecting to login...';
            signupSuccess.hidden = false;
            document.getElementById('signupForm').reset();

            setTimeout(() => {
                showView('login');
                emailInput.value = email;
                passwordInput.value = '';
                passwordInput.focus();
                loginSuccess.textContent = '✅ Account created! Sign in with your new credentials.';
                loginSuccess.hidden = false;
            }, 1200);
            return;
        } else if (res.status === 400 || res.status === 409) {
            signupError.textContent = data.error || 'Registration failed.';
            signupError.hidden = false;
            return;
        }
    } catch (apiErr) {
        console.log('Backend not reachable for signup, using localStorage fallback');
    }

    // LocalStorage fallback
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email)) {
        signupError.textContent = 'An account with this email already exists.';
        signupError.hidden = false;
        return;
    }

    // Create account
    const newUser = {
        name: name,
        email: email,
        password: pass,
        role: signupRole,
        initials: getInitials(name)
    };
    users.push(newUser);
    saveUsers(users);

    // Show success & switch to login
    signupSuccess.textContent = '✅ Account created successfully! Redirecting to login...';
    signupSuccess.hidden = false;
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        showView('login');
        emailInput.value = email;
        passwordInput.value = '';
        passwordInput.focus();
        loginSuccess.textContent = '✅ Account created! Sign in with your new credentials.';
        loginSuccess.hidden = false;
    }, 1200);
});
