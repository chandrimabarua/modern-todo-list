

// ---------- Select Elements ----------

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

// ---------- Variables ----------

let tasks = JSON.parse(localStorage.getItem("royalTodoPro")) || [];

// ---------- Save Local Storage ----------

const saveTasks = () => {
  localStorage.setItem("royalTodoPro", JSON.stringify(tasks));
};

// ---------- Date & Time ----------

const getCurrentDateTime = () => {
  const now = new Date();

  return now.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// ---------- Add Task ----------

const addTask = () => {
  const text = taskInput.value.trim();

  if (text === "") return;

  const task = {
    id: Date.now(),

    title: text,

    completed: false,

    createdAt: getCurrentDateTime(),
  };

  tasks.unshift(task);

  saveTasks();

  taskInput.value = "";

  renderTasks();
};

// ---------- Delete Task ----------

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();

  renderTasks();
};

// ---------- Complete Task ----------

const toggleTask = (id) => {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,

        completed: !task.completed,
      };
    }

    return task;
  });

  saveTasks();

  renderTasks();
};

// ---------- Edit Task ----------

const editTask = (id) => {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  const updatedTitle = prompt("Edit Task", task.title);

  if (updatedTitle === null) return;

  if (updatedTitle.trim() === "") return;

  task.title = updatedTitle.trim();

  saveTasks();

  renderTasks();
};

// ---------- Dashboard ----------

const updateDashboard = () => {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.completed).length;

  const pending = total - completed;

  totalTasks.textContent = total;

  completedTasks.textContent = completed;

  pendingTasks.textContent = pending;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent = `${percent}%`;

  progressBar.style.width = `${percent}%`;
};

// ---------- Filter ----------

const getFilteredTasks = () => {
  const keyword = searchInput.value.toLowerCase().trim();

  const filter = filterSelect.value;

  let filtered = [...tasks];

  if (filter === "pending") {
    filtered = filtered.filter((task) => !task.completed);
  }

  if (filter === "completed") {
    filtered = filtered.filter((task) => task.completed);
  }

  if (keyword !== "") {
    filtered = filtered.filter((task) =>
      task.title.toLowerCase().includes(keyword),
    );
  }

  return filtered;
};



// ---------- Render Tasks ----------

const renderTasks = () => {

    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = "";

    updateDashboard();

    // Empty State
    if (filteredTasks.length === 0) {

        emptyState.classList.remove("hidden");
        taskList.classList.add("hidden");

        return;
    }

    emptyState.classList.add("hidden");
    taskList.classList.remove("hidden");

    // Create Cards
    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className =
            "glass border border-slate-700 rounded-2xl p-5 cardHover";

        card.innerHTML = `
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div class="flex items-start gap-4 flex-1">

                    <button
                        class="toggleBtn mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center
                        ${task.completed
                            ? "bg-green-500 border-green-500"
                            : "border-slate-500"}"
                        data-id="${task.id}"
                    >
                        ${task.completed ? "✓" : ""}
                    </button>

                    <div>

                        <h3 class="text-lg font-semibold break-all
                        ${task.completed
                            ? "line-through text-slate-500"
                            : "text-white"}">
                            ${task.title}
                        </h3>

                        <p class="text-sm text-slate-400 mt-2">
                            Created: ${task.createdAt}
                        </p>

                    </div>

                </div>

                <div class="flex gap-3">

                    <button
                        class="editBtn px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 duration-300"
                        data-id="${task.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="deleteBtn px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 duration-300"
                        data-id="${task.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

        taskList.appendChild(card);

    });

    // Complete Button
    document.querySelectorAll(".toggleBtn").forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            toggleTask(id);

        });

    });

    // Edit Button
    document.querySelectorAll(".editBtn").forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            editTask(id);

        });

    });

    // Delete Button
    document.querySelectorAll(".deleteBtn").forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            deleteTask(id);

        });

    });

};

// ---------- Events ----------

// Add Task Button
addTaskBtn.addEventListener("click", addTask);

// Press Enter
taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        addTask();

    }

});

// Live Search
searchInput.addEventListener("input", renderTasks);

// Filter
filterSelect.addEventListener("change", renderTasks);

// ---------- First Load ----------

renderTasks();
