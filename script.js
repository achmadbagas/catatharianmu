const addBtn = document.getElementById("add-btn");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// Ambil data saat pertama kali halaman dibuka
document.addEventListener("DOMContentLoaded", loadTodos);

addBtn.addEventListener("click", addTodo);
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTodo();
    }
});

function addTodo() {
    const text = input.value.trim();
    if (text === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    const todo = {
        text: text,
        completed: false
    };

    saveTodoToStorage(todo);
    renderTodo(todo);

    input.value = "";
}

// Render ke tampilan
function renderTodo(todo) {
    const li = document.createElement("li");

    if (todo.completed) {
        li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.classList.add("task-text");

    span.addEventListener("click", () => {
        li.classList.toggle("completed");
        updateStorage();
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    // Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", () => {
        const newText = prompt("Edit tugas:", span.textContent);
        if (newText !== null && newText.trim() !== "") {
            span.textContent = newText.trim();
            updateStorage();
        }
    });

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Hapus";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        li.remove();
        updateStorage();
    });

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonsDiv);

    list.prepend(li);
}

// ===== LOCAL STORAGE =====

// Simpan satu todo
function saveTodoToStorage(todo) {
    const todos = getTodosFromStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Ambil semua todo
function getTodosFromStorage() {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
}

// Update semua isi storage (dipakai saat edit/delete/complete)
function updateStorage() {
    const todos = [];

    document.querySelectorAll("#todo-list li").forEach(li => {
        const text = li.querySelector(".task-text").textContent;
        const completed = li.classList.contains("completed");

        todos.push({ text, completed });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load semua todo saat refresh
function loadTodos() {
    const todos = getTodosFromStorage();
    todos.forEach(todo => renderTodo(todo));
}