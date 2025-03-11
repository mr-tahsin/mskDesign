console.log("Script loaded");

const studentNames = [
  "Aarif Ahmed",
  "Bushra Islam",
  "Chowdhury Rahman",
  "Sanjana Islam",
  "Emon Hasan",
  "Fahima Khan",
  "Golam Mostafa",
  "Habibur Rahman",
  "Imran Hossain",
  "Jannatul Ferdous",
  "Kamal Uddin",
  "Laila Islam",
  "Mahmudul Hasan",
  "Nusrat Jahan",
  "Omar Faruk",
  "Parveen Akter",
];

const students = [];
let rollCounter = 6345;

for (let grade = 1; grade <= 5; grade++) {
  for (let i = 1; i <= 70; i++) {
    const section = i <= 23 ? "A" : i <= 46 ? "B" : "C";
    const name = studentNames[Math.floor(Math.random() * studentNames.length)];
    const monthlyFee = Math.floor(Math.random() * 2000) + 1000;
    const previousDue =
      Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : 0;

    const monthlyPayments2024 = {
      jul: Math.random() > 0.3 ? monthlyFee : 0,
      aug: Math.random() > 0.3 ? monthlyFee : 0,
      sept: Math.random() > 0.3 ? monthlyFee : 0,
      oct: Math.random() > 0.3 ? monthlyFee : 0,
      nov: Math.random() > 0.3 ? monthlyFee : 0,
      dec: Math.random() > 0.3 ? monthlyFee : 0,
    };

    const monthlyPayments2025 = {
      jan: Math.random() > 0.3 ? monthlyFee : 0,
      feb: Math.random() > 0.3 ? monthlyFee : 0,
      mar: Math.random() > 0.3 ? monthlyFee : 0,
      apr: Math.random() > 0.3 ? monthlyFee : 0,
      may: Math.random() > 0.3 ? monthlyFee : 0,
      jun: Math.random() > 0.3 ? monthlyFee : 0,
    };

    const totalPaid =
      Object.values(monthlyPayments2024).reduce((a, b) => a + b, 0) +
      Object.values(monthlyPayments2025).reduce((a, b) => a + b, 0);
    const lateFees = Math.floor(Math.random() * 1000);
    const currentSalary = monthlyFee; // Assuming this is same as monthly fee
    const totalDue = monthlyFee * 12 + previousDue - totalPaid;

    students.push({
      roll: rollCounter++,
      name,
      grade: grade.toString(),
      section,
      monthlyFee,
      previousDue,
      payments2024: monthlyPayments2024,
      payments2025: monthlyPayments2025,
      totalPaid,
      lateFees,
      currentSalary,
      totalDue,
      paymentHistory: generatePaymentHistory(
        monthlyPayments2024,
        monthlyPayments2025
      ),
    });
  }
}

function generatePaymentHistory(payments2024, payments2025) {
  const history = [];
  const months = [
    { name: "Jul-2024", amount: payments2024.jul },
    { name: "Aug-2024", amount: payments2024.aug },
    { name: "Sept-2024", amount: payments2024.sept },
    { name: "Oct-2024", amount: payments2024.oct },
    { name: "Nov-2024", amount: payments2024.nov },
    { name: "Dec-2024", amount: payments2024.dec },
    { name: "Jan-2025", amount: payments2025.jan },
    { name: "Feb-2025", amount: payments2025.feb },
    { name: "Mar-2025", amount: payments2025.mar },
    { name: "Apr-2025", amount: payments2025.apr },
    { name: "May-2025", amount: payments2025.may },
    { name: "Jun-2025", amount: payments2025.jun },
  ];

  months.forEach((month) => {
    if (month.amount > 0) {
      history.push({
        date: month.name,
        type: "Tuition",
        amountPaid: month.amount,
        dueAmount: 0,
        status: "paid",
      });
    }
  });
  return history;
}

let currentPage = 1;
const studentsPerPage = 20;
let filteredStudents = [...students];

