// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCKfhzNnYh_cSr52CvfHXMpflgZEHJqtHw",
    authDomain: "practicabalbuena.firebaseapp.com",
    databaseURL: "https://practicabalbuena-default-rtdb.firebaseio.com",
    projectId: "practicabalbuena",
    storageBucket: "practicabalbuena.appspot.com",
    messagingSenderId: "808278066804",
    appId: "1:808278066804:web:35e04a9cc7c8a975773321"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Autenticación Firebase
firebase.auth().signInAnonymously().catch(error => {
    console.error("Error en la autenticación:", error);
});

function addTask() {
    const name = document.getElementById("taskName").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;

    if (name && deadline && priority) {
        const newTaskRef = db.ref('tasks').push();
        newTaskRef.set({
            name,
            deadline,
            priority,
            completed: false
        });
        document.getElementById("taskName").value = '';
        document.getElementById("taskDeadline").value = '';
    }
}

db.ref('tasks').on('value', (snapshot) => {
    const highPriorityTasks = document.getElementById('highPriorityTasks');
    const mediumPriorityTasks = document.getElementById('mediumPriorityTasks');
    const lowPriorityTasks = document.getElementById('lowPriorityTasks');

    highPriorityTasks.innerHTML = '';
    mediumPriorityTasks.innerHTML = '';
    lowPriorityTasks.innerHTML = '';

    snapshot.forEach(taskSnapshot => {
        const taskData = taskSnapshot.val();
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        if (taskData.completed) taskElement.classList.add('completed-task');

        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-name">${taskData.name}</div>
                <div class="task-deadline">${taskData.deadline}</div>
                <button onclick="editTask('${taskSnapshot.key}')">Editar</button>
                <button onclick="deleteTask('${taskSnapshot.key}')">Eliminar</button>
            </div>
            <div class="task-footer">
                <label>
                    <input type="checkbox" ${taskData.completed ? "checked" : ""} 
                           onclick="toggleCompleted('${taskSnapshot.key}', ${!taskData.completed})">
                    Completada
                </label>
            </div>
        `;

        if (taskData.priority === "Alta") {
            highPriorityTasks.appendChild(taskElement);
        } else if (taskData.priority === "Media") {
            mediumPriorityTasks.appendChild(taskElement);
        } else {
            lowPriorityTasks.appendChild(taskElement);
        }
    });
});

function deleteTask(taskId) {
    db.ref('tasks/' + taskId).remove();
}

function editTask(taskId) {
    const name = prompt("Nuevo nombre de la tarea:");
    const deadline = prompt("Nueva fecha límite:");
    const priority = prompt("Nueva prioridad (Alta, Media, Baja):");

    if (name && deadline && priority) {
        db.ref('tasks/' + taskId).update({ name, deadline, priority });
    }
}

function toggleCompleted(taskId, completed) {
    db.ref('tasks/' + taskId).update({ completed });
}







