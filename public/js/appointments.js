document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) window.location.href = 'index.html';

    // Show correct view
    document.querySelectorAll('.role-view').forEach(el => el.style.display = 'none');
    document.getElementById(`${currentUser.role}View`).style.display = 'block';

    if (currentUser.role === 'helpdesk') setupHelpdesk();
    if (currentUser.role === 'engineer') setupEngineer();
    if (currentUser.role === 'admin') setupAdmin();
});

function setupHelpdesk() {
    document.getElementById('appointmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const appointments = JSON.parse(localStorage.getItem('appointments') || [];
        
        appointments.push({
            id: Date.now(),
            title: document.getElementById('title').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            description: document.getElementById('description').value,
            status: 'pending',
            createdBy: JSON.parse(localStorage.getItem('currentUser')).username
        });

        localStorage.setItem('appointments', JSON.stringify(appointments));
        window.location.href = 'calendar.html';
    });
}

function setupEngineer() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || []);
    const list = document.getElementById('appointmentsList');
    
    list.innerHTML = appointments.map(appt => `
        <div class="appointment-card">
            <h3>${appt.title}</h3>
            <p>${appt.date} ${appt.time}</p>
            <p>Status: ${appt.status}</p>
            <p>Created by: ${appt.createdBy}</p>
        </div>
    `).join('');
}