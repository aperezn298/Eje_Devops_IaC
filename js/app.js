/**
 * TodoList Application
 * Aplicación profesional de gestión de tareas con SOLID y DRY principles
 * Con alertifyjs para notificaciones profesionales
 */

// ============================================
// 0. ALERTIFY CONFIGURATION
// ============================================
if (typeof alertify !== 'undefined') {
    alertify.set('notifier', 'position', 'top-right');
    alertify.set('notifier', 'delay', 4);
    alertify.set('notifier', 'closeButton', true);
}

// ============================================
// 1. STORAGE MANAGER - Single Responsibility
// ============================================
class StorageManager {
    constructor(storageKey = 'todoList_tasks') {
        this.storageKey = storageKey;
    }

    /**
     * Obtiene todas las tareas del almacenamiento
     */
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error al leer tareas:', error);
            return [];
        }
    }

    /**
     * Guarda las tareas en el almacenamiento
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error al guardar tareas:', error);
            return false;
        }
    }

    /**
     * Limpia completamente el almacenamiento
     */
    clearAllTasks() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al limpiar tareas:', error);
            return false;
        }
    }
}

// ============================================
// 2. TASK MODEL - Domain Logic
// ============================================
class Task {
    constructor(id, text, completed = false, createdAt = new Date()) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }

    toggle() {
        this.completed = !this.completed;
    }

    isCompleted() {
        return this.completed;
    }

    getFormattedDate() {
        return this.createdAt.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// ============================================
// 3. TASK REPOSITORY - Data Management
// ============================================
class TaskRepository {
    constructor(storageManager) {
        this.storage = storageManager;
        this.tasks = this.loadTasks();
    }

    /**
     * Carga las tareas desde el almacenamiento
     */
    loadTasks() {
        return this.storage.getTasks().map(taskData =>
            new Task(taskData.id, taskData.text, taskData.completed, taskData.createdAt)
        );
    }

    /**
     * Persiste las tareas en el almacenamiento
     */
    persistTasks() {
        return this.storage.saveTasks(this.tasks);
    }

    /**
     * Añade una nueva tarea
     */
    addTask(text) {
        const id = this.generateId();
        const task = new Task(id, text);
        this.tasks.unshift(task);
        this.persistTasks();
        return task;
    }

    /**
     * Obtiene una tarea por ID
     */
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    /**
     * Obtiene todas las tareas
     */
    getAllTasks() {
        return [...this.tasks];
    }

    /**
     * Obtiene tareas completadas
     */
    getCompletedTasks() {
        return this.tasks.filter(task => task.isCompleted());
    }

    /**
     * Obtiene tareas pendientes
     */
    getPendingTasks() {
        return this.tasks.filter(task => !task.isCompleted());
    }

    /**
     * Alterna el estado de una tarea
     */
    toggleTask(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.toggle();
            this.persistTasks();
            return task;
        }
        return null;
    }

    /**
     * Elimina una tarea
     */
    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.persistTasks();
            return true;
        }
        return false;
    }

    /**
     * Elimina todas las tareas completadas
     */
    deleteCompletedTasks() {
        const initialLength = this.tasks.length;
        this.tasks = this.getPendingTasks();
        if (this.tasks.length < initialLength) {
            this.persistTasks();
            return initialLength - this.tasks.length;
        }
        return 0;
    }

    /**
     * Genera un ID único
     */
    generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtiene estadísticas de tareas
     */
    getStats() {
        return {
            total: this.tasks.length,
            completed: this.getCompletedTasks().length,
            pending: this.getPendingTasks().length
        };
    }
}

// ============================================
// 4. UI RENDERER - Presentation Logic
// ============================================
class UIRenderer {
    constructor() {
        this.template = document.getElementById('taskItemTemplate');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.pendingContainer = document.getElementById('pendingTasksContainer');
        this.completedContainer = document.getElementById('completedTasksContainer');
    }

    /**
     * Renderiza un elemento de tarea
     */
    createTaskElement(task) {
        const clone = this.template.content.cloneNode(true);
        const taskCard = clone.querySelector('.task-item');
        const checkbox = clone.querySelector('.task-checkbox');
        const textElement = clone.querySelector('.task-text');
        const dateElement = clone.querySelector('.task-date');
        const deleteBtn = clone.querySelector('.delete-btn');

        taskCard.setAttribute('data-task-id', task.id);
        checkbox.setAttribute('data-task-id', task.id);
        checkbox.checked = task.isCompleted();
        textElement.textContent = task.text;
        textElement.classList.toggle('completed-text', task.isCompleted());
        dateElement.textContent = task.getFormattedDate();
        deleteBtn.setAttribute('data-task-id', task.id);

        return clone;
    }

