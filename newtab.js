document.addEventListener('DOMContentLoaded', function() {
    let name = localStorage.getItem('name');
    let id = localStorage.getItem('id');

    if (!name) {
      let userInput = prompt("Please enter your name:");
      if (userInput != null) {
        userInput = userInput.toLowerCase();
      }
      localStorage.setItem('name', userInput);
      name = userInput;
    }

    if (!id) {
      let userInput = prompt("Please enter your hackatime username (hit cancel if you don't have one):");
      
      localStorage.setItem('id', userInput);
      id = userInput;
    }

    document.getElementById('display-input').textContent = name;
    console.log(id);

    if (id !== 'null' && id !== null) {
      
      fetch(`https://waka.hackclub.com/api/compat/wakatime/v1/users/${id}/stats/today`)
        .then(response => response.json())
        .then(data => {
          const codingTimeLink = document.getElementById('coding-time-link');
          if (codingTimeLink) {
            codingTimeLink.textContent = 'coding time today: ' + data.data.human_readable_total;
          }
          console.log(data.data.human_readable_total);
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
    function getTodayDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }

    function checkAndResetTodos() {
      const storedDate = localStorage.getItem('todoDate');
      const today = getTodayDate();

      if (storedDate !== today) {
        localStorage.setItem('todos', JSON.stringify([]));
        localStorage.setItem('todoDate', today);
        todos = [];
      } else {
        todos = JSON.parse(localStorage.getItem('todos')) || [];
      }
    }

    let todos = [];

    function renderTodos() {
      const todoList = document.getElementById('todo-list');
      todoList.innerHTML = '';
      
      const sortedTodos = todos.sort((a, b) => a.completed - b.completed);
      
      sortedTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '5px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.style.marginRight = '10px';
        checkbox.style.backgroundColor = '#ffffff';
        checkbox.onclick = () => {
          todos[index].completed = checkbox.checked;
          localStorage.setItem('todos', JSON.stringify(todos));
          renderTodos();
        };
        
        const span = document.createElement('span');
        span.textContent = todo.text;
        if (todo.completed) {
          span.style.textDecoration = 'line-through';
          span.style.color = '#888';
        }
        
        li.appendChild(checkbox);
        li.appendChild(span);
        todoList.appendChild(li);
      });
    }

    document.getElementById('add-todo').addEventListener('click', () => {
      const todoInput = document.getElementById('todo-input');
      const newTodoText = todoInput.value.trim();
      if (newTodoText) {
        todos.push({ text: newTodoText, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        renderTodos();
      }
    });

    document.addEventListener("DOMContentLoaded", function() {
      const codingContainer = document.getElementById('coding-time-container');

    });

    window.onload = () => {
      checkAndResetTodos();
      renderTodos();
    };
});