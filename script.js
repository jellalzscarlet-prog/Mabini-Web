
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

// NEWS CAROUSEL
(function () {
    'use strict';

    const AUTOPLAY_MS = 6000;

    const carousel = document.getElementById('newsCarousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.news-slide'));
    const prevBtn = document.getElementById('newsPrev');
    const nextBtn = document.getElementById('newsNext');
    const dotsWrap = document.getElementById('newsDots');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    let timer = null;

    // Build dots
    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'news-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const on = i === current;
            slide.classList.toggle('active', on);
            slide.setAttribute('aria-hidden', on ? 'false' : 'true');
            // keep hidden slides out of the tab order
            slide.querySelectorAll('.news-scroll-content').forEach(el => {
                el.tabIndex = on ? 0 : -1;
            });
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
    }

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
        clearInterval(timer);
        timer = null;
    }
    function restart() { stop(); start(); }

    // Buttons
    nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });

    // Keyboard (when the carousel has focus)
    carousel.addEventListener('keydown', e => {
        if (e.target.closest('.news-scroll-content')) return; // let the list scroll
        if (e.key === 'ArrowRight') { next(); restart(); }
        if (e.key === 'ArrowLeft')  { prev(); restart(); }
    });

    // Pause while hovering, focused, or reading the applicant list
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Pause when the tab is hidden
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    // Touch swipe
    let startX = 0, startY = 0;
    carousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        stop();
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? next() : prev();
        }
        start();
    }, { passive: true });

    goTo(current);
    start();
})();
