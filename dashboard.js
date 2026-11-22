
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


/* ===== PROFESSIONAL NOTIFICATION SYSTEM ===== */

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
        right: 25px;
        width: 320px;
        max-width: calc(100vw - 30px);
        background: white;
        border: 1px solid #e8eaf0;
        border-radius: 14px;
        padding: 18px;
        box-shadow: 0 15px 40px rgba(23,32,51,0.15);
        z-index: 9998;
        animation: notificationSlide 0.2s ease;
    `;

    const style = document.createElement("style");
    style.id = "notificationAnimation";
    style.textContent = `
        @keyframes notificationSlide {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    if (!document.getElementById("notificationAnimation")) {
        document.head.appendChild(style);
    }

    const header = document.createElement("div");
    header.style.cssText = `
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:15px;
    `;

    const title = document.createElement("h3");
    title.textContent = "Notifications";
    title.style.cssText =
        "font-size:16px;color:#172033;margin:0;";

    const close = document.createElement("button");
    close.textContent = "×";
    close.style.cssText = `
        border:none;
        background:#f1f2f8;
        border-radius:7px;
        width:28px;
        height:28px;
        cursor:pointer;
        font-size:18px;
    `;

    close.addEventListener("click", () => panel.remove());

    header.append(title, close);
    panel.appendChild(header);

    const notices = [
        {
            icon: "📚",
            title: "Mid-term Examinations",
            message: "Your upcoming examinations are approaching.",
            target: ".exam-list"
        },
        {
            icon: "💳",
            title: "Fee Reminder",
            message: "Please check your pending fee balance.",
            target: null
        },
        {
            icon: "📅",
            title: "Today's Classes",
            message: "Check your updated class schedule.",
            target: ".schedule-card"
        }
    ];

    notices.forEach((notice, index) => {
        const item = document.createElement("div");

        item.style.cssText = `
            display:flex;
            gap:12px;
            padding:13px 8px;
            border-top:1px solid #edf0f5;
            cursor:pointer;
            border-radius:8px;
        `;

        const icon = document.createElement("span");
        icon.textContent = notice.icon;
        icon.style.fontSize = "20px";

        const content = document.createElement("div");

        const heading = document.createElement("strong");
        heading.textContent = notice.title;
        heading.style.cssText =
            "display:block;font-size:12px;color:#172033;";

        const message = document.createElement("p");
        message.textContent = notice.message;
        message.style.cssText =
            "font-size:11px;color:#777f90;margin-top:5px;";

        content.append(heading, message);
        item.append(icon, content);

        item.addEventListener("mouseenter", () => {
            item.style.background = "#f7f8ff";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "transparent";
        });

        item.addEventListener("click", () => {
            panel.remove();

            if (notice.target) {
                const target = document.querySelector(notice.target);

                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            } else {
                showMessage("Your fee balance is ₹12.5K.");
            }
        });

        panel.appendChild(item);
    });

    document.body.appendChild(panel);

    setTimeout(() => {
        document.addEventListener("click", function outsideClick(event) {
            if (
                !panel.contains(event.target) &&
                !event.target.closest(".notification")
            ) {
                panel.remove();
                document.removeEventListener("click", outsideClick);
            }
        });
    }, 0);
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

/* ===== DARK MODE TOGGLE ===== */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("dashboardTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    function updateThemeIcon() {
        const isDark = document.body.classList.contains("dark-mode");

        themeToggle.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    updateThemeIcon();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "dashboardTheme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();
    });
}
