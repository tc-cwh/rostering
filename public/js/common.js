// Authentication check for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Redirect to login if not authenticated
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.endsWith('/index.html')) {
        window.location.href = 'index.html';
    }

    // Set current user display
    if (document.getElementById('currentUser')) {
        document.getElementById('currentUser').textContent = currentUser?.username || '';
    }

    // Logout functionality
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });
});

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}