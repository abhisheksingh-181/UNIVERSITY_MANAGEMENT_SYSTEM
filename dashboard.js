
/* 1. Dynamic date, greeting and live clock */

const dateElement = document.querySelector(".eyebrow");
const heading = document.querySelector(".welcome h1");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
}).toUpperCase();

function updateGreeting() {
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

// Add a live clock below the welcome heading
const clock = document.createElement("p");
clock.style.cssText =
    "font-size:11px;color:#4f46e5;margin-top:8px;font-weight:600;";

document.querySelector(".welcome > div").appendChild(clock);

function updateClock() {
    clock.textContent = "Current time: " +
        new Date().toLocaleTimeString("en-IN");
}

updateClock();
setInterval(updateClock, 1000);


/* 2. Reusable message popup */

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


/* 3. Interactive notification dropdown */

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
    notice1.textContent = "📚 Mid-term examinations are approaching.";
    notice1.style.cssText =
        "font-size:12px;padding:10px 0;border-top:1px solid #e9ecf2;";

    const notice2 = document.createElement("p");
    notice2.textContent = "💳 Please check your pending fee balance.";
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


/* 4. Scroll to the class schedule */

function showSchedule() {
    document.querySelector(".schedule-card").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showMessage("Today's class schedule");
}


/* 5. Attendance details */

function showAttendance() {
    showMessage("Your current attendance is 82%.");
}


/* 6. Scroll to upcoming exams */

function showExams() {
    document.querySelector(".exam-list").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showMessage("Here are your upcoming examinations.");
}


/* 7. Improved search with result count */

const searchInput = document.getElementById("searchInput");

const searchableItems = document.querySelectorAll(
    ".class-item, .exam, .announcement, .stat-card"
);

const searchStatus = document.createElement("p");

searchStatus.style.cssText =
    "font-size:11px;color:#4f46e5;margin-top:6px;";

searchInput.parentElement.insertAdjacentElement(
    "afterend",
    searchStatus
);

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    searchableItems.forEach(function (item) {
        const itemText = item.textContent.toLowerCase();
        const matched = itemText.includes(searchText);

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
});


/* 8. Demo logout confirmation */

function logout() {
    const confirmLogout = confirm(
        "Do you want to leave the dashboard?"
    );

    if (confirmLogout) {
        showMessage("Demo only: no account was logged out.");
    }
}
