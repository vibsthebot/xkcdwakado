document.addEventListener('DOMContentLoaded', function() {
    let name = localStorage.getItem('name');
    let id = localStorage.getItem('id');
    let apiUrl = localStorage.getItem('apiUrl');

    document.getElementById('display-input').textContent = name;
    console.log(id);

    if (id !== 'null' && id !== null && apiUrl !== '') {
      let apiKey = localStorage.getItem('id');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      
      fetch(`${apiUrl}/users/${id}/statusbar/today`, {
        method: 'GET',
        headers: headers
      })
        .then(response => response.json())
        .then(data => {
          const codingTimeLink = document.getElementById('coding-time-link');
          if (codingTimeLink) {
            codingTimeLink.textContent = data.data.grand_total.text;
            codingTimeLink.href = new URL(apiUrl).origin;
          }
          console.log(data);
        })
        .catch(error => {
          console.log('Error fetching the data:', error);
        });
    }

    if (id == null) {
      const codingTimeLink = document.getElementById('coding-time-link');
      if (codingTimeLink) {
        codingTimeLink.textContent = '';
      }
    }
    function loadTodos() {
      todos = JSON.parse(localStorage.getItem('todos')) || [];
    }

    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }

    function formatDate(dateString) {
      if (!dateString) return '';
      
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    }

    let todos = [];

    fetch('https://xkcd-api-ridvanaltun.vercel.app/api/comics/latest')
      .then(response => response.json())
      .then(data => {
        const comicImage = document.getElementById('comic');
        const comicTitle = document.getElementById('comic-title');
        const comicAlt = document.getElementById('comic-alt');

        comicImage.src = data.img;
        comicTitle.textContent = data.title;
        comicAlt.textContent = data.alt;
      });

    function renderTodos() {
      const todoList = document.getElementById('todo-list');
      todoList.innerHTML = '';
      
      const sortedTodos = todos.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed - b.completed;
        }
        
        if (a.date && b.date) {
          const [yearA, monthA, dayA] = a.date.split('-').map(Number);
          const [yearB, monthB, dayB] = b.date.split('-').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA - dateB;
        } else if (a.date && !b.date) {
          return -1;
        } else if (!a.date && b.date) {
          return 1; 
        }
        
        return 0;
      });
      
      sortedTodos.forEach((todo, originalIndex) => {
        const li = document.createElement('li');
        li.className = 'newtab-li' + (todo.completed ? ' completed' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => {
          const todoIndex = todos.findIndex(t => 
            t.text === todo.text && 
            t.date === todo.date && 
            t.completed === todo.completed
          );
          if (todoIndex !== -1) {
            todos[todoIndex].completed = checkbox.checked;
            saveTodos();
            renderTodos();
          }
        };
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        if (todo.date) {
          dateSpan.textContent = formatDate(todo.date);
        }
        
        const removeButton = document.createElement('button');
        removeButton.className = 'todo-remove';
        removeButton.innerHTML = 'x';
        removeButton.title = 'Remove task';
        removeButton.onclick = (e) => {
          e.stopPropagation();
          const todoIndex = todos.findIndex(t => t.id === todo.id);
          if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            saveTodos();
            renderTodos();
          }
        };
        dateSpan.onclick = (e) => {
          e.stopPropagation();
          
          const dateInput = document.createElement('input');
          dateInput.type = 'date';
          dateInput.value = todo.date || '';
          dateInput.style.position = 'absolute';
          dateInput.style.opacity = '0';
          dateInput.style.pointerEvents = 'none';
          
          document.body.appendChild(dateInput);
          
          dateInput.onchange = () => {
            const todoIndex = todos.findIndex(t => t.id === todo.id);
            if (todoIndex !== -1) {
              todos[todoIndex].date = dateInput.value || null;
              saveTodos();
              renderTodos();
            }
            document.body.removeChild(dateInput);
          };
          
          dateInput.onblur = () => {
            if (document.body.contains(dateInput)) {
              document.body.removeChild(dateInput);
            }
          };
          
          dateInput.click();
        };
        
        contentDiv.appendChild(textSpan);
        if (todo.date) {
          contentDiv.appendChild(dateSpan);
        }
        
        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(removeButton);
        todoList.appendChild(li);
      });
    }

    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const currentTimeElement = document.getElementById('current-time');
      const currentDateElement = document.getElementById('current-date');
      
      if (currentTimeElement) {
        currentTimeElement.textContent = timeString;
      }
      
      if (currentDateElement) {
        currentDateElement.textContent = dateString;
      }
    }

    document.getElementById('add-todo').addEventListener('click', () => {
      const todoInput = document.getElementById('todo-input');
      const todoDateInput = document.getElementById('todo-date');
      const newTodoText = todoInput.value.trim();
      
      if (newTodoText) {
        const newTodo = {
          text: newTodoText,
          completed: false,
          date: todoDateInput.value || null,
          id: Date.now() 
        };
        
        todos.push(newTodo);
        saveTodos();
        todoInput.value = '';
        todoDateInput.value = '';
        renderTodos();
      }
    });

    document.getElementById('todo-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('add-todo').click();
      }
    });

    window.onload = () => {
      loadTodos();
      renderTodos();
      updateClock();
      setInterval(updateClock, 1000);
    };
});