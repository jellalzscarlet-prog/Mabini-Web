
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
// OFFICIALS MEMBERS MODAL

const membersModal = document.getElementById("membersModal");
const modalTitle = document.getElementById("modalTitle");
const membersList = document.getElementById("membersList");
const memberInput = document.getElementById("memberInput");
const addMemberBtn = document.getElementById("addMemberBtn");
const modalClose = document.getElementById("modalClose");

let currentGroup = "";

// Load saved members
function getMembers() {
    return JSON.parse(localStorage.getItem("officialMembers")) || {};
}

// Save members
function saveMembers(data) {
    localStorage.setItem("officialMembers", JSON.stringify(data));
}

// Open modal
document.querySelectorAll(".member-card").forEach(card => {
    card.addEventListener("click", () => {
        currentGroup = card.dataset.group;
        modalTitle.textContent = currentGroup;

        membersModal.classList.add("active");
        renderMembers();
    });
});

// Display members
function renderMembers() {
    const data = getMembers();
    const members = data[currentGroup] || [];

    membersList.innerHTML = "";

    if (members.length === 0) {
        membersList.innerHTML = "<p>No members added yet.</p>";
    }

    members.forEach((name, index) => {
        const item = document.createElement("div");
        item.className = "member-item";

        const nameText = document.createElement("span");
        nameText.className = "member-name";
        nameText.textContent = name;

        const actions = document.createElement("div");
        actions.className = "member-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-member";
        editBtn.textContent = "Edit";

        editBtn.onclick = () => editMember(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-member";
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = () => deleteMember(index);

        actions.append(editBtn, deleteBtn);
        item.append(nameText, actions);
        membersList.appendChild(item);
    });
}

// Add member
addMemberBtn.addEventListener("click", () => {
    const name = memberInput.value.trim();

    if (!name) return;

    const data = getMembers();

    if (!data[currentGroup]) {
        data[currentGroup] = [];
    }

    data[currentGroup].push(name);

    saveMembers(data);
    memberInput.value = "";
    renderMembers();
});

// Edit member
function editMember(index) {
    const data = getMembers();
    const oldName = data[currentGroup][index];

    const newName = prompt("Edit member name:", oldName);

    if (newName === null || newName.trim() === "") return;

    data[currentGroup][index] = newName.trim();

    saveMembers(data);
    renderMembers();
}

// Delete member
function deleteMember(index) {
    if (!confirm("Delete this member?")) return;

    const data = getMembers();

    data[currentGroup].splice(index, 1);

    saveMembers(data);
    renderMembers();
}

// Close modal
modalClose.addEventListener("click", () => {
    membersModal.classList.remove("active");
});

membersModal.addEventListener("click", event => {
    if (event.target === membersModal) {
        membersModal.classList.remove("active");
    }
});

// Close with ESC
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        membersModal.classList.remove("active");
    }
});

const params = new URLSearchParams(window.location.search);
const group = params.get("group") || "Member List";

document.getElementById("groupTitle").textContent = group;
document.title = group + " | Mabini Officials";

const tableBody = document.getElementById("memberTableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");

const storageKey = "mabini_members_" + group;

function loadMembers() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function saveMembers() {
    const rows = [];

    tableBody.querySelectorAll("tr").forEach(row => {
        const inputs = row.querySelectorAll("input");

        rows.push({
            name: inputs[0].value,
            position: inputs[1].value,
            remarks: inputs[2].value
        });
    });

    localStorage.setItem(storageKey, JSON.stringify(rows));
    updateNumbers();

    saveStatus.textContent = "Saved successfully on this device.";
}

function updateNumbers() {
    tableBody.querySelectorAll("tr").forEach((row, index) => {
        row.querySelector(".row-number").textContent = index + 1;
    });
}

function addRow(name = "", position = "", remarks = "") {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="row-number"></td>
        <td><input type="text" placeholder="Enter name"></td>
        <td><input type="text" placeholder="Enter position"></td>
        <td><input type="text" placeholder="Enter remarks"></td>
        <td><button class="delete-row">Delete</button></td>
    `;

    const inputs = row.querySelectorAll("input");

    inputs[0].value = name;
    inputs[1].value = position;
    inputs[2].value = remarks;

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            saveStatus.textContent = "Unsaved changes...";
        });
    });

    row.querySelector(".delete-row").addEventListener("click", () => {
        row.remove();
        updateNumbers();
        saveMembers();
    });

    tableBody.appendChild(row);
    updateNumbers();
}

function saveMembers() {
    const rows = [];

    tableBody.querySelectorAll("tr").forEach(row => {
        const inputs = row.querySelectorAll("input");

        rows.push({
            name: inputs[0].value,
            position: inputs[1].value,
            remarks: inputs[2].value
        });
    });

    localStorage.setItem(storageKey, JSON.stringify(rows));
    saveStatus.textContent = "Saved successfully on this device.";
}

// Load saved data
const savedMembers = loadMembers();

if (savedMembers.length > 0) {
    savedMembers.forEach(member => {
        addRow(member.name, member.position, member.remarks);
    });
} else {
    // Start with 5 blank rows
    for (let i = 0; i < 5; i++) {
        addRow();
    }
}

// Add row button
addRowBtn.addEventListener("click", () => {
    addRow();
    saveStatus.textContent = "New row added.";
});

// Save button
saveBtn.addEventListener("click", saveMembers);
