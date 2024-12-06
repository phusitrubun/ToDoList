
        // Multilingual Support
        const translations = {
            en: {
                pageTitle: 'Todo List',
                todoTitle: 'To Do',
                inProgressTitle: 'In Progress',
                doneTitle: 'Done',
                taskPlaceholder: 'Add new task',
                categoryPlaceholder: 'Category',
                addButton: 'Add',
                difficulties: {
                    easy: 'Easy',
                    medium: 'Medium',
                    hard: 'Hard'
                }
            },
            th: {
                pageTitle: 'รายการสิ่งที่ต้องทำ',
                todoTitle: 'งานที่ต้องทำ',
                inProgressTitle: 'งานที่กำลังทำ',
                doneTitle: 'งานที่ทำแล้ว',
                taskPlaceholder: 'เพิ่มงานใหม่',
                categoryPlaceholder: 'หมวดหมู่',
                addButton: 'เพิ่ม',
                difficulties: {
                    easy: 'ง่าย',
                    medium: 'ปานกลาง',
                    hard: 'ยาก'
                }
            }
        };

        const elements = {
            pageTitle: document.getElementById('page-title'),
            todoTitle: document.getElementById('todo-title'),
            inProgressTitle: document.getElementById('in-progress-title'),
            doneTitle: document.getElementById('done-title'),
            taskInput: document.getElementById('task-input'),
            categoryInput: document.getElementById('category-input'),
            addTaskButton: document.getElementById('add-task'),
            difficultyInput: document.getElementById('difficulty-input'),
            enLangButton: document.getElementById('lang-en'),
            thLangButton: document.getElementById('lang-th')
        };

        function changeLanguage(lang) {
            const t = translations[lang];
            
            elements.pageTitle.textContent = t.pageTitle;
            elements.todoTitle.textContent = t.todoTitle;
            elements.inProgressTitle.textContent = t.inProgressTitle;
            elements.doneTitle.textContent = t.doneTitle;
            elements.taskInput.placeholder = t.taskPlaceholder;
            elements.categoryInput.placeholder = t.categoryPlaceholder;
            elements.addTaskButton.textContent = t.addButton;

            // Update difficulty options
            elements.difficultyInput.innerHTML = `
                <option value="easy">${t.difficulties.easy}</option>
                <option value="medium">${t.difficulties.medium}</option>
                <option value="hard">${t.difficulties.hard}</option>
            `;

            // Update existing task difficulty tags
            document.querySelectorAll('.difficulty-tag').forEach(tag => {
                const difficulty = tag.closest('.task-item').dataset.difficulty;
                tag.textContent = t.difficulties[difficulty];
            });

            // Set active language button
            elements.enLangButton.classList.toggle('active', lang === 'en');
            elements.thLangButton.classList.toggle('active', lang === 'th');

            // Save language preference
            localStorage.setItem('appLanguage', lang);
        }

        // Language Toggle Event Listeners
        elements.enLangButton.addEventListener('click', () => changeLanguage('en'));
        elements.thLangButton.addEventListener('click', () => changeLanguage('th'));

        // Rest of the previous script remains the same...
        const taskInput = document.getElementById('task-input');
        const categoryInput = document.getElementById('category-input');
        const difficultyInput = document.getElementById('difficulty-input');
        const addTaskButton = document.getElementById('add-task');
        const todoList = document.getElementById('todo-list');
        const inProgressList = document.getElementById('in-progress-list');
        const doneList = document.getElementById('done-list');

        function saveTasksToLocalStorage() {
            const tasks = {
                todo: parseListTasks(todoList),
                inProgress: parseListTasks(inProgressList),
                done: parseListTasks(doneList)
            };
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function parseListTasks(list) {
            return Array.from(list.children).map(task => ({
                text: task.querySelector('.task-text').textContent,
                category: task.querySelector('.category-tag')?.textContent || '',
                difficulty: task.dataset.difficulty
            }));
        }

        function loadTasksFromLocalStorage() {
            const savedTasks = JSON.parse(localStorage.getItem('tasks') || '{"todo":[],"inProgress":[],"done":[]}');
            const savedLanguage = localStorage.getItem('appLanguage') || 'en';
            
            changeLanguage(savedLanguage);
            
            savedTasks.todo.forEach(task => createTaskElement(task.text, todoList, task.category, task.difficulty));
            savedTasks.inProgress.forEach(task => createTaskElement(task.text, inProgressList, task.category, task.difficulty));
            savedTasks.done.forEach(task => createTaskElement(task.text, doneList, task.category, task.difficulty, true));
        }

        function createTaskElement(taskText, targetList, category, difficulty, isDone = false) {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.difficulty = difficulty;
            if (isDone) taskItem.classList.add('done');

            const tagsContainer = document.createElement('div');
            tagsContainer.classList.add('tags');

            if (category) {
                const categoryTag = document.createElement('span');
                categoryTag.classList.add('category-tag');
                categoryTag.textContent = category;
                tagsContainer.appendChild(categoryTag);
            }

            const difficultyTag = document.createElement('span');
            difficultyTag.classList.add('difficulty-tag', `difficulty-${difficulty}`);
            difficultyTag.textContent = translations[localStorage.getItem('appLanguage') || 'en'].difficulties[difficulty];
            tagsContainer.appendChild(difficultyTag);

            const taskSpan = document.createElement('span');
            taskSpan.classList.add('task-text');
            taskSpan.textContent = taskText;

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '✖';

            deleteButton.addEventListener('click', () => {
                targetList.removeChild(taskItem);
                saveTasksToLocalStorage();
            });

            // [Previous code remains the same, I'll add the missing script code from the previous point]

            taskSpan.addEventListener('click', () => {
                if (targetList === todoList) {
                    todoList.removeChild(taskItem);
                    createTaskElement(taskText, inProgressList, category, difficulty);
                } else if (targetList === inProgressList) {
                    inProgressList.removeChild(taskItem);
                    createTaskElement(taskText, doneList, category, difficulty, true);
                } else {
                    doneList.removeChild(taskItem);
                    createTaskElement(taskText, todoList, category, difficulty, false);
                }
                saveTasksToLocalStorage();
            });

            taskItem.appendChild(tagsContainer);
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(deleteButton);
            targetList.appendChild(taskItem);
            saveTasksToLocalStorage();
        }

        function addTask() {
            const taskText = taskInput.value.trim();
            const category = categoryInput.value.trim();
            const difficulty = difficultyInput.value;

            if (taskText) {
                createTaskElement(taskText, todoList, category, difficulty);
                taskInput.value = '';
                categoryInput.value = '';
                difficultyInput.value = 'easy';
            }
        }

        // Allow adding task with Enter key
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        categoryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        addTaskButton.addEventListener('click', addTask);

        // Load tasks and set initial language
        loadTasksFromLocalStorage();