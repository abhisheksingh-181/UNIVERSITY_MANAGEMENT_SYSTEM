const accounts = {
    admin: { email: 'admin@uniflow.edu', name: 'Aarav Deshmukh', role: 'Administrator', initials: 'AD' },
    faculty: { email: 'priya.sharma@uniflow.edu', name: 'Priya Sharma', role: 'Faculty member', initials: 'PS' },
    student: { email: 'aditya.kashyap@uniflow.edu', name: 'Aditya Kashyap', role: 'Student', initials: 'AK' }
};

let selectedRole = 'admin';
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('loginError');

document.querySelectorAll('.role-tabs button').forEach(button => {
    button.addEventListener('click', () => {
        selectedRole = button.dataset.role;
        document.querySelectorAll('.role-tabs button').forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');
        emailInput.value = accounts[selectedRole].email;
        errorMessage.hidden = true;
    });
});

document.getElementById('togglePassword').addEventListener('click', event => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    event.currentTarget.textContent = visible ? 'Show' : 'Hide';
    event.currentTarget.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
});

document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault();

    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        errorMessage.textContent = 'Please enter your email and password.';
        errorMessage.hidden = false;
        return;
    }

    localStorage.setItem('umsUser', JSON.stringify({
        ...accounts[selectedRole],
        roleKey: selectedRole
    }));
    window.location.href = 'dashboard.html';
});
