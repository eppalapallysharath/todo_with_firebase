import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeIzn_c0D3Aql6PysW-4pTKgJ5OKHIjaI",
  authDomain: "todo-app-ebdff.firebaseapp.com",
  projectId: "todo-app-ebdff",
  storageBucket: "todo-app-ebdff.firebasestorage.app",
  messagingSenderId: "385797502066",
  appId: "1:385797502066:web:a92773712876afcb0abeeb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const updateBtn = document.getElementById("update-btn");
const todoList = document.getElementById("todo-list");

let editId = null;

addBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const task = todoInput.value.trim();
  if (task.length > 0) {
    await addDoc(collection(db, "todos"), {
      task: task,
      completed: false,
      createdAt: new Date(),
    });
    todoInput.value = "";
  } else {
    alert("please enter something");
  }
});

const todosQuery = query(collection(db, "todos"), orderBy("createdAt"));
onSnapshot(todosQuery, (snapshot) => {
  todoList.innerHTML = "";
  snapshot.forEach((doc) => {
    const todo = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
            ${todo.task}
            <div>
                <button onClick = "editTodo('${doc.id}', '${todo.task}')">Edit</button>
                <button Onclick= "deleteTodo('${doc.id}')">Delete</button>
            </div>`;
    todoList.appendChild(li);
  });
});

window.deleteTodo = async (id) => {
  await deleteDoc(doc(db, "todos", id));
};

window.editTodo = async (id, task) => {
  todoInput.value = task;
  editId = id;
  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
};

updateBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const updatedTask = todoInput.value;
  if (updatedTask.length > 0) {
    await updateDoc(doc(db, "todos", editId), {
      task: updatedTask,
    });
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    todoInput.value = "";
    editId = null;
  } else {
    alert("please enter something");
  }
});
