const user = JSON.parse(localStorage.getItem("umsUser") || "null");

if (!user) {
    window.location.href = "index.html";
} else {
    document.title = `UniPilot | ${user.role}`;
    document.querySelectorAll(".mini-avatar, .user .avatar").forEach((element) => element.textContent = user.initials);
    const profileName = document.querySelector(".user strong");
    const profileRole = document.querySelector(".user small");
    const sidebarName = document.querySelector(".sidebar-bottom strong");
    const sidebarRole = document.querySelector(".sidebar-bottom small");
    if (profileName) profileName.textContent = user.name;
    if (profileRole) profileRole.textContent = user.role;
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role;
    const welcome = document.querySelector(".welcome h1");
    if (welcome) welcome.innerHTML = `Good evening, ${user.name.split(" ")[0]} <span>👋</span>`;
}

function logout() {
    localStorage.removeItem("umsUser");
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
