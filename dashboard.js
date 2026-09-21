function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html";
}

function showSchedule() {
    alert("Full class schedule will be available soon.");
}

function openSection(section) {
    alert(
        section.charAt(0).toUpperCase() +
        section.slice(1) +
        " section opened."
    );
}