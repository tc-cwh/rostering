document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const calendarEl = document.getElementById('calendar');
    const appointments = JSON.parse(localStorage.getItem('appointments') || []);

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: appointments.map(appt => ({
            id: appt.id,
            title: appt.title,
            start: `${appt.date}T${appt.time}`,
            color: getStatusColor(appt.status),
            extendedProps: {
                description: appt.description,
                status: appt.status,
                createdBy: appt.createdBy
            }
        })),
        eventClick: function(info) {
            const event = info.event;
            const html = `
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${event.start.toLocaleString()}</p>
                <p><strong>Status:</strong> ${event.extendedProps.status}</p>
                <p><strong>Created by:</strong> ${event.extendedProps.createdBy}</p>
                <p>${event.extendedProps.description}</p>
            `;
            
            new FullCalendar.Dialog({
                title: 'Appointment Details',
                content: html,
                buttons: [
                    { text: 'Close', click: function() { this.close(); } }
                ]
            }).open();
        }
    });

    calendar.render();
});

function getStatusColor(status) {
    const colors = {
        pending: '#ffc107',
        confirmed: '#28a745',
        completed: '#17a2b8',
        cancelled: '#dc3545'
    };
    return colors[status] || '#007bff';
}