    /**
     * Renderiza las tareas en un contenedor específico
     */
    renderTasks(tasks, container) {
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state text-center py-5">
                    <i class="bi bi-inbox display-1 text-muted"></i>
                    <p class="text-muted mt-3">No hay tareas para mostrar</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            container.appendChild(this.createTaskElement(task));
        });
    }

    /**
     * Actualiza todos los contenedores de tareas
     */
    renderAllTasks(allTasks, pendingTasks, completedTasks) {
        this.renderTasks(allTasks, this.tasksContainer);
        this.renderTasks(pendingTasks, this.pendingContainer);
        this.renderTasks(completedTasks, this.completedContainer);
    }

    /**
     * Actualiza las estadísticas
     */
    updateStats(stats) {
        const totalElement = document.getElementById('totalTasks');
        const completedElement = document.getElementById('completedTasks');
        
        if (totalElement) totalElement.textContent = stats.total;
        if (completedElement) completedElement.textContent = stats.completed;
    }

    /**
     * Limpia el campo de entrada
     */
    clearInput(inputElement) {
        inputElement.value = '';
        inputElement.focus();
    }

    /**
     * Muestra una notificación con alertifyjs
     */
    showNotification(message, type = 'success') {
        if (typeof alertify === 'undefined') {
            console.warn('alertifyjs no está disponible, mostrando en consola:', message);
            console.log(message);
            return;
        }

        switch (type) {
            case 'success':
                alertify.success(`<i class="bi bi-check-circle"></i> ${message}`);
                break;
            case 'error':
                alertify.error(`<i class="bi bi-exclamation-circle"></i> ${message}`);
                break;
            case 'warning':
                alertify.warning(`<i class="bi bi-exclamation-triangle"></i> ${message}`);
                break;
            case 'info':
                alertify.message(`<i class="bi bi-info-circle"></i> ${message}`);
                break;
            default:
                alertify.message(message);
        }
    }
}

// ============================================
// 5. EVENT HANDLER - Interaction Management
// ============================================
class EventHandler {
    constructor(repository, renderer) {
        this.repository = repository;
        this.renderer = renderer;
        this.setupEventListeners();
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Agregar tarea
        document.getElementById('taskForm')?.addEventListener('submit', (e) => this.handleAddTask(e));

        // Checkbox de tareas
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                this.handleToggleTask(e.target.getAttribute('data-task-id'));
            }
        });

        // Botón eliminar tarea
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const taskId = e.target.closest('.delete-btn').getAttribute('data-task-id');
                this.handleDeleteTask(taskId);
            }
        });

        // Botón limpiar completadas
        document.getElementById('clearCompletedBtn')?.addEventListener('click', () => this.handleClearCompleted());
    }

    /**
     * Maneja la adición de una tarea
     */
    handleAddTask(e) {
        e.preventDefault();
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (text === '') {
            this.renderer.showNotification('Por favor ingresa una tarea', 'warning');
            return;
        }

        this.repository.addTask(text);
        this.renderer.clearInput(input);
        this.refreshUI();
        this.renderer.showNotification('Tarea añadida correctamente', 'success');
    }

    /**
     * Maneja el toggle de una tarea
     */
    handleToggleTask(taskId) {
        this.repository.toggleTask(taskId);
        this.refreshUI();
    }

    /**
     * Maneja la eliminación de una tarea
     */
    handleDeleteTask(taskId) {
        if (typeof alertify !== 'undefined') {
            alertify.confirm(
                '¿Estás seguro?',
                'Esta acción eliminará la tarea de forma permanente.',
                () => {
                    this.repository.deleteTask(taskId);
                    this.refreshUI();
                    this.renderer.showNotification('Tarea eliminada', 'info');
                },
                () => {
                    // Cancelado
                }
            );
        } else if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            this.repository.deleteTask(taskId);
            this.refreshUI();
            this.renderer.showNotification('Tarea eliminada', 'info');
        }
    }

    /**
     * Maneja la limpieza de tareas completadas
     */
    handleClearCompleted() {
        if (typeof alertify !== 'undefined') {
            alertify.confirm(
                '¿Limpiar tareas completadas?',
                'Se eliminarán todas las tareas marcadas como completadas.',
                () => {
                    const count = this.repository.deleteCompletedTasks();
                    if (count > 0) {
                        this.refreshUI();
                        this.renderer.showNotification(`${count} tarea(s) completada(s) eliminada(s)`, 'success');
                    } else {
                        this.renderer.showNotification('No hay tareas completadas para eliminar', 'info');
                    }
                },
                () => {
                    // Cancelado
                }
            );
        } else {
            const count = this.repository.deleteCompletedTasks();
            if (count > 0) {
                this.refreshUI();
                this.renderer.showNotification(`${count} tarea(s) completada(s) eliminada(s)`, 'info');
            } else {
                this.renderer.showNotification('No hay tareas completadas para eliminar', 'info');
            }
        }
    }

    /**
     * Actualiza la interfaz de usuario
     */
    refreshUI() {
        const allTasks = this.repository.getAllTasks();
        const pendingTasks = this.repository.getPendingTasks();
        const completedTasks = this.repository.getCompletedTasks();
        const stats = this.repository.getStats();

        this.renderer.renderAllTasks(allTasks, pendingTasks, completedTasks);
        this.renderer.updateStats(stats);
    }
}

// ============================================
// 6. APPLICATION INITIALIZATION
// ============================================
class TodoListApp {
    constructor() {
        this.storage = new StorageManager();
        this.repository = new TaskRepository(this.storage);
        this.renderer = new UIRenderer();
        this.eventHandler = new EventHandler(this.repository, this.renderer);
    }

    /**
     * Inicia la aplicación
     */
    init() {
        this.eventHandler.refreshUI();
    }
}

// ============================================
// 7. APP START
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoListApp();
    app.init();
});
