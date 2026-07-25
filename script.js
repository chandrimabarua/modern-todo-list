const inputBox = document.getElementById("inputBox");
const addTask = document.getElementById("addTask");
const listContainer = document.getElementById("ListContainer");

// Add Task
function addTodo() {
  const task = inputBox.value.trim();

  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  // Create List Item
  const li = document.createElement("li");
  li.className = `
        group
        flex
        items-center
        justify-between
        bg-[#182231]
        border
        border-white/10
        rounded-2xl
        p-4
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-lg
        hover:shadow-cyan-500/20
    `;

  // Left Side
  const left = document.createElement("div");
  left.className = "flex items-center gap-4 flex-1";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = `
        w-6
        h-6
        accent-cyan-400
        cursor-pointer
    `;

  // Task Text
  const span = document.createElement("span");
  span.textContent = task;
  span.className = `
        text-white
        text-lg
        transition-all
        duration-300
        break-all
    `;

  // Complete Task
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      span.classList.add("line-through", "text-gray-500");
    } else {
      span.classList.remove("line-through", "text-gray-500");
    }

    saveData();
  });

  left.appendChild(checkbox);
  left.appendChild(span);

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";

  deleteBtn.className = `
        w-11
        h-11
        rounded-xl
        bg-red-500/20
        hover:bg-red-500
        text-red-400
        hover:text-white
        transition-all
        duration-300
        cursor-pointer
    `;

  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveData();
  });

  li.appendChild(left);
  li.appendChild(deleteBtn);

  listContainer.appendChild(li);

  inputBox.value = "";
  inputBox.focus();

  saveData();
}

// Button Click
addTask.addEventListener("click", addTodo);

// Enter Key
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Save
function saveData() {
  localStorage.setItem("todoData", listContainer.innerHTML);
}

// Load
function showTask() {
  listContainer.innerHTML = localStorage.getItem("todoData") || "";

  // Reattach Events
  document.querySelectorAll("#ListContainer li").forEach((li) => {
    const checkbox = li.querySelector("input");
    const span = li.querySelector("span");
    const deleteBtn = li.querySelector("button");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        span.classList.add("line-through", "text-gray-500");
      } else {
        span.classList.remove("line-through", "text-gray-500");
      }

      saveData();
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveData();
    });
  });
}

showTask();
