// Function to load data from localStorage
function loadData() {
    const receiverData = JSON.parse(localStorage.getItem('receiverData'));
    const invoiceNumber = localStorage.getItem('invoiceNumber') || '';

    if (receiverData) {
        document.getElementById('receiverName').value = receiverData.name || '';
        document.getElementById('streetAddress').value = receiverData.address || '';
        document.getElementById('cityStateZip').value = receiverData.cityStateZip || '';
        document.getElementById('phone').value = receiverData.phone || '';
        document.getElementById('email').value = receiverData.email || '';
        document.getElementById('project').value = receiverData.project || '';
        document.getElementById('company').value = receiverData.company || '';
        document.getElementById('unitPrice').value = receiverData.unitPrice || '';
    }
    
    document.getElementById('invoiceNumber').value = invoiceNumber; // Load the invoice number
}

function saveData() {
    const receiverData = {
        name: document.getElementById('receiverName').value,
        address: document.getElementById('streetAddress').value,
        cityStateZip: document.getElementById('cityStateZip').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        project: document.getElementById('project').value,
        company: document.getElementById('company').value,
        unitPrice: document.getElementById('unitPrice').value,
    };

    localStorage.setItem('receiverData', JSON.stringify(receiverData));
    alert('Data saved!');
}

function getCurrentMonthName() {
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonth = new Date().getMonth(); // Gets the current month (0-11)
    return months[currentMonth]; // Returns the month's name
}

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function getFifthBusinessDay() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1);
    let businessDaysCount = 0;
    let currentDate = firstDay;

    while (businessDaysCount < 5) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            businessDaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return formatDate(currentDate);
}

function generatePDF() {
    saveData();
    const { jsPDF } = window.jspdf;

    const receiverData = JSON.parse(localStorage.getItem('receiverData'));
    const invoiceNumber = document.getElementById('invoiceNumber').value; // Get invoice number from input

    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(22);
    doc.text("Invoice", 20, 30);
    
    // Format dates
    const today = new Date();
    const dueDate = new Date(getFifthBusinessDay());

    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(today)}`, 20, 40);
    doc.text(`Invoice # ${invoiceNumber}`, 20, 50); // Use the input invoice number
    doc.text(`Due Date: ${getFifthBusinessDay()}`, 20, 60);

    // Receiver Information
    doc.setFontSize(16);
    doc.text("RECEIVER INFORMATION", 20, 80);
    doc.setFontSize(15);
    doc.text(`Receiver Name:`, 20, 90);
    doc.setFontSize(12);
    doc.text(`${receiverData.name}`, 80, 90);
    doc.setFontSize(15);
    doc.text(`Street Address:`, 20, 100);
    doc.setFontSize(12);
    doc.text(`${receiverData.address}`, 80, 100);
    doc.setFontSize(15);
    doc.text(`City, State, ZIP Code:`, 20, 110);
    doc.setFontSize(12);
    doc.text(`${receiverData.cityStateZip}`, 80, 110);
    doc.setFontSize(15);
    doc.text(`Phone:`, 20, 120);
    doc.setFontSize(12);
    doc.text(`${receiverData.phone}`, 80, 120);
    doc.setFontSize(15);
    doc.text(`Email Address:`, 20, 130);
    doc.setFontSize(12);
    doc.text(`${receiverData.email}`, 80, 130);

    // Bill To Section
    doc.setFontSize(18);
    doc.text("BILL TO", 20, 150);
    doc.setFontSize(15);
    doc.text(`Recipient Name:`, 20, 160);
    doc.setFontSize(12);
    doc.text(`Trio Global Inc`, 80, 160);
    doc.setFontSize(15);
    doc.text(`Company Name:`, 20, 170);
    doc.setFontSize(12);
    doc.text(`Trio`, 80, 170);
    doc.setFontSize(15);
    doc.text(`EIN:`, 20, 180);
    doc.setFontSize(12);
    doc.text(`82-4821545`, 80, 180);
    doc.setFontSize(15);
    doc.text(`Street Address:`, 20, 190);
    doc.setFontSize(12);
    doc.text(`24 School St`, 80, 190);
    doc.setFontSize(15);
    doc.text(`City, State, ZIP Code:`, 20, 200);
    doc.setFontSize(12);
    doc.text(`Boston, MA 02108 USA`, 80, 200);

    // Description Section
    doc.setFontSize(16);
    doc.text("Description", 20, 220);
    doc.setFontSize(15);
    doc.text("Project:", 20, 230);
    doc.setFontSize(12);
    doc.text(receiverData.project, 80, 230);
    doc.setFontSize(15);
    doc.text("Company:", 20, 240);
    doc.setFontSize(12);
    doc.text(receiverData.company, 80, 240);
    doc.setFontSize(15);
    doc.text("Month:", 20, 250);
    doc.setFontSize(12);
    doc.text(getCurrentMonthName(), 80, 250);
    doc.setFontSize(15);
    doc.text(`Unit Price:`, 20, 260);
    doc.setFontSize(12);
    doc.text(`$${receiverData.unitPrice}`, 80, 260);
    doc.setFontSize(15);
    doc.text("Total:", 20, 270);
    doc.setFontSize(12);
    doc.text(`$${receiverData.unitPrice}`, 80, 270);

    // Save PDF
    doc.save('invoice.pdf');

    // Update the invoice number in local storage
    localStorage.setItem('invoiceNumber', invoiceNumber);
}

// Load data when the window loads
window.onload = loadData;
