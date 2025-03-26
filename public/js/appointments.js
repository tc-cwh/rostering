document.addEventListener('DOMContentLoaded', () => {
    // Initialize SortableJS for drag and drop
    const tableBody = document.getElementById('sortableTableBody');
    new Sortable(tableBody, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        handle: '.drag-handle'
    });

    // Add first row
    addTableRow();

    // Event listeners
    document.getElementById('addRowBtn').addEventListener('click', addTableRow);
    document.getElementById('submitBatchBtn').addEventListener('click', submitBatch);
    document.getElementById('csvUpload').addEventListener('change', handleFileImport);
    document.getElementById('downloadTemplate').addEventListener('click', downloadTemplate);

    function addTableRow(data = {}) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="asset-tag" value="${data.assetTag || ''}" 
                  pattern="[A-Za-z0-9]{6,10}" required></td>
            <td>
                <select class="device-type" required>
                    <option value="S" ${data.deviceType === 'S' ? 'selected' : ''}>S</option>
                    <option value="W" ${data.deviceType === 'W' ? 'selected' : ''}>W</option>
                    <option value="M" ${data.deviceType === 'M' ? 'selected' : ''}>M</option>
                </select>
            </td>
            <td><input type="text" class="user-name" value="${data.userName || ''}" required></td>
            <td><input type="text" class="user-contact" value="${data.userContact || ''}" 
                  pattern="[0-9+]{8,15}" required></td>
            <td><input type="time" class="appointment-time" value="${data.time || ''}" required></td>
            <td><input type="text" class="remarks" value="${data.remarks || ''}"></td>
            <td>
                <span class="drag-handle">☰</span>
                <span class="remove-row">✕</span>
            </td>
        `;
        
        // Add remove functionality
        row.querySelector('.remove-row').addEventListener('click', () => {
            if (tableBody.children.length > 1) {
                row.remove();
            } else {
                showToast('At least one row must remain', 'error');
            }
        });
        
        tableBody.appendChild(row);
    }

    async function handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await readFile(file);
            const jsonData = convertToJson(data);
            
            // Clear existing rows (keep one)
            while (tableBody.children.length > 1) {
                tableBody.removeChild(tableBody.lastChild);
            }
            
            // Populate with imported data
            jsonData.forEach(row => {
                addTableRow({
                    assetTag: row['Asset Tag'],
                    deviceType: row['Type'],
                    userName: row['User Name'],
                    userContact: row['Contact'],
                    time: row['Time'],
                    remarks: row['Remarks']
                });
            });
            
            showToast(`Imported ${jsonData.length} records`, 'success');
        } catch (error) {
            showToast('Error importing file: ' + error.message, 'error');
            console.error(error);
        }
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        });
    }

    function convertToJson(data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(firstSheet);
    }

    function downloadTemplate() {
        const template = [
            {
                'Asset Tag': 'ABC123',
                'Type': 'S',
                'User Name': 'John Doe',
                'Contact': '+123456789',
                'Time': '09:00',
                'Remarks': 'Server maintenance'
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Appointment_Template.xlsx");
    }

    function submitBatch() {
        const batchDate = document.getElementById('batchDate').value;
        if (!batchDate) {
            showToast('Please select a date', 'error');
            return;
        }

        const appointments = [];
        const rows = tableBody.querySelectorAll('tr');
        let hasErrors = false;

        rows.forEach((row, index) => {
            const assetTag = row.querySelector('.asset-tag').value.trim();
            const deviceType = row.querySelector('.device-type').value;
            const userName = row.querySelector('.user-name').value.trim();
            const userContact = row.querySelector('.user-contact').value.trim();
            const time = row.querySelector('.appointment-time').value;
            const remarks = row.querySelector('.remarks').value.trim();

            // Validate
            if (!assetTag || !userName || !userContact || !time) {
                row.style.backgroundColor = '#ffdddd';
                hasErrors = true;
                return;
            }

            appointments.push({
                assetTag: `${assetTag}-${deviceType}`,
                userName,
                userContact,
                appointmentTime: `${batchDate}T${time}`,
                remarks,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        });

        if (hasErrors) {
            showToast('Please fix errors in highlighted rows', 'error');
            return;
        }

        if (appointments.length > 0) {
            // Save to localStorage (replace with API call)
            const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
            localStorage.setItem('appointments', JSON.stringify([...existing, ...appointments]));
            
            showToast(`${appointments.length} requests submitted!`, 'success');
            setTimeout(() => window.location.href = 'calendar.html', 1500);
        } else {
            showToast('No valid appointments to submit', 'error');
        }
    }
});