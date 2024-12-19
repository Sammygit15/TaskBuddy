document.addEventListener('DOMContentLoaded', () => {
  const addTaskButton = document.getElementById('add-task');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority');
  const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  const completedTasksSpan = document.getElementById('completed-tasks');
  const pendingTasksSpan = document.getElementById('pending-tasks');

  let completedTasksCount = 0;
  let pendingTasksCount = 0;

  // Load tasks from localStorage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      const row = taskTable.insertRow();
      const taskCell = row.insertCell(0);
      const priorityCell = row.insertCell(1);
      const actionCell = row.insertCell(2);

      taskCell.textContent = task.taskName;
      priorityCell.textContent = task.priority;
      actionCell.innerHTML = `<button class="edit-btn">✏️ Edit</button> <button class="complete-btn">✔️ Complete</button> <button class="delete-btn">✖️ Delete</button> <button class="due-btn">⏰ Due Date</button>`;

      if (task.isCompleted) {
        row.classList.add('completed');
        completedTasksCount++;
      } else {
        pendingTasksCount++;
      }
      if (task.dueDate) {
        const dueDateCell = row.insertCell(3);
        dueDateCell.textContent = `Due: ${task.dueDate}`;
      }

      // Attach event listeners to buttons
      const editButton = actionCell.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editTask(editButton, taskCell));
      const deleteButton = actionCell.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => {
        deleteTask(row);
        saveTasksToLocalStorage();
      });
      const dueButton = actionCell.querySelector('.due-btn');
      dueButton.addEventListener('click', () => {
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.classList.add('due-date-input');
        actionCell.appendChild(dateInput);

        // Handle when a date is selected
        dateInput.addEventListener('change', () => {
          const dueDate = dateInput.value;
          if (dueDate) {
            const dueDateCell = row.insertCell(3);
            dueDateCell.textContent = `Due: ${dueDate}`;
            row.dataset.dueDate = dueDate;
            actionCell.removeChild(dateInput);
            saveTasksToLocalStorage();
          }
        });
      });

      const completeButton = actionCell.querySelector('.complete-btn');
      completeButton.addEventListener('click', () => {
        toggleCompleteTask(row);
        saveTasksToLocalStorage();
      });
    });
    updateTaskCounts();
  }

  // Save tasks to localStorage
  function saveTasksToLocalStorage() {
    const tasks = [];
    Array.from(taskTable.rows).forEach(row => {
      const taskName = row.cells[0].textContent;
      const priority = row.cells[1].textContent;
      const isCompleted = row.classList.contains('completed');
      const dueDate = row.dataset.dueDate || '';
      tasks.push({ taskName, priority, isCompleted, dueDate });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Add Task functionality
  addTaskButton.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (taskName) {
      const row = taskTable.insertRow();
      const taskCell = row.insertCell(0);
      const priorityCell = row.insertCell(1);
      const actionCell = row.insertCell(2);

      taskCell.textContent = taskName;
      priorityCell.textContent = getPriorityText(priority);
      actionCell.innerHTML = `<button class="edit-btn">✏️ Edit</button> <button class="complete-btn">✔️ Complete</button> <button class="delete-btn">✖️ Delete</button> <button class="due-btn">⏰ Due Date</button>`;

      // Attach event listeners to buttons
      const editButton = actionCell.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editTask(editButton, taskCell));
      const deleteButton = actionCell.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => {
        deleteTask(row);
        saveTasksToLocalStorage();
      });
      const completeButton = actionCell.querySelector('.complete-btn');
      completeButton.addEventListener('click', () => {
        toggleCompleteTask(row);
        saveTasksToLocalStorage();
      });
      const dueButton = actionCell.querySelector('.due-btn');
      dueButton.addEventListener('click', () => {
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.classList.add('due-date-input');
        actionCell.appendChild(dateInput);

        // Handle date selection
        dateInput.addEventListener('change', () => {
          const dueDate = dateInput.value;
          if (dueDate) {
            const dueDateCell = row.insertCell(3);
            dueDateCell.textContent = `Due: ${dueDate}`;
            row.dataset.dueDate = dueDate;
            actionCell.removeChild(dateInput);
            saveTasksToLocalStorage();
          }
        });
      });

      pendingTasksCount++;
      updateTaskCounts();
      saveTasksToLocalStorage();
      taskInput.value = '';
    }
  });

  const addButton = document.getElementById('add-task');
  const taskCompletedSound = document.getElementById('task-sound');

  addButton.addEventListener('click', function () {

    taskCompletedSound.play();
  });



  // Get Priority Text
  function getPriorityText(priority) {
    switch (priority) {
      case '1': return '🔥High';
      case '2': return '💪Medium';
      case '3': return '🍿Low';
      default: return '⚪Normal';
    }
  }

  // Edit Task
  function editTask(editButton, taskCell) {
    if (editButton.textContent === "✏️ Edit") {
      taskCell.contentEditable = true;
      taskCell.focus();
      editButton.textContent = "💾 Save";
    } else if (editButton.textContent === "💾 Save") {
      taskCell.contentEditable = false;
      editButton.textContent = "✏️ Edit";
      saveTasksToLocalStorage();
    }
  }

  // Delete Task
  function deleteTask(row) {
    if (row.classList.contains('completed')) {
      completedTasksCount--;
    } else {
      pendingTasksCount--;
    }
    row.remove();
    updateTaskCounts();
    saveTasksToLocalStorage();
  }

  // Toggle Complete Task
  function toggleCompleteTask(row) {
    const isCompleted = row.classList.contains('completed');
    row.classList.toggle('completed');

    if (isCompleted) {
      completedTasksCount--;
      pendingTasksCount++;
    } else {
      completedTasksCount++;
      pendingTasksCount--;
    }

    updateTaskCounts();
    saveTasksToLocalStorage();
  }

  // Update Task Counts
  function updateTaskCounts() {
    completedTasksSpan.textContent = completedTasksCount;
    pendingTasksSpan.textContent = pendingTasksCount;
  }

  loadTasksFromLocalStorage();
});

const themeToggle = document.getElementById('theme-toggle');

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === 'dark-mode' ? '☀️' : '🔆';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');

    themeToggle.textContent = isDarkMode ? '☀️' : '🔆';
    localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
  });
});
// Function to toggle task completion
function toggleCompleteTask(row) {
  const isCompleted = row.classList.contains('completed');
  row.classList.toggle('completed');

  if (isCompleted) {
    completedTasksCount--;
    pendingTasksCount++;
  } else {
    completedTasksCount++;
    pendingTasksCount--;

    // Play task completion sound
    const taskCompletedSound = document.getElementById('task-completed-sound');
    taskCompletedSound.play();
  }

  updateTaskCounts();
  saveTasksToLocalStorage();
}

function toggleCompleteTask(row) {
  const isCompleted = row.classList.contains('completed');
  row.classList.toggle('completed');

  if (isCompleted) {
    completedTasksCount--;
    pendingTasksCount++;
  } else {
    completedTasksCount++;
    pendingTasksCount--;
  }

  updateTaskCounts();
  saveTasksToLocalStorage();
  checkAllTasksCompleted();  // Check if all tasks are completed
}
