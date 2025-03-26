document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') window.location.href = 'index.html';

    loadUsers();
    loadAppointments();
});

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || []);
    const tbody = document.querySelector('#usersTable tbody');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function createUser() {
    const users = JSON.parse(localStorage.getItem('users'));
    const newUser = {
        username: document.getElementById('newUsername').value,
        password: document.getElementById('newPassword').value,
        role: document.getElementById('newUserRole').value
    };

    if (users.some(u => u.username === newUser.username)) {
        alert('Username already exists!');
        return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

function deleteUser(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    const filtered = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(filtered));
    loadUsers();
}