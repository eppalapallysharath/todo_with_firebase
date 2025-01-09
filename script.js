// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf8mWqG0U4rL1gQ-a2MM4u2GpMHdrNLFI",
  authDomain: "todo-web-app-3ace9.firebaseapp.com",
  projectId: "todo-web-app-3ace9",
  storageBucket: "todo-web-app-3ace9.appspot.com",
  messagingSenderId: "26808413821",
  appId: "1:26808413821:web:32e9b6881b4adb7d190b14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const updateBtn = document.getElementById("update-btn");
const todoList = document.getElementById("todo-list");

let editId = null; // Track which task is being edited

/** ✅ CREATE Operation **/
addBtn.addEventListener("click", async () => {
  const task = todoInput.value.trim();
  if (task) {
    await addDoc(collection(db, "todos"), {
      task: task,
      completed: false,
      createdAt: new Date(),
    });
    todoInput.value = "";
  }
});

/** ✅ READ Operation **/
const todosQuery = query(collection(db, "todos"), orderBy("createdAt"));
onSnapshot(todosQuery, (snapshot) => {
  todoList.innerHTML = "";
  snapshot.forEach((doc) => {
    const todo = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
            ${todo.task}
            <div>
                <button onclick="editTodo('${doc.id}', '${todo.task}')">Edit</button>
                <button onclick="deleteTodo('${doc.id}')">Delete</button>
            </div>
        `;
    todoList.appendChild(li);
  });
});

/** ✅ UPDATE Operation **/
updateBtn.addEventListener("click", async () => {
  const updatedTask = todoInput.value.trim();
  if (updatedTask && editId) {
    await updateDoc(doc(db, "todos", editId), { task: updatedTask });
    addBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    todoInput.value = "";
    editId = null;
  }
});

/** ✅ EDIT Function **/
window.editTodo = (id, task) => {
  todoInput.value = task;
  editId = id;
  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
};

/** ✅ DELETE Operation **/
window.deleteTodo = async (id) => {
  await deleteDoc(doc(db, "todos", id));
};
