document.addEventListener('DOMContentLoaded', () => {
  const addTaskButton = document.getElementById('add-task');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority');
  const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  const completedTasksSpan = document.getElementById('completed-tasks');
  const pendingTasksSpan = document.getElementById('pending-tasks');

  let completedTasksCount = 0;
  let pendingTasksCount = 0;

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
      actionCell.innerHTML = `<button class="edit-btn">✏️ Edit</button> <button class="complete-btn">✔️ Complete</button> <button class="delete-btn">❌ Delete</button>`;

      // Event listener for Edit Button
      const editButton = actionCell.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editTask(editButton, taskCell));

      // Event listener for Delete Button
      const deleteButton = actionCell.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => deleteTask(row));

      // Event listener for Complete Button
      const completeButton = actionCell.querySelector('.complete-btn');
      completeButton.addEventListener('click', () => toggleCompleteTask(row));

      // Increment the pending task count
      pendingTasksCount++;
      updateTaskCounts();

      taskInput.value = '';
    }
  });

  // Function to get the priority text based on value
  function getPriorityText(priority) {
    switch (priority) {
      case '1': return '🔥High';
      case '2': return '⚡Medium';
      case '3': return '🌱Low';
      default: return '⚪Normal';
    }
  }

  // Edit Task function
  function editTask(editButton, taskCell) {
    if (editButton.textContent === "✏️ Edit") {
      taskCell.contentEditable = true;
      taskCell.focus();
      editButton.textContent = "💾 Save"; // Change to Save button
    } else if (editButton.textContent === "💾 Save") {
      taskCell.contentEditable = false; // Save the changes
      editButton.textContent = "✏️ Edit"; // Change back to Edit button
    }
  }

  // Delete Task function
  function deleteTask(row) {
    const taskStatus = row.classList.contains('completed');

    // If it's completed, decrease the completed task count
    if (taskStatus) {
      completedTasksCount--;
    } else {
      pendingTasksCount--;
    }

    row.remove();
    updateTaskCounts();
  }

  // Toggle task as completed
  function toggleCompleteTask(row) {
    const isCompleted = row.classList.contains('completed');

    // Toggle the completed class
    row.classList.toggle('completed');

    // Update counts based on the task status
    if (isCompleted) {
      completedTasksCount--;
      pendingTasksCount++;
    } else {
      completedTasksCount++;
      pendingTasksCount--;
    }

    // Update the displayed counts
    updateTaskCounts();
  }

  // Update the displayed task counts
  function updateTaskCounts() {
    completedTasksSpan.textContent = completedTasksCount;
    pendingTasksSpan.textContent = pendingTasksCount;
  }
  // Dark Mode Toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); // Toggle dark mode
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙'; // Update button text
  });

});













