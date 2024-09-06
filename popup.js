document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Load tasks from storage when the popup opens
    chrome.storage.sync.get('tasks', function(data) {
        if (data.tasks) {
            data.tasks.forEach(function(task) {
                addTaskToList(task);
            });
        }
    });

    // Add a new task when the form is submitted
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToList(taskText);
            saveTask(taskText);
            taskInput.value = ''; // Clear the input field after adding
        }
    });

    // Add task to the UI
    function addTaskToList(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Done';
        removeBtn.addEventListener('click', function() {
            removeTask(taskText);
            li.remove(); // Remove the task from the UI
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    // Save task to Chrome storage
    function saveTask(taskText) {
        chrome.storage.sync.get('tasks', function(data) {
            let tasks = data.tasks || [];
            tasks.push(taskText);
            chrome.storage.sync.set({ tasks });
        });
    }

    // Remove task from Chrome storage
    function removeTask(taskText) {
        chrome.storage.sync.get('tasks', function(data) {
            let tasks = data.tasks || [];
            tasks = tasks.filter(task => task !== taskText);
            chrome.storage.sync.set({ tasks });
        });
    }
});
