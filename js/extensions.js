/**
 * EJEMPLOS DE EXTENSIONES - Cómo expandir la aplicación
 * 
 * Este archivo muestra cómo añadir nuevas funcionalidades
 * manteniendo los principios SOLID y DRY
 */

// ============================================
// EXTENSIÓN 1: TAREAS CON PRIORIDAD
// ============================================

class TaskWithPriority {
    constructor(id, text, completed = false, priority = 'medium', createdAt = new Date()) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.priority = priority; // 'low', 'medium', 'high'
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }

    getPriorityBadge() {
        const badges = {
            'low': { label: 'Baja', class: 'badge-success' },
            'medium': { label: 'Media', class: 'badge-warning' },
            'high': { label: 'Alta', class: 'badge-danger' }
        };
        return badges[this.priority] || badges['medium'];
    }
}

// ============================================
// EXTENSIÓN 2: CATEGORÍAS
// ============================================

class TaskCategory {
    constructor(name, color = '#4f46e5', icon = 'bi-tag') {
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

    static PREDEFINED = {
        PERSONAL: new TaskCategory('Personal', '#4f46e5', 'bi-person'),
        TRABAJO: new TaskCategory('Trabajo', '#10b981', 'bi-briefcase'),
        COMPRAS: new TaskCategory('Compras', '#f59e0b', 'bi-bag'),
        SALUD: new TaskCategory('Salud', '#ef4444', 'bi-heart'),
        EDUCACION: new TaskCategory('Educación', '#8b5cf6', 'bi-book')
    };
}

// ============================================
// EXTENSIÓN 3: REPOSITORIO CON FILTROS AVANZADOS
// ============================================

class AdvancedTaskRepository {
    constructor(storageManager) {
        this.storage = storageManager;
        this.tasks = this.loadTasks();
    }

    /**
     * Busca tareas por texto
     */
    searchByText(searchTerm) {
        return this.tasks.filter(task =>
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    /**
     * Ordena tareas por prioridad
     */
    sortByPriority() {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        return [...this.tasks].sort((a, b) => 
            (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        );
    }

    /**
     * Obtiene tareas creadas en un rango de fechas
     */
    getTasksByDateRange(startDate, endDate) {
        return this.tasks.filter(task => 
            task.createdAt >= startDate && task.createdAt <= endDate
        );
    }

    /**
     * Agrupa tareas por categoría
     */
    groupByCategory() {
        const grouped = {};
        this.tasks.forEach(task => {
            const category = task.category || 'Sin categoría';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(task);
        });
        return grouped;
    }

    /**
     * Estadísticas avanzadas
     */
    getAdvancedStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
            highPriority: this.tasks.filter(t => t.priority === 'high').length,
            completionRate: this.tasks.length > 0 
                ? (this.tasks.filter(t => t.completed).length / this.tasks.length * 100).toFixed(1)
                : 0
        };
    }
}

// ============================================
// EXTENSIÓN 4: EXPORTADOR DE DATOS
// ============================================

class TaskExporter {
    /**
     * Exporta tareas a JSON
     */
    static exportToJSON(tasks) {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        return URL.createObjectURL(dataBlob);
    }

    /**
     * Exporta tareas a CSV
     */
    static exportToCSV(tasks) {
        const headers = ['ID', 'Tarea', 'Estado', 'Fecha Creación'];
        const rows = tasks.map(task => [
            task.id,
            `"${task.text}"`,
            task.completed ? 'Completada' : 'Pendiente',
            task.createdAt
        ]);

        const csv = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');

        const dataBlob = new Blob([csv], { type: 'text/csv' });
        return URL.createObjectURL(dataBlob);
    }

    /**
     * Descarga tareas
     */
    static downloadTasks(tasks, format = 'json') {
        const url = format === 'json' 
            ? this.exportToJSON(tasks)
            : this.exportToCSV(tasks);

        const link = document.createElement('a');
        link.href = url;
        link.download = `tareas_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// ============================================
// EXTENSIÓN 5: ALMACENAMIENTO EN INDEXEDDB
// ============================================

class IndexedDBStorage {
    constructor(dbName = 'TodoListDB', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.initDB();
    }

    /**
     * Inicializa la base de datos
     */
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('tasks')) {
                    const store = db.createObjectStore('tasks', { keyPath: 'id' });
                    store.createIndex('completed', 'completed', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    /**
     * Obtiene todas las tareas
     */
    async getTasks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    /**
     * Guarda tareas
     */
    async saveTasks(tasks) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');

            // Limpia tareas existentes
            store.clear();

            // Añade nuevas tareas
            tasks.forEach(task => store.add(task));

            transaction.onerror = () => reject(transaction.error);
            transaction.oncomplete = () => resolve(true);
        });
    }
}

// ============================================
// EXTENSIÓN 6: SISTEMA DE NOTIFICACIONES
// ============================================

class NotificationManager {
    /**
     * Solicita permiso para notificaciones del navegador
     */
    static async requestPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                return true;
            } else if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            }
        }
        return false;
    }

    /**
     * Envía notificación del navegador
     */
    static sendNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                ...options
            });
        }
    }

    /**
     * Recordatorio para tarea importante
     */
    static setTaskReminder(task, minutesBefore = 60) {
        const reminderTime = new Date(Date.now() + minutesBefore * 60000);
        
        setTimeout(() => {
            this.sendNotification('Recordatorio de Tarea', {
                body: `Recuerda: ${task.text}`,
                tag: `reminder_${task.id}`
            });
        }, minutesBefore * 60000);
    }
}

// ============================================
// EXTENSIÓN 7: SINCRONIZACIÓN CON API
// ============================================

class CloudSyncManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * Sincroniza tareas con servidor
     */
    async syncTasks(tasks) {
        try {
            const response = await fetch(`${this.apiUrl}/tasks/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tasks)
            });