function displayStudents() {
  const tableBody = document.querySelector("#fees-table tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  paginatedStudents.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${student.name}</td>
      <td>${student.section}</td>
      <td>${student.monthlyFee}</td>
      <td>${student.previousDue}</td>
      <td>${student.payments2024.jul}</td>
      <td>${student.payments2024.aug}</td>
      <td>${student.payments2024.sept}</td>
      <td>${student.payments2024.oct}</td>
      <td>${student.payments2024.nov}</td>
      <td>${student.payments2024.dec}</td>
      <td>${student.payments2025.jan}</td>
      <td>${student.payments2025.feb}</td>
      <td>${student.payments2025.mar}</td>
      <td>${student.payments2025.apr}</td>
      <td>${student.payments2025.may}</td>
      <td>${student.payments2025.jun}</td>
      <td>${student.totalPaid}</td>
      <td>${student.lateFees}</td>
      <td>${student.totalDue}</td>
      <td>
      <button class="view-details">View Details</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".view-details").forEach((button, index) => {
    button.addEventListener("click", () => openModal(paginatedStudents[index]));
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  document.getElementById(
    "page-info"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
}

function filterStudents() {
  const grade = document.getElementById("grade").value;
  const financialYear = document.getElementById("financial-year").value;

  filteredStudents = [...students];

  if (grade) {
    filteredStudents = filteredStudents.filter(
      (student) => student.grade === grade
    );
  }
  if (financialYear) {
    // Add financial year filtering logic if needed
    filteredStudents = filteredStudents; // Placeholder
  }

  currentPage = 1;
  displayStudents();
}

function downloadExcel() {
  const data = filteredStudents.map((student, index) => ({
    SL: index + 1,
    Name: student.name,
    Section: student.section,
    "Monthly Tuition Fee": student.monthlyFee,
    "Previous Due": student.previousDue,
    "Jul 2024": student.payments2024.jul,
    "Aug 2024": student.payments2024.aug,
    "Sept 2024": student.payments2024.sept,
    "Oct 2024": student.payments2024.oct,
    "Nov 2024": student.payments2024.nov,
    "Dec 2024": student.payments2024.dec,
    "Jan 2025": student.payments2025.jan,
    "Feb 2025": student.payments2025.feb,
    "Mar 2025": student.payments2025.mar,
    "Apr 2025": student.payments2025.apr,
    "May 2025": student.payments2025.may,
    "Jun 2025": student.payments2025.jun,
    "Total Paid": student.totalPaid,
    "Late Fees": student.lateFees,
    "Total Due": student.totalDue,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Student Fees");
  XLSX.writeFile(wb, "student_fees_report.xlsx");
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Student Fees Report", 14, 10);

  const tableData = filteredStudents.map((student, index) => [
    index + 1,
    student.name,
    student.section,
    student.monthlyFee,
    student.previousDue,
    student.payments2024.jul,
    student.payments2024.aug,
    student.payments2024.sept,
    student.payments2024.oct,
    student.payments2024.nov,
    student.payments2024.dec,
    student.payments2025.jan,
    student.payments2025.feb,
    student.payments2025.mar,
    student.payments2025.apr,
    student.payments2025.may,
    student.payments2025.jun,
    student.totalPaid,
    student.lateFees,
    student.totalDue,
  ]);

  doc.autoTable({
    startY: 20,
    head: [
      [
        "SL",
        "Name",
        "Section",
        "Monthly Tuition Fee",
        "Previous Due",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Total Paid",
        "Late Fees",
        "Total Due",
      ],
    ],
    body: tableData,
  });

  doc.save("student_fees_report.pdf");
}

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayStudents();
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayStudents();
  }
});

document.getElementById("grade").addEventListener("change", filterStudents);
document
  .getElementById("financial-year")
  .addEventListener("change", filterStudents);

document.getElementById("clear-filters").addEventListener("click", () => {
  document.getElementById("grade").value = "";
  document.getElementById("financial-year").value = "";
  filterStudents();
});

document
  .getElementById("download-excel")
  .addEventListener("click", downloadExcel);
document.getElementById("download-pdf").addEventListener("click", downloadPDF);

function openModal(student) {
  const modal = document.getElementById("payment-details-modal");
  document.getElementById("modal-student-img").textContent = student.name;
  document.getElementById("modal-student-name").textContent = student.name;
  document.getElementById("modal-grade").textContent = student.grade;
  document.getElementById("modal-section").textContent = student.section;
  document.getElementById("modal-section-father").textContent = student.name;
  document.getElementById("modal-section-mother").textContent = student.name;

  const paymentHistoryBody = document.getElementById("modal-payment-history");
  paymentHistoryBody.innerHTML = "";

  modal.style.display = "flex";
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("payment-details-modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  displayStudents();
});
