// ==========================================
// 1. CALCULADORA DE EDAD
// ==========================================
const btnAge = document.getElementById('btnAge');
const birthDateInput = document.getElementById('birthDate');
const ageResult = document.getElementById('ageResult');

btnAge.addEventListener('click', () => {
    const dateStr = birthDateInput.value.trim();
    // Validación básica formato DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (!regex.test(dateStr)) {
        ageResult.textContent = "Please enter a valid date (DD/MM/YYYY).";
        return;
    }

    const [, day, month, year] = dateStr.match(regex);
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date(); // Usando la fecha actual

    if (isNaN(birthDate.getTime()) || birthDate > today) {
        ageResult.textContent = "Invalid or future date.";
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
    }
    
    if (today.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
            months = 11;
        }
    }

    ageResult.innerHTML = `You are <strong>${years} years ${months} months</strong> old`;
});

// ==========================================
// 2. CONVERTIDOR DE TEMPERATURA
// ==========================================
const tempValue = document.getElementById('tempValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const btnTemp = document.getElementById('btnTemp');
const tempResult = document.getElementById('tempResult');

const checkTempInputs = () => {
    if (tempValue.value !== "" && fromUnit.value !== "" && toUnit.value !== "") {
        btnTemp.disabled = false;
    } else {
        btnTemp.disabled = true;
    }
};

tempValue.addEventListener('input', checkTempInputs);
fromUnit.addEventListener('change', checkTempInputs);
toUnit.addEventListener('change', checkTempInputs);

btnTemp.addEventListener('click', () => {
    const val = parseFloat(tempValue.value);
    const from = fromUnit.value;
    const to = toUnit.value;
    let result = val;

    if (from === to) {
        result = val;
    } else if (from === 'C' && to === 'F') result = (val * 9/5) + 32;
    else if (from === 'C' && to === 'K') result = val + 273.15;
    else if (from === 'F' && to === 'C') result = (val - 32) * 5/9;
    else if (from === 'F' && to === 'K') result = (val - 32) * 5/9 + 273.15;
    else if (from === 'K' && to === 'C') result = val - 273.15;
    else if (from === 'K' && to === 'F') result = (val - 273.15) * 9/5 + 32;

    const unitNames = { 'C': 'Celsius', 'F': 'Fahrenheit', 'K': 'Kelvin' };
    tempResult.textContent = `${val} ${unitNames[from]} is ${result.toFixed(2)} ${unitNames[to]}`;
});

// ==========================================
// 3. TASK TRACKER (DOM Dinámico)
// ==========================================
let tasks = []; 
const taskInput = document.getElementById('taskInput');
const btnAddTask = document.getElementById('btnAddTask');
const taskList = document.getElementById('taskList');

function renderTasks() {
    taskList.innerHTML = '';
    
    // Separar pendientes y completadas para ubicarlas al final
    const pendingTasks = tasks.filter(t => !t.completada);
    const completedTasks = tasks.filter(t => t.completada);
    const sortedTasks = [...pendingTasks, ...completedTasks];

    sortedTasks.forEach(task => {
        const originalIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        li.className = `task-item ${task.completada ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completada ? 'checked' : ''} onchange="toggleTask(${originalIndex})">
            <span>${task.descripcion}</span>
            <button class="delete-btn" onclick="deleteTask(${originalIndex})">🗑️</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const desc = taskInput.value.trim();
    if (desc !== "") {
        tasks.push({ descripcion: desc, completada: false });
        taskInput.value = '';
        renderTasks();
    }
}

// Expuestas globalmente para los atributos onclick
window.toggleTask = function(index) {
    tasks[index].completada = !tasks[index].completada;
    renderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
};

btnAddTask.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Render inicial
renderTasks();