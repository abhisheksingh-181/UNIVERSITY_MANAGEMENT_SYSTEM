
/* 1. Update date and greeting */

const dateElement = document.querySelector(".eyebrow");
const heading = document.querySelector(".welcome h1");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
}).toUpperCase();

let greeting = "Good evening";

if (today.getHours() < 12) {
    greeting = "Good morning";
} else if (today.getHours() < 17) {
    greeting = "Good afternoon";
}

heading.innerHTML = `${greeting}, Abhishek <span>👋</span>`;


/* 2. Notification button */

function showNotification() {
    alert("You have checked your notifications!");
}


/* 3. View Schedule button */

function showSchedule() {
    document.querySelector(".schedule-card").scrollIntoView({
        behavior: "smooth"
    });
}


/* 4. Attendance Details button */

function showAttendance() {
    alert("Your current attendance is 82%.");
}


/* 5. View Exams button */

function showExams() {
    document.querySelector(".exam-list").scrollIntoView({
        behavior: "smooth"
    });
}


/* 6. Search functionality */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const items = document.querySelectorAll(
        ".class-item, .exam, .announcement, .stat-card"
    );

    items.forEach(function (item) {
        const itemText = item.textContent.toLowerCase();

        if (itemText.includes(searchText)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
});


/* 7. Logout button */

function logout() {
    const confirmLogout = confirm("Do you want to leave the dashboard?");

    if (confirmLogout) {
        alert("Logout demo completed. No actual account session was ended.");
    }
}
