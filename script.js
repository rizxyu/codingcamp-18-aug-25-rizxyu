document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const tableBody = document.querySelector('tbody');
    const filterButton = document.getElementById('filter-button');
    const filterDropdown = document.getElementById('filter-dropdown');

    const deleteAllButton = document.getElementById('delete-all-button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = (filter = 'all') => {
        tableBody.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (filter === 'selesai') return todo.completed;
            if (filter === 'belum-selesai') return !todo.completed;
            return true;
        });

        filteredTodos.forEach((todo, index) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700';
            row.innerHTML = `
                <td class="px-4 py-2">${todo.task}</td>
                <td class="px-4 py-2">${todo.dueDate}</td>
                <td class="px-4 py-2">${todo.completed ? 'Selesai' : 'Belum Selesai'}</td>
                <td class="px-4 py-2">
                    <button class="text-green-500 hover:text-green-400" data-index="${index}" data-action="toggle">${todo.completed ? '<i class="ri-arrow-go-back-line"></i>' : '<i class="ri-check-line"></i>'}</button>
                    <button class="text-red-500 hover:text-red-400 ml-2" data-index="${index}" data-action="delete"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskInput = form.querySelector('input[type="text"]');
        const dateInput = form.querySelector('input[type="date"]');

        const newTodo = {
            task: taskInput.value,
            dueDate: dateInput.value,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        form.reset();
    });

    tableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const index = parseInt(target.dataset.index);

        if (action === 'toggle') {
            todos[index].completed = !todos[index].completed;
        }

        if (action === 'delete') {
            todos.splice(index, 1);
        }

        saveTodos();
        renderTodos();
    });

    filterButton.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
    });

    filterDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const filter = e.target.textContent.toLowerCase().replace(' ', '-');
            renderTodos(filter);
            filterDropdown.classList.add('hidden');
        }
    });

    window.addEventListener('click', (event) => {
        if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdown.classList.add('hidden');
        }
    });

    deleteAllButton.addEventListener('click', () => {
        todos = [];
        saveTodos();
        renderTodos();
    });

    renderTodos();
});