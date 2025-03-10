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
    const totalFees = Math.floor(Math.random() * 5000) + 1000; // Random total fees between 1000 and 6000
    const lateFees = Math.floor(Math.random() * 500); // Random late fees between 0 and 500
    const paymentStatus = Math.random() > 0.5 ? "paid" : "due"; // Randomly assign "paid" or "due"
    const paymentDate = generateRandomDate(); // Random payment date in DD-MM-YYYY format

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

// Generate random date in DD-MM-YYYY format
function generateRandomDate() {
  const year = [2023, 2024, 2025][Math.floor(Math.random() * 3)];
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

// Pagination
let currentPage = 1;
const studentsPerPage = 20;
let filteredStudents = students;

function displayStudents() {
  const tableBody = document.querySelector("#student-fees-table tbody");
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

  // Add event listeners to "View Details" buttons
  document.querySelectorAll(".view-details").forEach((button, index) => {
    button.addEventListener("click", () => openModal(paginatedStudents[index]));
  });

  // Update pagination info
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

  filteredStudents = students;

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
    const startDate = new Date(`07-01-${startYear}`);
    const endDate = new Date(`06-30-${endYear}`);
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

// Apply Filters
document
  .getElementById("apply-filters")
  .addEventListener("click", filterStudents);

// Open Payment Details Modal
function openModal(student) {
  const modal = document.getElementById("payment-details-modal");
  const modalContent = modal.querySelector(".modal-content");

  // Populate modal with student data
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

  // Display modal
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
filterStudents();
