console.log("Script loaded");

// Sample Data
const bangladeshiNames = [
  "Aarif Ahmed",
  "Bushra Begum",
  "Chowdhury Rahman",
  "Dalia Akter",
  "Emon Hasan",
  "Fahima Khan",
  "Golam Mostafa",
  "Habiba Jahan",
  "Imran Hossain",
  "Jannatul Ferdous",
  "Kamal Uddin",
  "Laila Begum",
  "Mahmudul Hasan",
  "Nusrat Jahan",
  "Omar Faruk",
  "Parveen Akter",
  "Qazi Rahman",
  "Rafiqul Islam",
  "Sabrina Ahmed",
  "Tahmina Akter",
  "Uzzal Kumar",
  "Vaskor Roy",
  "Wahidul Islam",
  "Yasmin Akter",
  "Zahid Hasan",
];

const students = [];

// Generate 70 students per grade (1 to 5) with sections (A, B, C)
for (let grade = 1; grade <= 5; grade++) {
  for (let i = 1; i <= 70; i++) {
    const section = i <= 23 ? "A" : i <= 46 ? "B" : "C";
    const name =
      bangladeshiNames[Math.floor(Math.random() * bangladeshiNames.length)];
    const totalFees = Math.floor(Math.random() * 5000) + 1000;
    const lateFees = Math.floor(Math.random() * 500);
    const paymentStatus = Math.random() > 0.5 ? "paid" : "due";
    const paymentDate = generateRandomDate();

    students.push({
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

// Generate random date in DD-MM-YYYY format
function generateRandomDate() {
  const year = [2023, 2024, 2025][Math.floor(Math.random() * 3)];
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

// Sort students by paymentDate (latest first)
function sortStudentsByDate(studentsArray) {
  return studentsArray.sort((a, b) => {
    const dateA = new Date(a.paymentDate.split("-").reverse().join("-"));
    const dateB = new Date(b.paymentDate.split("-").reverse().join("-"));
    return dateB - dateA; // Descending order (latest first)
  });
}

// Pagination
let currentPage = 1;
const studentsPerPage = 20;
let filteredStudents = sortStudentsByDate([...students]); // Initialize with sorted data

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

// Filter Students
function filterStudents() {
  const grade = document.getElementById("grade").value;
  const section = document.getElementById("section").value;
  const paymentStatus = document.getElementById("payment-status").value;
  const fromDate = document.getElementById("from-date").value;
  const toDate = document.getElementById("to-date").value;
  const financialYear = document.getElementById("financial-year").value;

  filteredStudents = sortStudentsByDate([...students]); // Start with sorted full list

  if (grade) {
    filteredStudents = filteredStudents.filter(
      (student) => student.grade === grade
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

  currentPage = 1;
  displayStudents();
}

// Pagination Buttons
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
document.getElementById("section").addEventListener("change", filterStudents);
document
  .getElementById("payment-status")
  .addEventListener("change", filterStudents);
document.getElementById("from-date").addEventListener("change", filterStudents);
document.getElementById("to-date").addEventListener("change", filterStudents);
document
  .getElementById("financial-year")
  .addEventListener("change", filterStudents);

// Clear Filters
document.getElementById("clear-filters").addEventListener("click", () => {
  document.getElementById("grade").value = "";
  document.getElementById("section").value = "";
  document.getElementById("payment-status").value = "";
  document.getElementById("from-date").value = "";
  document.getElementById("to-date").value = "";
  document.getElementById("financial-year").value = "";
  filterStudents();
});

// Open Payment Details Modal
function openModal(student) {
  const modal = document.getElementById("payment-details-modal");
  document.getElementById("modal-student-name").textContent = student.name;
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

// Close Payment Details Modal
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("payment-details-modal").style.display = "none";
});

// Initialize Flatpickr for date inputs
flatpickr("#from-date", { dateFormat: "d-m-Y" });
flatpickr("#to-date", { dateFormat: "d-m-Y" });

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");
  filteredStudents = sortStudentsByDate([...students]); // Sort on load
  displayStudents(); // Show latest 20 rows immediately
});
