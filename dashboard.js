
/* ===== 1. DATE AND GREETING ===== */

const dateElement = document.querySelector(".eyebrow");
const heading = document.querySelector(".welcome h1");

const today = new Date();

if (dateElement) {
    dateElement.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).toUpperCase();
}

function updateGreeting() {
    if (!heading) return;

    const hour = new Date().getHours();
    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    }

    heading.innerHTML = `${greeting}, Abhishek <span>👋</span>`;
}

updateGreeting();


/* ===== 2. LIVE CLOCK ===== */

const welcomeSection = document.querySelector(".welcome > div");

const clock = document.createElement("p");

clock.style.cssText =
    "font-size:11px;color:#4f46e5;margin-top:8px;font-weight:600;";

if (welcomeSection) {
    welcomeSection.appendChild(clock);
}

function updateClock() {
    clock.textContent = "Current time: " +
        new Date().toLocaleTimeString("en-IN");
}

updateClock();
setInterval(updateClock, 1000);


/* ===== 3. REUSABLE MESSAGE POPUP ===== */

function showMessage(message) {
    let toast = document.getElementById("dashboardToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "dashboardToast";

        toast.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #172033;
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            font-size: 13px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 9999;
        `;

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(function () {
        toast.style.display = "none";
    }, 2500);
}


/* ===== 4. NOTIFICATION DROPDOWN ===== */

function showNotification() {
    let panel = document.getElementById("notificationPanel");

    if (panel) {
        panel.remove();
        return;
    }

    panel = document.createElement("div");
    panel.id = "notificationPanel";

    panel.style.cssText = `
        position: fixed;
        top: 85px;
        right: 35px;
        width: 290px;
        max-width: calc(100vw - 30px);
        background: white;
        padding: 20px;
        border: 1px solid #e9ecf2;
        border-radius: 12px;
        box-shadow: 0 10px 35px rgba(23,32,51,0.15);
        z-index: 9998;
    `;

    const title = document.createElement("h3");
    title.textContent = "Notifications";
    title.style.cssText =
        "font-size:15px;margin-bottom:12px;color:#172033;";

    const notice1 = document.createElement("p");
    notice1.textContent =
        "📚 Mid-term examinations are approaching.";
    notice1.style.cssText =
        "font-size:12px;padding:10px 0;border-top:1px solid #e9ecf2;";

    const notice2 = document.createElement("p");
    notice2.textContent =
        "💳 Please check your pending fee balance.";
    notice2.style.cssText =
        "font-size:12px;padding:10px 0;border-top:1px solid #e9ecf2;";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";

    closeButton.style.cssText = `
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 14px;
        cursor: pointer;
        margin-top: 8px;
    `;

    closeButton.addEventListener("click", function () {
        panel.remove();
    });

    panel.append(title, notice1, notice2, closeButton);
    document.body.appendChild(panel);
}


/* ===== 5. SCROLL TO SCHEDULE ===== */

function showSchedule() {
    const schedule = document.querySelector(".schedule-card");

    if (schedule) {
        schedule.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    showMessage("Today's class schedule");
}


/* ===== 6. ATTENDANCE DETAILS ===== */

function showAttendance() {
    showMessage("Your current attendance is 82%.");
}


/* ===== 7. SCROLL TO EXAMS ===== */

function showExams() {
    const exams = document.querySelector(".exam-list");

    if (exams) {
        exams.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    showMessage("Here are your upcoming examinations.");
}


/* ===== 8. IMPROVED DASHBOARD SEARCH ===== */

const searchInput = document.getElementById("searchInput");

const searchableItems = document.querySelectorAll(
    ".class-item, .exam, .announcement, .stat-card"
);

if (searchInput) {

    const searchStatus = document.createElement("p");

    searchStatus.style.cssText =
        "font-size:11px;color:#4f46e5;margin-top:6px;";

    searchStatus.setAttribute("aria-live", "polite");

    searchInput.parentElement.insertAdjacentElement(
        "afterend",
        searchStatus
    );

    function performSearch() {
        const searchText = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        searchableItems.forEach(function (item) {
            const matched = item.textContent
                .toLowerCase()
                .includes(searchText);

            item.style.display = matched ? "" : "none";

            if (matched) {
                visibleCount++;
            }
        });

        if (searchText === "") {
            searchStatus.textContent = "";
        } else if (visibleCount === 0) {
            searchStatus.textContent = "No matching results found.";
        } else {
            searchStatus.textContent =
                visibleCount + " matching item(s) found.";
        }
    }

    searchInput.addEventListener("input", performSearch);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            searchInput.value = "";
            performSearch();
            searchInput.blur();
        }
    });

    document.addEventListener("keydown", function (event) {
        const activeTag = document.activeElement.tagName;

        if (
            event.key === "/" &&
            !["INPUT", "TEXTAREA", "SELECT"].includes(activeTag) &&
            !document.activeElement.isContentEditable
        ) {
            event.preventDefault();
            searchInput.focus();
        }
    });
}


/* ===== 9. DEMO LOGOUT ===== */

function logout() {
    const confirmLogout = confirm(
        "Do you want to leave the dashboard?"
    );

    if (confirmLogout) {
        showMessage("Demo only: no account was logged out.");
    }
}
