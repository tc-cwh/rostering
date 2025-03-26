document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'engineer') {
        window.location.href = 'index.html';
        return;
    }

    loadAppointments();
});

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || []);
    const select = document.getElementById('appointmentSelect');
    
    select.innerHTML = '<option value="">Select Appointment</option>';
    appointments.forEach((appt, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${appt.title} - ${appt.date} (${appt.status})`;
        select.appendChild(option);
    });
}

function updateStatus() {
    const index = document.getElementById('appointmentSelect').value;
    const newStatus = document.getElementById('statusSelect').value;
    
    if (!index || index === '') {
        showToast('Please select an appointment', 'error');
        return;
    }

    const appointments = JSON.parse(localStorage.getItem('appointments'));
    appointments[index].status = newStatus;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    showToast('Status updated successfully!', 'success');
    loadAppointments(); // Refresh the list
}