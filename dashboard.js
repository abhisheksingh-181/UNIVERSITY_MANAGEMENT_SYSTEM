function logout() {
    alert("You have been logged out successfully.");
    window.location.href = "index.html";
}

function showNotification() {
    alert("You have 3 new notifications.");
}

function showSchedule() {
    alert("Full class schedule will be available soon.");
}

function showAttendance() {
    alert("Attendance details will be available soon.");
}

function showExams() {
    alert("Full examination schedule will be available soon.");
}


// Search functionality
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    const classItems = document.querySelectorAll(".class-item");

    classItems.forEach(function (item) {

        const text = item.innerText.toLowerCase();

        if (text.includes(value)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }

    });

});