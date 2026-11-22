const UniFlowData = {
    subjects: [
        { name: "Data Structures", code: "CS204", attended: 44, total: 50, percent: 88 },
        { name: "Operating System", code: "CS208", attended: 35, total: 45, percent: 78 },
        { name: "Database Management", code: "CS205", attended: 41, total: 48, percent: 85 },
        { name: "Computer Networks", code: "CS206", attended: 32, total: 40, percent: 80 },
        { name: "Cloud Architecture", code: "CS207", attended: 27, total: 38, percent: 71 },
        { name: "Microprocessor", code: "CS209", attended: 35, total: 42, percent: 83 },
        { name: "Professional Skills", code: "HS204", attended: 27, total: 32, percent: 84 }
    ],
    students: [
        { id: "UMS2026CS001", name: "Abhishek Singh", initials: "AS", program: "B.Tech CSE", year: "2nd Year", attendance: 82, email: "abhishek@example.com", status: "Active", profile: "student-profile.html" },
        { id: "UMS2026CS014", name: "Riya Mehta", initials: "RM", program: "B.Tech CSE", year: "2nd Year", attendance: 91, email: "riya.mehta@uniflow.edu", status: "Active" },
        { id: "UMS2026CS022", name: "Kabir Joshi", initials: "KJ", program: "B.Tech CSE", year: "2nd Year", attendance: 74, email: "kabir.joshi@uniflow.edu", status: "Active" },
        { id: "UMS2026CS031", name: "Ananya Rao", initials: "AR", program: "B.Tech CSE", year: "3rd Year", attendance: 88, email: "ananya.rao@uniflow.edu", status: "Active" },
        { id: "UMS2026EC008", name: "Rohan Patel", initials: "RP", program: "B.Tech ECE", year: "2nd Year", attendance: 80, email: "rohan.patel@uniflow.edu", status: "Active" },
        { id: "UMS2026CS019", name: "Meera Iyer", initials: "MI", program: "B.Tech CSE", year: "1st Year", attendance: 95, email: "meera.iyer@uniflow.edu", status: "Active" }
    ],
    exams: [
        { subject: "Operating System", code: "CS208", date: "15 Oct 2026", time: "10:00 AM", room: "Room 201", type: "Mid Term", status: "upcoming" },
        { subject: "Database Management", code: "CS205", date: "18 Oct 2026", time: "02:00 PM", room: "Room 302", type: "Mid Term", status: "upcoming" },
        { subject: "Computer Networks", code: "CS206", date: "21 Oct 2026", time: "10:00 AM", room: "Lab 01", type: "Mid Term", status: "upcoming" },
        { subject: "Data Structures", code: "CS204", date: "25 Oct 2026", time: "11:00 AM", room: "Room 110", type: "Mid Term", status: "upcoming" },
        { subject: "Cloud Architecture", code: "CS207", date: "28 Oct 2026", time: "09:30 AM", room: "Lab 03", type: "Mid Term", status: "upcoming" },
        { subject: "Professional Skills", code: "HS204", date: "12 Sep 2026", time: "01:00 PM", room: "Seminar Hall", type: "Internal", status: "completed", score: "A" },
        { subject: "Microprocessor", code: "CS209", date: "08 Sep 2026", time: "10:00 AM", room: "Room 204", type: "Internal", status: "completed", score: "B+" }
    ],
    fees: [
        { name: "Tuition fee", term: "Semester IV", amount: 45000, status: "paid" },
        { name: "Hostel fee", term: "Semester IV", amount: 18000, status: "paid" },
        { name: "Examination fee", term: "Mid Term", amount: 3500, status: "pending" },
        { name: "Laboratory fee", term: "Semester IV", amount: 4000, status: "pending" },
        { name: "Library & digital access", term: "Annual", amount: 5000, status: "pending" }
    ]
};

