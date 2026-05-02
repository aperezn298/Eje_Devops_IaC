# 📋 TodoList Application

Una aplicación profesional de gestión de tareas personal construida con HTML5, Bootstrap 5, JavaScript vanilla, LocalStorage y **AlertifyJS** para notificaciones modernas.

## 🎯 Características

- ✅ **Crear tareas** - Añade nuevas tareas fácilmente
- ✅ **Marcar completadas** - Marca tareas como realizadas
- ✅ **Eliminar tareas** - Borra tareas individuales
- ✅ **Filtrado inteligente** - Visualiza tareas por estado (Todas, Pendientes, Completadas)
- ✅ **Almacenamiento persistente** - Las tareas se guardan automáticamente en LocalStorage
- ✅ **Estadísticas en tiempo real** - Muestra total de tareas y completadas
- ✅ **Interfaz responsiva** - Se adapta perfectamente a cualquier dispositivo
- ✅ **Notificaciones modernas** - AlertifyJS para alertas y diálogos profesionales
- ✅ **Diseño profesional** - Bootstrap 5 con estilos personalizados modernos

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **HTML5** | Latest | Estructura semántica |
| **Bootstrap** | 5.3.0 | Framework CSS responsivo |
| **JavaScript** | ES6+ | Lógica de aplicación |
| **LocalStorage** | API Nativa | Almacenamiento persistente |
| **AlertifyJS** | 1.13.1 | Notificaciones y diálogos profesionales |
| **Bootstrap Icons** | 1.10.0 | Iconografía moderna |
| **CSS3** | Latest | Estilos avanzados y animaciones |

## 🏗️ Arquitectura & Buenas Prácticas

### Principios SOLID Implementados

1. **Single Responsibility Principle (SRP)**
   - `StorageManager` - Maneja solo la persistencia de datos
   - `TaskRepository` - Gestiona la lógica de datos de tareas
   - `UIRenderer` - Responsable solo de la presentación
   - `EventHandler` - Maneja eventos del usuario
   - `Task` - Modelo de dato puro

2. **Open/Closed Principle (OCP)**
   - La arquitectura es extensible sin modificar código existente
   - Se pueden añadir nuevas funcionalidades fácilmente

3. **Liskov Substitution Principle (LSP)**
   - Las clases pueden ser reemplazadas por sus subclases

4. **Interface Segregation Principle (ISP)**
   - Interfaces pequeñas y específicas

5. **Dependency Inversion Principle (DIP)**
   - Las clases dependen de abstracciones, no de implementaciones concretas

### Principios DRY

- **Sin repetición de código** - Métodos reutilizables en todas las clases
- **Lógica centralizada** - La persistencia, validación y manipulación de datos ocurren en un solo lugar
- **Templates reutilizables** - Uso de HTML templates para crear elementos

## 📁 Estructura de Archivos

```
ToDoList/
├── index.html          # HTML principal con estructura semántica
├── js/
│   └── app.js          # Lógica completa de la aplicación (arquitetura modular)
├── css/
│   └── style.css       # Estilos profesionales y responsive
└── README.md           # Este archivo
```

## 🚀 Uso

### Instalación

1. Descarga los archivos en tu directorio de trabajo
2. No requiere instalación adicional - ¡funciona en cualquier navegador moderno!

### Ejecución

1. Abre `index.html` en tu navegador web
2. ¡Comienza a crear tus tareas!

```bash
# Si usas un servidor local (recomendado):
# Con Python 3:
python -m http.server 8000

# Con Node.js (http-server):
npx http-server

# Luego accede a: http://localhost:8000
```

## 📖 Clases Principales

### 1. **StorageManager**
Gestiona toda la persistencia de datos en LocalStorage.

```javascript
const storage = new StorageManager('todoList_tasks');
storage.getTasks();      // Obtiene tareas
storage.saveTasks(tasks); // Guarda tareas
storage.clearAllTasks(); // Limpia el almacenamiento
```

### 2. **Task**
Modelo que representa una tarea individual.

```javascript
const task = new Task(id, 'Mi tarea', false, new Date());
task.toggle();           // Cambia estado completado/pendiente
task.isCompleted();      // Verifica si está completada
task.getFormattedDate(); // Obtiene fecha formateada
```

### 3. **TaskRepository**
Gestiona todas las operaciones de tareas.

```javascript
const repository = new TaskRepository(storage);
repository.addTask('Nueva tarea');
repository.getAllTasks();
repository.toggleTask(taskId);
repository.deleteTask(taskId);
repository.deleteCompletedTasks();
repository.getStats();
```

### 4. **UIRenderer**
Renderiza los elementos en la interfaz.

```javascript
const renderer = new UIRenderer();
renderer.renderTasks(tasks, container);
renderer.updateStats(stats);
renderer.showNotification('Mensaje');
```

