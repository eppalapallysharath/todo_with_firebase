// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqIYY_U_cl1ADFM0k8qd8dZY1XvT4orzM",
  authDomain: "fir-8d7a4.firebaseapp.com",
  projectId: "fir-8d7a4",
  storageBucket: "fir-8d7a4.firebasestorage.app",
  messagingSenderId: "468472822751",
  appId: "1:468472822751:web:1bb700059f78c7c54d626a",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const updateBtn = document.getElementById("update-btn");
const todoList = document.getElementById("todo-list");

let editId = null; // Track which task is being edited

/** ✅ CREATE Operation **/
addBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  if (task) {
    db.collection("todos").add({
      task: task,
      completed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    todoInput.value = "";
  }
});

/** ✅ READ Operation **/
db.collection("todos")
  .orderBy("createdAt")
  .onSnapshot((snapshot) => {
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
updateBtn.addEventListener("click", () => {
  const updatedTask = todoInput.value.trim();
  if (updatedTask && editId) {
    db.collection("todos")
      .doc(editId)
      .update({
        task: updatedTask,
      })
      .then(() => {
        addBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        todoInput.value = "";
        editId = null;
      });
  }
});

/** ✅ EDIT Function **/
function editTodo(id, task) {
  todoInput.value = task;
  editId = id;
  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

/** ✅ DELETE Operation **/
function deleteTodo(id) {
  db.collection("todos").doc(id).delete();
}
