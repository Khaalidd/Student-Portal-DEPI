// Grades javascript code
const gradesData = [
  { course: "Math", credits: 3, grade: 85, status: "pass", semester: 1 },
  { course: "Physics", credits: 4, grade: 72, status: "pass", semester: 1 },
  { course: "Chemistry", credits: 3, grade: 48, status: "fail", semester: 1 },

  { course: "Programming", credits: 4, grade: 91, status: "pass", semester: 2 },
  { course: "Databases", credits: 3, grade: 65, status: "pass", semester: 2 },
  { course: "Networks", credits: 3, grade: 55, status: "pending", semester: 2 },

  { course: "Software Engineering", credits: 3, grade: 88, status: "pass", semester: 3 },
  { course: "Operating Systems", credits: 4, grade: 74, status: "pass", semester: 3 },
  { course: "AI Basics", credits: 3, grade: 69, status: "pass", semester: 3 }
];

function getLetterGrade(grade) {
    if (grade >= 96) return "A+";
    else if (grade >= 92) return "A";
    else if (grade >= 88) return "A-";
    else if (grade >= 84) return "B+";
    else if (grade >= 80) return "B";
    else if (grade >= 76) return "B-";
    else if (grade >= 72) return "C+";
    else if (grade >= 68) return "C";
    else if (grade >= 64) return "C-"
    else if (grade >= 60) return "D+";
    else if (grade >= 55) return "D";
    else if (grade >= 50) return "D-";
    return "F";
}


function renderTable(data, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.course}</td>
            <td>${item.credits}</td>
            <td>${item.grade}</td>
            <td>${getLetterGrade(item.grade)}</td>
            <td class="${item.status}">${item.status}</td>
        `;

        tbody.appendChild(row);
    });
}

function calculateGPABySemester(data, semester) {
    const filtered = data.filter(c => c.semester === semester);

    let totalPoints = 0;
    let totalCredits = 0;

    filtered.forEach(item => {
        const gradePoint = item.grade / 25;
        totalPoints += gradePoint * item.credits;
        totalCredits += item.credits;
    });

    return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
}

function calculateGPA(data) {
    let totalPoints = 0;
    let totalCredits = 0;

    data.forEach(item => {
        const gradePoint = item.grade / 25;
        totalPoints += gradePoint * item.credits;
        totalCredits += item.credits;
    });

    return (totalPoints / totalCredits).toFixed(2);
}

function calculatePassedCredits(data) {
    return data
        .filter(course => course.status === "pass")
        .reduce((sum, course) => sum + course.credits, 0);
}

function filterBySemester(semester) {
    if (semester === "all") return gradesData;
    return gradesData.filter(g => g.semester == semester);
}

function toggleVisibility(id, data) {
    const card = document.getElementById(id).parentElement;
    card.style.display = data.length ? "block" : "none";
}

function sortData(data, field, order) {
    return [...data].sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (order === "asc") {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
}

function updateUI() {
    const semester = document.getElementById("semesterFilter").value;
    const sortField = document.getElementById("sortField").value;
    const sortOrder = document.getElementById("sortOrder").value;

    let filtered = filterBySemester(semester);

    let sorted = sortData(filtered, sortField, sortOrder);

    const sem1 = sorted.filter(g => g.semester === 1);
    const sem2 = sorted.filter(g => g.semester === 2);
    const sem3 = sorted.filter(g => g.semester === 3);

    renderTable(sem1, "sem1Body");
    renderTable(sem2, "sem2Body");
    renderTable(sem3, "sem3Body");

    toggleVisibility("sem1Body", sem1);
    toggleVisibility("sem2Body", sem2);
    toggleVisibility("sem3Body", sem3);

    document.getElementById("sem1Val").innerText =
    calculateGPABySemester(gradesData, 1);

document.getElementById("sem2Val").innerText =
    calculateGPABySemester(gradesData, 2);

    document.getElementById("sem3Val").innerText =
    calculateGPABySemester(gradesData, 3);

    document.getElementById("gpaValue").innerText =
    calculateGPA(gradesData);

document.getElementById("creditHr").innerText =
    calculatePassedCredits(gradesData);


}

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
     if (sidebar.classList.contains("open")) {
        menuToggle.textContent = "✖";
    } else {
        menuToggle.textContent = "☰";
    }
});

document.getElementById("semesterFilter").addEventListener("change", updateUI);
document.getElementById("sortBtn").addEventListener("click", updateUI);
updateUI();