function applySavedTheme() {
    if (localStorage.getItem("dashboardTheme") === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function logout(event) {
    if (event) {
        event.preventDefault();
    }

    const confirmLogout = confirm("Do you want to log out?");

    if (confirmLogout) {
        localStorage.removeItem("umsUser");
        window.location.href = "index.html";
    }
}

function formatRupees(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function attendanceLevel(percent) {
    if (percent >= 85) {
        return "good";
    }

    if (percent >= 75) {
        return "mid";
    }

    return "low";
}

function renderAttendanceRows(list) {
    if (!list) {
        return;
    }

    list.innerHTML = "";

    UniFlowData.subjects.forEach(function (subject) {
        const level = attendanceLevel(subject.percent);
        const item = document.createElement("article");
        item.className = "attendance-subject";
        item.innerHTML =
            '<div class="attendance-subject-top">' +
                "<div>" +
                    "<h3>" + subject.name + "</h3>" +
                    "<p>" + subject.code + " • " + subject.attended + "/" + subject.total + " classes</p>" +
                "</div>" +
                '<span class="attendance-subject-percent ' + level + '">' + subject.percent + "%</span>" +
            "</div>" +
            '<div class="attendance-bar ' + level + '">' +
                '<span style="width:' + subject.percent + '%"></span>' +
            "</div>";
        list.appendChild(item);
    });
}

function initStudentsPage() {
    const list = document.getElementById("studentList");
    const search = document.getElementById("moduleSearch");
    const detail = document.getElementById("studentDetail");

    if (!list || !detail) {
        return;
    }

    function showDetail(student) {
        const profileLink = student.profile
            ? '<a class="primary-btn" href="' + student.profile + '">Open full profile</a>'
            : "";

        detail.innerHTML =
            '<div class="card profile-preview">' +
                '<div class="profile-avatar">' + student.initials + "</div>" +
                "<h2>" + student.name + "</h2>" +
                "<p>" + student.program + " • " + student.year + "</p>" +
                '<span class="profile-status"><i class="fa-solid fa-circle"></i> ' + student.status + "</span>" +
                '<div class="info-grid compact-grid">' +
                    '<div class="info-item"><span>Student ID</span><strong>' + student.id + "</strong></div>" +
                    '<div class="info-item"><span>Email</span><strong>' + student.email + "</strong></div>" +
                    '<div class="info-item"><span>Attendance</span><strong>' + student.attendance + "%</strong></div>" +
                    '<div class="info-item"><span>Status</span><strong>' + student.status + "</strong></div>" +
                "</div>" +
                profileLink +
            "</div>";
    }

    function paint(filter) {
        const query = (filter || "").trim().toLowerCase();
        list.innerHTML = "";

        UniFlowData.students
            .filter(function (student) {
                return (
                    student.name.toLowerCase().includes(query) ||
                    student.id.toLowerCase().includes(query) ||
                    student.program.toLowerCase().includes(query)
                );
            })
            .forEach(function (student) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "student-row";
                button.innerHTML =
                    '<span class="mini-avatar">' + student.initials + "</span>" +
                    "<span><strong>" + student.name + "</strong><small>" + student.id + " • " + student.program + "</small></span>" +
                    '<span class="row-meta">' + student.attendance + "%</span>";
                button.addEventListener("click", function () {
                    list.querySelectorAll(".student-row").forEach(function (row) {
                        row.classList.remove("active");
                    });
                    button.classList.add("active");
                    showDetail(student);
                });
                list.appendChild(button);
            });

        const first = list.querySelector(".student-row");
        if (first) {
            first.click();
        } else {
            detail.innerHTML = '<div class="card"><p>No students match that search.</p></div>';
        }
    }

    if (search) {
        search.addEventListener("input", function () {
            paint(search.value);
        });
    }

    paint("");
}

function initExamsPage() {
    const list = document.getElementById("examModuleList");
    const tabs = document.querySelectorAll("[data-exam-filter]");
    const detail = document.getElementById("examDetail");

    if (!list) {
        return;
    }

    let filter = "upcoming";

    function showExam(exam) {
        if (!detail) {
            return;
        }

        detail.innerHTML =
            '<div class="card">' +
                "<h2>" + exam.subject + "</h2>" +
                '<p class="subtext">' + exam.code + " • " + exam.type + "</p>" +
                '<div class="info-grid compact-grid">' +
                    '<div class="info-item"><span>Date</span><strong>' + exam.date + "</strong></div>" +
                    '<div class="info-item"><span>Time</span><strong>' + exam.time + "</strong></div>" +
                    '<div class="info-item"><span>Venue</span><strong>' + exam.room + "</strong></div>" +
                    '<div class="info-item"><span>Status</span><strong>' + (exam.status === "completed" ? "Completed • Grade " + exam.score : "Scheduled") + "</strong></div>" +
                "</div>" +
            "</div>";
    }

    function paint() {
        list.innerHTML = "";
        UniFlowData.exams
            .filter(function (exam) {
                return exam.status === filter;
            })
            .forEach(function (exam) {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "exam-row";
                item.innerHTML =
                    '<span class="exam-date-block"><strong>' + exam.date.split(" ")[0] + "</strong><span>" + exam.date.split(" ")[1] + "</span></span>" +
                    "<span><strong>" + exam.subject + "</strong><small>" + exam.time + " • " + exam.room + "</small></span>" +
                    '<span class="exam-tag">' + exam.type + "</span>";
                item.addEventListener("click", function () {
                    list.querySelectorAll(".exam-row").forEach(function (row) {
                        row.classList.remove("active");
                    });
                    item.classList.add("active");
                    showExam(exam);
                });
                list.appendChild(item);
            });

        const first = list.querySelector(".exam-row");
        if (first) {
            first.click();
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            filter = tab.dataset.examFilter;
            tabs.forEach(function (button) {
                button.classList.toggle("active", button === tab);
            });
            paint();
        });
    });

    paint();
}

