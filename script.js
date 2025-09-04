document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById("input-box");
    const dueDateInput = document.getElementById("due-date-input");
    const priorityInput = document.getElementById("priority-input");
    const listContainer = document.getElementById("list-container");
    const addBtn = document.getElementById("add-btn");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const filterBtns = document.querySelectorAll(".filter-btn");

    function createTaskElement(task) {
        let li = document.createElement("li");
        li.dataset.id = task.id;
        li.dataset.priority = task.priority;
        if (task.checked) {
            li.classList.add("checked");
        }

        li.innerHTML = `
            <div class="task-details">
                <span class="task-text">${task.text}</span>
                ${task.dueDate ? `<span class="due-date">Batas Waktu: ${task.dueDate}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        listContainer.appendChild(li);
    }

    function addTask() {
        if (inputBox.value.trim() === '') {
            alert("Kamu harus menuliskan sesuatu!");
            return;
        }

        const task = {
            id: Date.now(),
            text: inputBox.value,
            dueDate: dueDateInput.value,
            priority: priorityInput.value,
            checked: false
        };

        createTaskElement(task);
        
        inputBox.value = "";
        dueDateInput.value = "";
        priorityInput.value = "rendah";
        
        saveData();
    }

    addBtn.addEventListener("click", addTask);
    inputBox.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

    listContainer.addEventListener("click", function(e) {
        const li = e.target.closest("li");
        if (!li) return;

        
        if (e.target.classList.contains('task-text') || e.target.tagName === 'LI') {
            li.classList.toggle("checked");
            saveData();
        } 
        else if (e.target.classList.contains('delete-btn')) {
            li.remove();
            saveData();
        }
        
        else if (e.target.classList.contains('edit-btn')) {
            const taskTextSpan = li.querySelector('.task-text');
            const currentText = taskTextSpan.textContent;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            taskTextSpan.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                taskTextSpan.textContent = input.value;
                input.replaceWith(taskTextSpan);
                saveData();
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        }
    }, false);

    
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            const tasks = listContainer.querySelectorAll('li');

            tasks.forEach(task => {
                switch (filter) {
                    case 'selesai':
                        task.style.display = task.classList.contains('checked') ? 'flex' : 'none';
                        break;
                    case 'belum':
                        task.style.display = !task.classList.contains('checked') ? 'flex' : 'none';
                        break;
                    default: 
                        task.style.display = 'flex';
                        break;
                }
            });
        });
    });

    // Mode Gelap (Dark Mode)
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // Fungsi Simpan dan Muat Data
    function saveData() {
        const tasks = [];
        listContainer.querySelectorAll("li").forEach(li => {
            tasks.push({
                id: li.dataset.id,
                text: li.querySelector('.task-text').textContent,
                dueDate: li.querySelector('.due-date') ? li.querySelector('.due-date').textContent.replace('Jatuh tempo: ', '') : '',
                priority: li.dataset.priority,
                checked: li.classList.contains("checked")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadData() {
        
        const theme = localStorage.getItem("theme");
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        }

        
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            savedTasks.forEach(task => createTaskElement(task));
        }
    }

    
    loadData();
});