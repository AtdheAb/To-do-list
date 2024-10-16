class Todo {
    constructor(id, title, description, dueDate, priority, checked) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = checked;
    }
    markAsComplete() {
        this.checked = !this.checked;
    }
}

let todoListOfObjects = JSON.parse(localStorage.getItem('todoListOfObjects')) || [];
let id = todoListOfObjects.length > 0 ? Math.max(...todoListOfObjects.map(todo => todo.id)) + 1 : 0;


const inputBox = document.getElementById("input-box");
const descriptionBox = document.getElementById("description-box-text-area");
const priorityBox = document.getElementById("priority-box");
const dueDateBox = document.getElementById("due-date-box");
const listContainer = document.getElementById("list-container");
const message = document.getElementById("message");


const checkTodo = (todoid) => {

    var todo = todoListOfObjects.find(todo => todo.id === todoid);

    if (todo) {
        todo.checked = !todo.checked;  // Toggle the checked state

        // Get the corresponding li element by ID or a custom data attribute
        const todoElement = document.querySelector(`#todo-${todoid}`);
        
        if (todo.checked) {
            todoElement.classList.add('checked');  // Add checked class if true
        } else {
            todoElement.classList.remove('checked');  // Remove checked class if false
        }

        saveData();  // Save the updated state
    }
}
const openModal = (id) => {
    const todo = todoListOfObjects.find(todo => todo.id === id);
    if (todo) {
        document.getElementById('modal-title').value = todo.title;
        document.getElementById('modal-description').value = todo.description;
        document.getElementById('modal-due-date').value = todo.dueDate;
        document.getElementById('modal-priority').value = todo.priority;
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('modal-todo-id').value = id;

        modal.style.display = "block";
    }
}



// Function to save the changes
function saveChanges() {
    const title = document.getElementById('modal-title').value;
    const description = document.getElementById('modal-description').value;
    const dueDate = document.getElementById('modal-due-date').value;
    const priority = document.getElementById('modal-priority').value;
    const todoid =document.getElementById('modal-todo-id').value

    var todo = todoListOfObjects.find(todo => todo.id === parseInt(todoid));

    if (todo) {
        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;


    }
    saveData();  // Save the updated state

    document.getElementById('myModal').style.display = 'none';
    showTask()
}

// Event listener for the close button
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'none';
});


const removetodo = (id) => {

    // Filter out the todo with the specified ID
    todoListOfObjects = todoListOfObjects.filter(todo => todo.id !== id);

    // Save the updated list back to localStorage
    saveData();

    // Optionally, you can also remove the corresponding list item from the UI
    const listItem = Array.from(listContainer.children).find(li => li.querySelector('button').onclick.toString().includes(`checkTodo(${id})`));
    if (listItem) {
        listContainer.removeChild(listItem);
    }
}


function createLiElement(todoObject) {
    let li = document.createElement("li");

    // Assign a unique ID to each li element for reference
    li.id = `todo-${todoObject.id}`;

    // Apply 'checked' class if the task is already checked
    if (todoObject.checked) {
        li.className = 'checked';
    }

    // Create inner HTML with buttons
    li.innerHTML = `
        <button onclick="checkTodo(${todoObject.id})">done</button>
        <button onclick="openModal(${todoObject.id})"><strong>${todoObject.title}</strong> - ${todoObject.description} - Priority: ${todoObject.priority} - Due: ${todoObject.dueDate}</button>
        <button onclick="removetodo(${todoObject.id})">delete</button>
    `;

    // Append the li element to the list container
    listContainer.appendChild(li);

    return li;
}
function addTask() {

    if (inputBox.value === '' || descriptionBox.value === '' || dueDateBox.value === '') {
        message.innerHTML = 'All fields must be filled out!';
        return;
    }
    const todo = new Todo(
        id,
        inputBox.value,
        descriptionBox.value,
        dueDateBox.value,
        priorityBox.value,
        false
    );
    id = id + 1;
    todoListOfObjects.push(todo)

    li = createLiElement(todo)
    saveData(); 

    listContainer.appendChild(li);

    inputBox.value = '';
    descriptionBox.value = '';
    priorityBox.value = 'Low'; // Reset to default
    dueDateBox.value = '';

    saveData();
}

inputBox.addEventListener('input', function () {
    message.innerHTML = '';
});

descriptionBox.addEventListener('input', function () {
    message.innerHTML = '';
});

dueDateBox.addEventListener('input', function () {
    message.innerHTML = '';
});

listContainer.addEventListener("click", e => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle("checked");
    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement?.remove();
        saveData();
    }
});

function saveData() {
    // localStorage.setItem('data',  listContainer.innerHTML);
    localStorage.setItem('todoListOfObjects', JSON.stringify(todoListOfObjects));

}

function showTask() {
    listContainer.innerHTML=''
    let list = JSON.parse(localStorage.getItem('todoListOfObjects'));
    console.log('list', list, typeof (list));

    list.forEach(todo => {
        li = createLiElement(todo);
        listContainer.appendChild(li);
    });
}

showTask();


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
// btn.onclick = function () {
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