function initFeesPage() {
    const list = document.getElementById("feeList");
    const totalEl = document.getElementById("feePendingTotal");
    const payButton = document.getElementById("payFeesBtn");
    const statusEl = document.getElementById("feePayStatus");

    if (!list) {
        return;
    }

    function pendingTotal(items) {
        return items
            .filter(function (item) {
                return item.status === "pending";
            })
            .reduce(function (sum, item) {
                return sum + item.amount;
            }, 0);
    }

    function paint() {
        const paidAll = localStorage.getItem("umsFeesPaid") === "true";
        list.innerHTML = "";

        UniFlowData.fees.forEach(function (fee) {
            const status = paidAll ? "paid" : fee.status;
            const row = document.createElement("div");
            row.className = "fee-row";
            row.innerHTML =
                "<div><strong>" + fee.name + "</strong><small>" + fee.term + "</small></div>" +
                "<strong>" + formatRupees(fee.amount) + "</strong>" +
                '<span class="fee-status ' + status + '">' + (status === "paid" ? "Paid" : "Pending") + "</span>";
            list.appendChild(row);
        });

        const due = paidAll ? 0 : pendingTotal(UniFlowData.fees);
        if (totalEl) {
            totalEl.textContent = formatRupees(due);
        }
        if (payButton) {
            payButton.disabled = due === 0;
            payButton.textContent = due === 0 ? "All dues cleared" : "Pay pending fees";
        }
        if (statusEl) {
            statusEl.textContent = due === 0
                ? "No pending balance for this semester."
                : "Last date for fee submission is 10 October 2026.";
        }
    }

    if (payButton) {
        payButton.addEventListener("click", function () {
            localStorage.setItem("umsFeesPaid", "true");
            paint();
        });
    }

    paint();
}

function initSettingsPage() {
    const themeToggle = document.getElementById("settingsThemeToggle");
    const noticeToggle = document.getElementById("settingsNotices");
    const nameInput = document.getElementById("settingsName");
    const emailInput = document.getElementById("settingsEmail");
    const saveButton = document.getElementById("settingsSave");
    const statusEl = document.getElementById("settingsStatus");
    const saved = JSON.parse(localStorage.getItem("umsSettings") || "{}");
    const user = JSON.parse(localStorage.getItem("umsUser") || "null");

    if (nameInput) {
        nameInput.value = saved.name || (user && user.name) || "Abhishek Singh";
    }
    if (emailInput) {
        emailInput.value = saved.email || (user && user.email) || "abhishek@example.com";
    }
    if (noticeToggle) {
        noticeToggle.checked = saved.notices !== false;
    }
    if (themeToggle) {
        themeToggle.checked = localStorage.getItem("dashboardTheme") === "dark";
        themeToggle.addEventListener("change", function () {
            localStorage.setItem("dashboardTheme", themeToggle.checked ? "dark" : "light");
            applySavedTheme();
        });
    }
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            localStorage.setItem("umsSettings", JSON.stringify({
                name: nameInput ? nameInput.value.trim() : "",
                email: emailInput ? emailInput.value.trim() : "",
                notices: noticeToggle ? noticeToggle.checked : true
            }));
            if (statusEl) {
                statusEl.textContent = "Settings saved on this device.";
            }
        });
    }
}

function initModuleSearchRedirect() {
    const search = document.getElementById("moduleSearchInput");
    if (!search) {
        return;
    }

    search.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") {
            return;
        }

        const query = search.value.trim().toLowerCase();
        if (!query) {
            return;
        }

        if (query.includes("student")) {
            window.location.href = "students.html";
        } else if (query.includes("course")) {
            window.location.href = "courses.html";
        } else if (query.includes("attend")) {
            window.location.href = "attendance.html";
        } else if (query.includes("exam")) {
            window.location.href = "examinations.html";
        } else if (query.includes("fee")) {
            window.location.href = "fees.html";
        } else if (query.includes("setting")) {
            window.location.href = "settings.html";
        }
    });
}

applySavedTheme();

document.querySelectorAll(".logout-link").forEach(function (link) {
    link.addEventListener("click", logout);
});

const page = document.body.dataset.page;
if (page === "students") {
    initStudentsPage();
} else if (page === "attendance") {
    renderAttendanceRows(document.getElementById("attendancePageList"));
} else if (page === "exams") {
    initExamsPage();
} else if (page === "fees") {
    initFeesPage();
} else if (page === "settings") {
    initSettingsPage();
}

initModuleSearchRedirect();
