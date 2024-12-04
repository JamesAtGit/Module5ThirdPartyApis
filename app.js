
$(document).ready(function () {
  const taskBoard = {
    tasks: [],
    loadTasks: function () {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      savedTasks.forEach(task => {
        taskBoard.addTaskToBoard(task);
      });
    },
    saveTasks: function () {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    addTaskToBoard: function (task) {
      const taskElement = `<li data-id="${task.id}" class="${task.status}">
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <p>Deadline: ${dayjs(task.deadline).format('MMM D, YYYY')}</p>
        <button class="delete-btn">Delete</button>
      </li>`;
      
      const deadline = dayjs(task.deadline);
      const currentDate = dayjs();
      
      if (deadline.diff(currentDate, 'days') <= 2) {
        $(taskElement).addClass('yellow');
      } else if (deadline.isBefore(currentDate)) {
        $(taskElement).addClass('red');
      }

      $(`#${task.status}-tasks`).append(taskElement);
    },
    addNewTask: function (title, description, deadline) {
      const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        deadline: deadline,
        status: 'not-started'
      };
      this.tasks.push(newTask);
      this.saveTasks();
      this.addTaskToBoard(newTask);
    },
    deleteTask: function (taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.saveTasks();
      $(`li[data-id="${taskId}"]`).remove();
    },
    updateTaskStatus: function (taskId, newStatus) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        task.status = newStatus;
        this.saveTasks();
      }
    }
  };

  // Load tasks from localStorage
  taskBoard.loadTasks();

  // New Task Button
  $('#new-task-btn').click(function () {
    $('#task-modal').show();
  });

  // Close Modal Button
  $('#close-modal-btn').click(function () {
    $('#task-modal').hide();
  });

  // Save Task Button
  $('#save-task-btn').click(function () {
    const title = $('#task-title').val();
    const description = $('#task-description').val();
    const deadline = $('#task-deadline').val();

    if (title && description && deadline) {
      taskBoard.addNewTask(title, description, deadline);
      $('#task-modal').hide();
      $('#task-title').val('');
      $('#task-description').val('');
      $('#task-deadline').val('');
    }
  });

  // Task Deletion
  $(document).on('click', '.delete-btn', function () {
    const taskId = $(this).parent().data('id');
    taskBoard.deleteTask(taskId);
  });

  // Task Drag-and-Drop
  $('.task-column ul').sortable({
    connectWith: '.task-column ul',
    update: function (event, ui) {
      const taskId = ui.item.data('id');
      const newStatus = $(this).parent().attr('id');
      taskBoard.updateTaskStatus(taskId, newStatus);
    }
  });
});
