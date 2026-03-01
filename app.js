require('dotenv').config();
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let authRouter = require('./routes/auth');
let dashboardRouter = require('./routes/dashboard');
let cors = require('cors');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// --- Rutas de la API ---
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
let notificacionesRouter = require('./routes/notificaciones');
app.use('/api/notificaciones', notificacionesRouter);

// Middleware de Log para API
app.use('/api', (req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});

// Registrar routers específicos primero
let docentesRouter = require('./routes/docentes');
app.use('/api/docentes', docentesRouter);

let rubricasRouter = require('./routes/rubricas');
app.use('/api/rubricas', rubricasRouter);

let usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

let calificacionesRouter = require('./routes/calificaciones');
app.use('/api/calificaciones', calificacionesRouter);

let studentEvaluacionesRouter = require('./routes/studentEvaluaciones');
app.use('/api/student/evaluaciones', studentEvaluacionesRouter);

let teacherRubricasRouter = require('./routes/teacherRubricas');
app.use('/api/teacher/rubricas', teacherRubricasRouter);

let teacherEvaluacionesRouter = require('./routes/teacherEvaluaciones');
app.use('/api/teacher/evaluaciones', teacherEvaluacionesRouter);

let teacherEstudiantesRouter = require('./routes/teacherEstudiantes');
app.use('/api', teacherEstudiantesRouter);

let permisosRouter = require('./routes/permisos');
app.use('/api/permisos', permisosRouter);

// AcademicoRouter captura lo que queda bajo /api (incluyendo /api/evaluaciones)
let academicoRouter = require('./routes/academico');
app.use('/api', academicoRouter);

// Manejador 404 para API (Retorna JSON, no HTML)
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Endpoint de API no encontrado: ${req.originalUrl}` 
  });
});

module.exports = app;
