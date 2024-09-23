const express = require('express');
const cors = require('cors');
const config = require('./config'); // Importar configuraciones

const app = express();
const port = config.port; // Usar el puerto desde config.js

// Middleware para habilitar CORS
// Configura CORS para permitir el acceso desde el dominio de tu frontend
const corsOptions = {
  origin: 'https://client-gestor-tareas-production.up.railway.app',  // URL de tu frontend desplegado
  optionsSuccessStatus: 200, // Para navegadores más antiguos
};

app.use(cors(corsOptions));

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Array de tareas (simulado)
let tasks = [
  { id: 1, title: 'Comprar leche', completed: false },
  { id: 2, title: 'Estudiar Express', completed: true },
];

// Middleware para manejar errores de validación
function validateTask(task) {
  if (!task.title || typeof task.title !== 'string') {
    return 'El campo "title" es obligatorio y debe ser una cadena de texto.';
  }
  if (typeof task.completed !== 'boolean') {
    return 'El campo "completed" debe ser un valor booleano.';
  }
  return null;
}

// Ruta para obtener la lista de tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Ruta para añadir una nueva tarea
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  const validationError = validateTask(newTask);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  newTask.id = tasks.length + 1; // Asignar un nuevo ID a la tarea
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Ruta para eliminar una tarea por ID
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1); // Elimina la tarea del array

    // Reasignar IDs de las tareas restantes
    tasks = tasks.map((task, i) => ({ ...task, id: i + 1 }));

    res.status(204).send(); // Respuesta sin contenido (No Content)
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Ruta para actualizar una tarea por ID
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    const updatedTask = { ...tasks[index], ...req.body };
    const validationError = validateTask(updatedTask);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    tasks[index] = updatedTask;
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor API -- Gestor de Tareas');
});

// Middleware para manejar errores no atrapados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
