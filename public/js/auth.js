const users = JSON.parse(localStorage.getItem('users') || '[]');
if (!users.length) {
    // Seed initial users
    users.push(
        { username: 'helpdesk', password: 'helpdesk123', role: 'helpdesk' },
        { username: 'engineer', password: 'engineer123', role: 'engineer' },
        { username: 'admin', password: 'admin123', role: 'admin' }
    );
    localStorage.setItem('users', JSON.stringify(users));
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMessage');

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        switch(user.role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'engineer':
                window.location.href = 'status-update.html';
                break;
            default:
                window.location.href = 'appointment.html';
        }
    } else {
        errorMsg.textContent = 'Invalid credentials';
    }
});