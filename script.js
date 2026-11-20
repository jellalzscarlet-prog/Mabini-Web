
const indexToggle = document.getElementById("indexToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const pageContent = document.querySelector(".page-content");

const navLinks = document.querySelectorAll(".side-nav a");

function openSidebar() {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    pageContent.classList.add("sidebar-open");
    indexToggle.classList.add("sidebar-open");

    indexToggle.setAttribute("aria-expanded", "true");
    indexToggle.setAttribute("aria-label", "Close navigation menu");
    sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    pageContent.classList.remove("sidebar-open");
    indexToggle.classList.remove("sidebar-open");

    indexToggle.setAttribute("aria-expanded", "false");
    indexToggle.setAttribute("aria-label", "Open navigation menu");
    sidebar.setAttribute("aria-hidden", "true");
}

function toggleSidebar() {
    if (sidebar.classList.contains("active")) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// INDEX BUTTON
indexToggle.addEventListener("click", toggleSidebar);

// CLOSE WHEN OVERLAY IS CLICKED
sidebarOverlay.addEventListener("click", closeSidebar);

// CLOSE WHEN NAVIGATION LINK IS CLICKED
navLinks.forEach(link => {
    link.addEventListener("click", closeSidebar);
});

// CLOSE USING ESCAPE KEY
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});
const params = new URLSearchParams(window.location.search);
const group = params.get("group") || "Member List";

document.getElementById("groupTitle").textContent = group;
document.title = group + " | Mabini Officials";

const departmentTitle = document.getElementById("departmentTitle");
const tableBody = document.getElementById("memberTableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");

const storageKey = "mabini_members_" + group;

// Department names
const departments = {
    "Municipal Mayor": "Office of the Municipal Mayor",
    "Municipal Vice Mayor": "Office of the Municipal Vice Mayor",
    "Municipal Treasurer": "Municipal Treasurer's Office (MTO)",
    "Municipal Administrator": "Office of the Municipal Administrator"
};

departmentTitle.textContent = departments[group] || group;

// Load saved members
function loadMembers() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}

// Create row
function addRow(unit = "", position = "", name = "") {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input type="text" placeholder="Organizational Unit">
        </td>
        <td>
            <input type="text" placeholder="Position Title">
        </td>
        <td>
            <input type="text" placeholder="Last Name, First Name, Middle Name">
        </td>
    `;

    const inputs = row.querySelectorAll("input");

    inputs[0].value = unit;
    inputs[1].value = position;
    inputs[2].value = name;

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            saveStatus.textContent = "Unsaved changes...";
        });
    });

    tableBody.appendChild(row);
}

// Save members
function saveMembers() {
    const rows = [];

    tableBody.querySelectorAll("tr").forEach(row => {
        const inputs = row.querySelectorAll("input");

        rows.push({
            unit: inputs[0].value.trim(),
            position: inputs[1].value.trim(),
            name: inputs[2].value.trim()
        });
    });

    localStorage.setItem(storageKey, JSON.stringify(rows));
    saveStatus.textContent = "Saved successfully on this device.";
}

// Load saved data
const savedMembers = loadMembers();

if (savedMembers.length > 0) {
    savedMembers.forEach(member => {
        addRow(member.unit, member.position, member.name);
    });
} else {
    addRow();
}

// Add row button
addRowBtn.addEventListener("click", () => {
    addRow();
    saveStatus.textContent = "New row added.";
});

// Save button
saveBtn.addEventListener("click", saveMembers);

//New & Events Carousel

document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("newsCarousel");

    if (!carousel) return;

    const slides = Array.from(
        carousel.querySelectorAll(".news-slide")
    );

    const dots = Array.from(
        carousel.querySelectorAll(".news-dot")
    );

    const prevButton = document.getElementById("newsPrev");
    const nextButton = document.getElementById("newsNext");

    if (!slides.length || !prevButton || !nextButton) {
        console.error("News carousel elements are missing.");
        return;
    }

    let currentSlide = 0;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === currentSlide;

            slide.classList.toggle("active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });

        dots.forEach((dot, i) => {
            const active = i === currentSlide;

            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    prevButton.addEventListener("click", function () {
        showSlide(currentSlide - 1);
    });

    nextButton.addEventListener("click", function () {
        showSlide(currentSlide + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    showSlide(0);
});
