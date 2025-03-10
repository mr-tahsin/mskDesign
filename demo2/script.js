console.log("Script loaded");

// Sample Data
const bangladeshiNames = [
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
  "Qazi Rahman",
  "Rafiqul Islam",
  "Sabrina Ahmed",
  "Tahmina Akter",
  "Uzzal Kumar",
  "Vaskor Chowdhury",
  "Wahidul Islam",
  "Yasmin Akter",
  "Zahid Hasan",
];

const students = [];
let rollCounter = 6345;

for (let grade = 1; grade <= 5; grade++) {
  for (let i = 1; i <= 70; i++) {
    const section = i <= 23 ? "A" : i <= 46 ? "B" : "C";
    const name =
      bangladeshiNames[Math.floor(Math.random() * bangladeshiNames.length)];
    const totalFees = Math.floor(Math.random() * 5000) + 1000;
    const lateFees = Math.floor(Math.random() * 500);
    const paymentStatus = Math.random() > 0.5 ? "paid" : "due";
    const paymentDate = generateRandomDate();
    const roll = rollCounter++;

    students.push({
      roll: roll.toString(),
      name: name,
      grade: grade.toString(),
      section: section,
      totalFees: totalFees,
      lateFees: lateFees,
      paymentStatus: paymentStatus,
      paymentDate: paymentDate,
      paymentHistory: [
        {
          date: paymentDate,
          type: "Tuition",
          amountPaid: paymentStatus === "paid" ? totalFees : 0,
          dueAmount: paymentStatus === "due" ? totalFees : 0,
          status: paymentStatus,
        },
      ],
    });
  }
}
console.log("Students generated:", students.length);

function generateRandomDate() {
  const year = [2023, 2024, 2025][Math.floor(Math.random() * 3)];
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

function sortStudentsByDate(studentsArray) {
  return studentsArray.sort((a, b) => {
    const dateA = new Date(a.paymentDate.split("-").reverse().join("-"));
    const dateB = new Date(b.paymentDate.split("-").reverse().join("-"));
    return dateB - dateA;
  });
}

let currentPage = 1;
const studentsPerPage = 20;
let filteredStudents = sortStudentsByDate([...students]);

function displayStudents() {
  console.log("Displaying students:", filteredStudents.length);
  const tableBody = document.querySelector("#fees-table tbody");
  if (!tableBody) {
    console.error("Fees table body not found!");
    return;
  }
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  paginatedStudents.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${student.roll}</td>
      <td>${student.name}</td>
      <td>${student.grade}</td>
      <td>${student.section}</td>
      <td>${student.totalFees}</td>
      <td>${student.lateFees}</td>
      <td>${student.paymentStatus}</td>
      <td>${student.paymentDate}</td>
      <td><button class="view-details">View Details</button></td>
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
  const search = document.getElementById("search").value.trim().toLowerCase();
  const section = document.getElementById("section").value;
  const paymentStatus = document.getElementById("payment-status").value;
  const fromDate = document.getElementById("from-date").value;
  const toDate = document.getElementById("to-date").value;
  const financialYear = document.getElementById("financial-year").value;
  const month = document.getElementById("month").value;

  filteredStudents = sortStudentsByDate([...students]);

  if (grade) {
    filteredStudents = filteredStudents.filter(
      (student) => student.grade === grade
    );
  }
  if (search) {
    filteredStudents = filteredStudents.filter(
      (student) =>
        student.roll.includes(search) ||
        student.name.toLowerCase().includes(search)
    );
  }
  if (section) {
    filteredStudents = filteredStudents.filter(
      (student) => student.section === section
    );
  }
  if (paymentStatus) {
    filteredStudents = filteredStudents.filter(
      (student) => student.paymentStatus === paymentStatus
    );
  }
  if (fromDate && toDate) {
    const from = new Date(fromDate.split("-").reverse().join("-"));
    const to = new Date(toDate.split("-").reverse().join("-"));
    filteredStudents = filteredStudents.filter((student) => {
      const paymentDate = new Date(
        student.paymentDate.split("-").reverse().join("-")
      );
      return paymentDate >= from && paymentDate <= to;
    });
  }
  if (financialYear) {
    const [startYear, endYear] = financialYear.split("-");
    const startDate = new Date(`${startYear}-07-01`);
    const endDate = new Date(`${endYear}-06-30`);
    filteredStudents = filteredStudents.filter((student) => {
      const paymentDate = new Date(
        student.paymentDate.split("-").reverse().join("-")
      );
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }
  if (month) {
    filteredStudents = filteredStudents.filter(
      (student) => student.paymentDate.split("-")[1] === month
    );
  }

  currentPage = 1;
  displayStudents();
}

function downloadExcel() {
  const data = filteredStudents.map((student, index) => ({
    SL: index + 1,
    "Student Roll": student.roll,
    "Student Name": student.name,
    Grade: student.grade,
    Section: student.section,
    "Total Fees": student.totalFees,
    "Late Fees": student.lateFees,
    "Payment Status": student.paymentStatus,
    "Payment Date": student.paymentDate,
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
    student.roll,
    student.name,
    student.grade,
    student.section,
    student.totalFees,
    student.lateFees,
    student.paymentStatus,
    student.paymentDate,
  ]);

  doc.autoTable({
    startY: 20,
    head: [
      [
        "SL",
        "Student Roll",
        "Student Name",
        "Grade",
        "Section",
        "Total Fees",
        "Late Fees",
        "Payment Status",
        "Payment Date",
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

// Automatic Filter Application
document.getElementById("grade").addEventListener("change", filterStudents);
document.getElementById("search").addEventListener("input", filterStudents);
document.getElementById("section").addEventListener("change", filterStudents);
document
  .getElementById("payment-status")
  .addEventListener("change", filterStudents);
document.getElementById("from-date").addEventListener("change", filterStudents);
document.getElementById("to-date").addEventListener("change", filterStudents);
document
  .getElementById("financial-year")
  .addEventListener("change", filterStudents);
document.getElementById("month").addEventListener("change", filterStudents);

document.getElementById("clear-filters").addEventListener("click", () => {
  document.getElementById("grade").value = "";
  document.getElementById("search").value = "";
  document.getElementById("section").value = "";
  document.getElementById("payment-status").value = "";
  document.getElementById("from-date").value = "";
  document.getElementById("to-date").value = "";
  document.getElementById("financial-year").value = "";
  document.getElementById("month").value = "";
  filterStudents();
});

document
  .getElementById("download-excel")
  .addEventListener("click", downloadExcel);
document.getElementById("download-pdf").addEventListener("click", downloadPDF);

function openModal(student) {
  const modal = document.getElementById("payment-details-modal");
  document.getElementById("modal-student-name").textContent = student.name;
  document.getElementById("modal-roll").textContent = student.roll;
  document.getElementById("modal-grade").textContent = student.grade;
  document.getElementById("modal-section").textContent = student.section;

  const paymentHistoryBody = document.getElementById("modal-payment-history");
  paymentHistoryBody.innerHTML = "";

  student.paymentHistory.forEach((payment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${payment.date}</td>
      <td>${payment.type}</td>
      <td>${payment.amountPaid}</td>
      <td>${payment.dueAmount}</td>
      <td>${payment.status}</td>
    `;
    paymentHistoryBody.appendChild(row);
  });

  modal.style.display = "flex";
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("payment-details-modal").style.display = "none";
});

flatpickr("#from-date", { dateFormat: "d-m-Y" });
flatpickr("#to-date", { dateFormat: "d-m-Y" });

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");
  filteredStudents = sortStudentsByDate([...students]);
  displayStudents();
});