### 5. **EventHandler**
Gestiona todos los eventos del usuario.

```javascript
const handler = new EventHandler(repository, renderer);
// Automáticamente configura todos los listeners
```

### 6. **TodoListApp**
Clase principal que inicializa la aplicación.

```javascript
const app = new TodoListApp();
app.init();
```

## 💾 Almacenamiento de Datos

Los datos se guardan automáticamente en **LocalStorage** del navegador:

```javascript
// Estructura de almacenamiento:
{
  "id": "task_1234567890_abc123def",
  "text": "Mi tarea personal",
  "completed": false,
  "createdAt": "2024-05-02T14:30:00.000Z"
}
```

### Ventajas del LocalStorage

- ✅ Almacenamiento local persistente
- ✅ No requiere servidor
- ✅ Sin base de datos
- ✅ Funciona sin conexión a internet
- ✅ Fácil de depurar (DevTools)

## 🎨 Características de Diseño

### Paleta de Colores

- **Primario**: #4f46e5 (Azul índigo)
- **Éxito**: #10b981 (Verde)
- **Peligro**: #ef4444 (Rojo)
- **Advertencia**: #f59e0b (Ámbar)

### Componentes UI

- Encabezado con gradiente profesional
- Tarjetas con sombras y transiciones suaves
- Botones con efectos hover y active
- Notificaciones con auto-cierre
- Tablas responsivas

### Responsividad

- ✅ Desktop (1920px y más)
- ✅ Tablets (768px - 1024px)
- ✅ Móviles (320px - 767px)

## 🔧 Configuración

### Variables CSS Personalizables

Edita `css/style.css` para cambiar los colores:

```css
:root {
    --primary-color: #4f46e5;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    /* ... más variables */
}
```

## 📋 Funcionalidades Detalladas

### Crear Tarea
1. Escribe el texto en el campo de entrada
2. Presiona el botón "Añadir" o Enter
3. La tarea aparecerá en la lista

### Marcar Completada
1. Haz clic en el checkbox de la tarea
2. La tarea se marcará con un tachado visual
3. Se contabilizará en "completadas"

### Filtrar Tareas
1. Usa los tabs en la interfaz:
   - **Todas**: Muestra todas las tareas
   - **Pendientes**: Solo tareas no completadas
   - **Completadas**: Solo tareas finalizadas

### Limpiar Completadas
1. Presiona el botón de papelera
2. Se eliminarán todas las tareas completadas
3. Se mostrará notificación de confirmación

### Eliminar Tarea
1. Pasa el mouse sobre la tarea
2. Aparecerá el botón de papelera
3. Haz clic para eliminar (requiere confirmación)

## 🔐 Seguridad & Validación

- ✅ Validación de entrada (no permite tareas vacías)
- ✅ IDs únicos para cada tarea
- ✅ Manejo de errores en almacenamiento
- ✅ Confirmación antes de eliminar
- ✅ Escapado de caracteres especiales

## 📊 Estadísticas

La aplicación muestra en tiempo real:
- Total de tareas
- Tareas completadas
- Tareas pendientes (calculadas)

## 🌐 Compatibilidad

- ✅ Chrome/Chromium (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Edge (Chromium-based)
- ✅ Opera

## 🚀 Mejoras Futuras Posibles

- Editar tareas existentes
- Categorías/etiquetas para tareas
- Prioridades (baja, media, alta)
- Fechas de vencimiento
- Recordatorios/notificaciones
- Exportar/importar tareas (JSON, CSV)
- Tema oscuro/claro
- Sincronización en la nube
- Tareas recurrentes

## 📝 Licencia

Este proyecto está disponible bajo licencia MIT.

## 📚 Documentación Adicional

Esta aplicación incluye documentación completa:

1. **[QUICK_START.md](QUICK_START.md)** - Guía rápida para empezar
2. **[SOLID_DRY_PRINCIPLES.md](SOLID_DRY_PRINCIPLES.md)** - Análisis profundo de arquitectura
3. **[ALERTIFYJS_GUIDE.md](ALERTIFYJS_GUIDE.md)** - Guía completa de notificaciones
4. **[js/extensions.js](js/extensions.js)** - Ejemplos de extensiones

## 🔗 Referencias Externas

- **Bootstrap 5**: https://getbootstrap.com/
- **AlertifyJS**: https://alertifyjs.com/
- **Bootstrap Icons**: https://icons.getbootstrap.com/
- **LocalStorage API**: https://developer.mozilla.org/es/docs/Web/API/Window/localStorage

## 👨‍💻 Autor

Creado como ejemplo de aplicación profesional con buenas prácticas de desarrollo.

---

**Última actualización: 2 de Mayo de 2026**

**¡Que disfrutes desarrollando! 🚀**