            if (!response.ok) throw new Error('Error en sincronización');
            return await response.json();
        } catch (error) {
            console.error('Error sincronizando tareas:', error);
            throw error;
        }
    }

    /**
     * Obtiene tareas del servidor
     */
    async fetchTasks() {
        try {
            const response = await fetch(`${this.apiUrl}/tasks`);
            if (!response.ok) throw new Error('Error obteniendo tareas');
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo tareas:', error);
            throw error;
        }
    }

    /**
     * Sincronización bidireccional
     */
    async bidirectionalSync(localTasks) {
        try {
            const remoteTasks = await this.fetchTasks();
            const merged = this.mergeTasks(localTasks, remoteTasks);
            await this.syncTasks(merged);
            return merged;
        } catch (error) {
            console.error('Error en sincronización bidireccional:', error);
            return localTasks;
        }
    }

    /**
     * Fusiona tareas locales y remotas
     */
    mergeTasks(local, remote) {
        const taskMap = new Map();

        // Añade tareas remotas primero (más recientes)
        remote.forEach(task => taskMap.set(task.id, task));

        // Actualiza con tareas locales si son más recientes
        local.forEach(task => {
            const existing = taskMap.get(task.id);
            if (!existing || new Date(task.createdAt) > new Date(existing.createdAt)) {
                taskMap.set(task.id, task);
            }
        });

        return Array.from(taskMap.values());
    }
}

// ============================================
// EXTENSIÓN 8: ATAJOS DE TECLADO
// ============================================

class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+L: Limpiar completadas
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                document.getElementById('clearCompletedBtn')?.click();
            }

            // Ctrl+N: Nuevo foco en input
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                document.getElementById('taskInput')?.focus();
            }

            // Escape: Desenfoca
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
        });
    }
}

// ============================================
// EJEMPLO DE USO - Cómo integrar las extensiones
// ============================================

/*

// USAR CATEGORÍAS
const taskWithCategory = {
    ...new Task('id', 'Comprar leche'),
    category: TaskCategory.PREDEFINED.COMPRAS
};

// USAR BÚSQUEDA AVANZADA
const repository = new AdvancedTaskRepository(storage);
const results = repository.searchByText('comprar');
const stats = repository.getAdvancedStats();

// EXPORTAR TAREAS
TaskExporter.downloadTasks(repository.tasks, 'csv');

// USAR INDEXEDDB (más almacenamiento)
const idbStorage = new IndexedDBStorage();
const tasks = await idbStorage.getTasks();

// SOLICITAR NOTIFICACIONES
await NotificationManager.requestPermission();
NotificationManager.sendNotification('¡Tarea completada!');

// USAR ATAJOS DE TECLADO
KeyboardShortcuts.init();

*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*

PARA AÑADIR ESTAS EXTENSIONES A TU APLICACIÓN:

1. PRIORIDADES:
   - Reemplaza la clase Task con TaskWithPriority
   - Actualiza TaskRepository para manejar prioridades
   - Añade UI para seleccionar prioridad

2. CATEGORÍAS:
   - Añade un selector de categoría en el formulario
   - Actualiza el renderizado para mostrar la categoría

3. BÚSQUEDA AVANZADA:
   - Añade un input de búsqueda
   - Conecta con los métodos de búsqueda

4. EXPORTACIÓN:
   - Añade botones de descarga en la UI
   - Llama a TaskExporter.downloadTasks()

5. INDEXEDDB:
   - Reemplaza StorageManager con IndexedDBStorage
   - Actualiza las promesas en TaskRepository

6. NOTIFICACIONES:
   - Llama a NotificationManager.requestPermission() al iniciar
   - Usa sendNotification() en los eventos relevantes

7. SINCRONIZACIÓN EN NUBE:
   - Configura tu API backend
   - Llama a bidirectionalSync() periódicamente

8. ATAJOS DE TECLADO:
   - Llama a KeyboardShortcuts.init() al iniciar la app

*/
