-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2026 at 06:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistems_rubricas`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` bigint(20) NOT NULL,
  `tabla` varchar(50) NOT NULL,
  `operacion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `registro_id` varchar(50) NOT NULL,
  `usuario_cedula` varchar(20) DEFAULT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carrera`
--

CREATE TABLE `carrera` (
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` mediumtext DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carrera`
--

INSERT INTO `carrera` (`codigo`, `nombre`, `descripcion`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('ADM', 'Administración de Empresas', 'Formación en gestión empresarial, finanzas y recursos humanos para la administración eficiente de organizaciones.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('CONT', 'Contaduría', 'Formación profesional en contabilidad, auditoría, finanzas y normativa fiscal para el control financiero de organizaciones.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('EDESP', 'Educación Especial', 'Formación especializada en atención educativa a personas con necesidades educativas especiales.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('EDIN', 'Educación Inicial', 'Formación pedagógica especializada en la educación de niños y niñas de 0 a 6 años.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('EDINT', 'Educación Integral', 'Formación integral para la docencia en educación básica y media diversificada.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('ELEC', 'Electrónica', 'Formación en circuitos electrónicos, sistemas digitales, microcontroladores y telecomunicaciones.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('ELTEC', 'Electrotecnia', 'Formación en sistemas eléctricos, instalaciones, máquinas eléctricas y control industrial.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('INF', 'Informática', 'Formación en desarrollo de software, bases de datos, redes y sistemas informáticos para la solución de problemas tecnológicos.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51'),
('MEC', 'Mecánica Industrial', 'Formación en diseño mecánico, procesos de manufactura, mantenimiento industrial y automatización.', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51');

-- --------------------------------------------------------

--
-- Table structure for table `criterio_rubrica`
--

CREATE TABLE `criterio_rubrica` (
  `id` int(11) NOT NULL,
  `rubrica_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `puntaje_maximo` decimal(5,2) NOT NULL,
  `orden` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criterio_rubrica`
--

INSERT INTO `criterio_rubrica` (`id`, `rubrica_id`, `descripcion`, `puntaje_maximo`, `orden`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 'Análisis de Requerimientos: Identificación completa y clara de los requerimientos funcionales y no funcionales', 20.00, 1, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(2, 1, 'Diseño del Sistema: Arquitectura, diagramas UML y modelado de datos coherente y bien estructurado', 25.00, 2, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(3, 1, 'Implementación: Código limpio, funcional, con buenas prácticas de programación', 30.00, 3, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(4, 1, 'Pruebas y Validación: Casos de prueba completos y documentación de resultados', 15.00, 4, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(5, 1, 'Documentación: Manual técnico y de usuario completo y claro', 10.00, 5, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(6, 1, 'Contenido: Dominio del tema, profundidad y relevancia de la información presentada', 30.00, 1, '2026-02-16 18:27:43', '2026-02-23 19:14:45'),
(7, 1, 'Organización: Estructura lógica, introducción, desarrollo y conclusión coherentes', 25.00, 2, '2026-02-16 18:27:43', '2026-02-23 19:14:50'),
(8, 1, 'Comunicación Verbal: Claridad, fluidez, vocabulario apropiado y manejo del tiempo', 25.00, 3, '2026-02-16 18:27:43', '2026-02-23 19:14:52'),
(9, 1, 'Material de Apoyo: Calidad visual, pertinencia y apoyo efectivo a la presentación', 20.00, 4, '2026-02-16 18:27:43', '2026-02-23 19:14:54'),
(10, 3, 'Participación Activa: Contribución constante y efectiva a las actividades del equipo', 25.00, 1, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(11, 3, 'Comunicación: Escucha activa y comunicación efectiva con los miembros del equipo', 25.00, 2, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(12, 3, 'Resolución de Conflictos: Capacidad para manejar diferencias constructivamente', 25.00, 3, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(13, 3, 'Cumplimiento de Compromisos: Responsabilidad en la entrega de tareas asignadas', 25.00, 4, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(14, 4, 'Marco Teórico: Fundamentación teórica sólida con referencias actualizadas', 20.00, 1, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(15, 4, 'Metodología: Diseño metodológico apropiado y bien justificado', 25.00, 2, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(16, 4, 'Análisis de Datos: Procesamiento y análisis riguroso de los datos obtenidos', 25.00, 3, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(17, 4, 'Conclusiones: Coherencia entre resultados, análisis y conclusiones', 20.00, 4, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(18, 4, 'Formato y Referencias: Cumplimiento de normas de citación y presentación', 10.00, 5, '2026-02-16 18:27:43', '2026-02-16 18:27:43'),
(24, 6, 'regr', 10.00, 1, '2026-02-24 22:04:22', '2026-02-24 22:04:22'),
(25, 7, 'Análisis del Contexto y Normativa', 5.85, 1, '2026-02-24 22:13:41', '2026-02-24 22:13:41'),
(26, 7, 'Adaptación del Plan de Cuentas y Registros', 5.83, 2, '2026-02-24 22:13:41', '2026-02-24 22:13:41'),
(27, 7, 'Propuesta de Estados Financieros Inclusivos', 5.83, 3, '2026-02-24 22:13:41', '2026-02-24 22:13:41'),
(28, 7, 'Justificación y Viabilidad de la Propuesta', 5.83, 4, '2026-02-24 22:13:41', '2026-02-24 22:13:41'),
(29, 7, 'Exposición y Defensa del Proyecto', 5.83, 5, '2026-02-24 22:13:41', '2026-02-24 22:13:41'),
(30, 7, 'Trabajo en Equipo y Sensibilidad Inclusiva', 5.83, 6, '2026-02-24 22:13:41', '2026-02-24 22:13:41');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_evaluacion`
--

CREATE TABLE `detalle_evaluacion` (
  `puntaje_obtenido` decimal(5,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `evaluacion_r_id` int(11) NOT NULL,
  `orden_detalle` int(11) NOT NULL,
  `id_criterio_detalle` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detalle_evaluacion`
--

INSERT INTO `detalle_evaluacion` (`puntaje_obtenido`, `observaciones`, `fecha_creacion`, `fecha_actualizacion`, `evaluacion_r_id`, `orden_detalle`, `id_criterio_detalle`) VALUES
(18.00, 'Identificación casi completa de requerimientos', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1, 1, 1),
(23.00, 'Diseño bien estructurado con diagramas claros', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1, 2, 2),
(28.00, 'Código muy limpio y funcional', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1, 3, 3),
(13.00, 'Pruebas adecuadas pero podrían ser más exhaustivas', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1, 4, 4),
(15.00, 'Requerimientos adecuados', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2, 1, 1),
(19.00, 'Diseño correcto', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2, 2, 2),
(23.00, 'Código funcional', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2, 3, 3),
(11.00, 'Pruebas suficientes', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2, 4, 4),
(0.25, 'lol q mal', '2026-02-16 20:52:28', '2026-02-16 20:52:28', 2, 4, 5),
(12.00, 'Requerimientos básicos identificados', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3, 1, 1),
(15.00, 'Diseño suficiente', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3, 2, 2),
(18.00, 'Código cumple mínimo', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3, 3, 3),
(9.00, 'Pruebas básicas', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3, 4, 4),
(19.00, 'Excelente análisis de requerimientos', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4, 1, 1),
(24.00, 'Diseño normalizado correctamente', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4, 2, 2),
(27.00, 'Implementación eficiente', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4, 3, 3),
(14.00, 'Pruebas completas', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4, 4, 4),
(0.25, 'lol q mal', '2026-02-16 20:53:19', '2026-02-16 20:53:19', 4, 4, 5),
(28.00, 'Excelente dominio del tema', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6, 1, 6),
(24.00, 'Muy bien organizado', '2026-02-16 18:27:43', '2026-02-23 19:24:56', 6, 1, 7),
(23.00, 'Comunicación clara y efectiva', '2026-02-16 18:27:43', '2026-02-23 19:24:58', 6, 1, 8),
(19.00, 'Material de apoyo profesional', '2026-02-16 18:27:43', '2026-02-23 19:25:00', 6, 1, 9),
(28.00, 'Excelente dominio del tema', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 7, 1, 6),
(24.00, 'Muy bien organizado', '2026-02-16 18:27:43', '2026-02-23 19:25:05', 7, 1, 7),
(23.00, 'Comunicación clara y efectiva', '2026-02-16 18:27:43', '2026-02-23 19:25:07', 7, 1, 8),
(19.00, 'Material de apoyo profesional', '2026-02-16 18:27:43', '2026-02-23 19:25:09', 7, 1, 9),
(24.00, 'Participación muy activa y constructiva', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8, 1, 10),
(23.00, 'Excelente comunicación en equipo', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8, 2, 11),
(22.00, 'Buen manejo de conflictos', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8, 3, 12),
(25.00, 'Cumplimiento total de compromisos', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8, 4, 13);

-- --------------------------------------------------------

--
-- Table structure for table `estrategia_empleada`
--

CREATE TABLE `estrategia_empleada` (
  `id_estrategia` int(11) NOT NULL,
  `id_eval` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estrategia_empleada`
--

INSERT INTO `estrategia_empleada` (`id_estrategia`, `id_eval`) VALUES
(1, 4),
(1, 7),
(1, 9),
(1, 13),
(1, 29),
(1, 30),
(1, 34),
(1, 40),
(1, 43),
(2, 28),
(2, 35),
(2, 45),
(3, 2),
(3, 3),
(3, 6),
(3, 7),
(3, 8),
(3, 12),
(3, 13),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 20),
(3, 21),
(3, 22),
(4, 3),
(4, 6),
(4, 8),
(4, 12),
(4, 18),
(4, 19),
(4, 20),
(4, 22),
(4, 28),
(4, 44),
(4, 45),
(6, 1),
(6, 4),
(6, 5),
(6, 9),
(6, 14),
(6, 15),
(6, 16),
(6, 19),
(6, 29),
(6, 31),
(6, 38),
(7, 2),
(7, 14),
(7, 20),
(7, 21),
(7, 45),
(8, 1),
(8, 5),
(8, 17),
(8, 25),
(8, 39),
(8, 41),
(8, 42),
(9, 22),
(9, 25),
(9, 33),
(9, 36),
(9, 38),
(9, 39),
(9, 42),
(9, 44),
(10, 3),
(10, 8),
(10, 25),
(10, 30),
(10, 31),
(10, 40);

-- --------------------------------------------------------

--
-- Table structure for table `estrategia_eval`
--

CREATE TABLE `estrategia_eval` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `ponderable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estrategia_eval`
--

INSERT INTO `estrategia_eval` (`id`, `nombre`, `ponderable`) VALUES
(1, 'Evaluación escrita', 1),
(2, 'Evaluación oral', 1),
(3, 'Proyecto', 1),
(4, 'Presentación', 1),
(5, 'Portafolio', 1),
(6, 'Examen práctico', 1),
(7, 'Trabajo de investigación', 1),
(8, 'Evaluación continua', 1),
(9, 'Autoevaluación', 1),
(10, 'Diagnóstico', 0);

-- --------------------------------------------------------

--
-- Table structure for table `evaluacion`
--

CREATE TABLE `evaluacion` (
  `id` int(11) NOT NULL,
  `ponderacion` decimal(5,2) DEFAULT NULL,
  `cantidad_personas` int(11) DEFAULT NULL,
  `contenido` varchar(200) DEFAULT NULL,
  `competencias` mediumtext DEFAULT NULL,
  `instrumentos` mediumtext DEFAULT NULL,
  `fecha_evaluacion` date DEFAULT NULL,
  `id_seccion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluacion`
--

INSERT INTO `evaluacion` (`id`, `ponderacion`, `cantidad_personas`, `contenido`, `competencias`, `instrumentos`, `fecha_evaluacion`, `id_seccion`) VALUES
(1, 25.00, 1, 'Desarrollo de Algoritmos Básicos', 'Diseñar e implementar algoritmos para resolver problemas computacionales', 'Rúbrica analítica, observación directa', '2025-10-15', 6),
(2, 30.00, 1, 'Diseño de Base de Datos Relacional', 'Diseñar bases de datos relacionales normalizadas', 'Rúbrica de proyecto, revisión técnica', '2025-11-12', 6),
(3, 35.00, 2, 'Proyecto Integrador de Software.', 'Desarrollar aplicación web completa aplicando metodologías ágiles', 'Rúbrica holística, presentación oral', '2025-12-11', 7),
(4, 20.00, 1, 'Análisis de Algoritmos de Ordenamiento', 'Analizar y comparar diferentes algoritmos de ordenamiento', 'Prueba práctica, informe técnico', '2025-10-29', 7),
(5, 25.00, 1, 'Configuración de Redes LAN', 'Configurar y administrar redes de área local', 'Examen práctico, rúbrica de competencias', '0000-00-00', 8),
(6, 30.00, 1, 'Plan Estratégico Empresarial', 'Elaborar un plan estratégico para una organización', 'Rúbrica de proyecto, análisis de caso', '2025-10-22', 1),
(7, 25.00, 1, 'Análisis de Estados Financieros', 'Interpretar estados financieros y calcular indicadores', 'Rúbrica analítica, resolución de casos', '2025-11-19', 2),
(8, 20.00, 2, 'Presentación de Plan de Marketing', 'Diseñar y presentar un plan de marketing para un producto', 'Rúbrica de presentación, evaluación por pares', '2025-11-05', 3),
(9, 30.00, 1, 'Registro de Operaciones Contables', 'Registrar operaciones contables según principios de contabilidad', 'Rúbrica analítica, prueba práctica', '2025-10-29', 4),
(10, 35.00, 1, 'Auditoría de Cuentas por Cobrar', 'Realizar auditoría de cuentas por cobrar aplicando NIA', 'Rúbrica de auditoría, informe técnico', '2025-11-26', 5),
(11, 25.00, 1, 'Diseño de Circuito Amplificador', 'Diseñar un circuito amplificador con transistores', 'Rúbrica técnica, prueba de funcionamiento', '2025-10-22', 9),
(12, 30.00, 2, 'Sistema de Control Digital', 'Implementar sistema de control usando microcontrolador', 'Rúbrica de proyecto, demostración práctica', '2025-11-19', 10),
(13, 25.00, 1, 'Cálculo de Instalación Eléctrica Residencial', 'Diseñar instalación eléctrica residencial según normativa', 'Rúbrica técnica, planos', '2025-10-29', 11),
(14, 30.00, 1, 'Mantenimiento de Máquinas Eléctricas', 'Realizar mantenimiento preventivo y correctivo de motores', 'Lista de verificación, informe técnico', '2025-11-26', 12),
(15, 30.00, 1, 'Diseño de Pieza Mecánica en CAD', 'Diseñar pieza mecánica usando software CAD', 'Rúbrica técnica, planos normalizados', '2025-11-05', 13),
(16, 35.00, 2, 'Proyecto de Manufactura', 'Fabricar pieza mecánica aplicando procesos de manufactura', 'Rúbrica de proceso y producto, control de calidad', '2025-12-03', 14),
(17, 30.00, 1, 'Planificación Didáctica para Preescolar', 'Diseñar planificación didáctica para nivel inicial', 'Rúbrica de planificación, revisión pedagógica', '2025-10-29', 15),
(18, 25.00, 1, 'Material Didáctico para Primera Infancia', 'Elaborar material didáctico innovador para educación inicial', 'Rúbrica de creatividad, presentación', '2025-11-26', 16),
(19, 25.00, 1, 'Estrategias de Enseñanza de Matemáticas', 'Aplicar estrategias didácticas para enseñanza de matemáticas', 'Rúbrica de clase práctica, microenseñanza', '2025-11-05', 17),
(20, 30.00, 2, 'Proyecto de Intervención Educativa', 'Diseñar e implementar proyecto de intervención en comunidad educativa', 'Rúbrica de proyecto, informe de resultados', '2025-12-03', 18),
(21, 30.00, 1, 'Plan de Atención Individualizada', 'Elaborar plan de atención para estudiante con NEE', 'Rúbrica de planificación, estudio de caso', '2025-11-12', 19),
(22, 35.00, 1, 'Proyecto de Inclusión Educativa', 'Diseñar estrategias de inclusión para aula regular', 'Rúbrica de proyecto, presentación', '2025-12-12', 20),
(23, 0.00, 1, 'Evaluación de Excel', 'Diseño de tablas de Excel con apariencia visual atractiva y organización y cálculo de datos eficiente', 'Microsoft Excel, Fórmulas Excel, PCs laboratorio.', '2025-09-10', 5),
(24, 5.00, 1, 'Administración de bienes', 'Se tomará en cuenta la participación en clases e investigación antelada de temas discutidos en el aula de clase.', 'Cuaderno, participación', '2025-08-13', 1),
(25, 0.00, 1, 'Clasificación de Cuentas', 'Se evaluará el conocimiento previo del estudiante en el área de contabilidad al considerar su entendimiento de las cuentas del día a día', 'Lapiz, hoja, listado de cuentas ejemplo.', '2025-08-28', 2),
(28, 5.00, 1, 'Exposición de baloncesto', 'Se evaluará el conocimiento del estudiante sobre las reglas, técnicas e historia detrás del baloncesto', 'Exposición, lámina o diapositiva.', '2025-08-08', 3),
(29, 3.50, 1, 'Evaluación de Logaritmos Naturales', 'Aplicación de las propiedades de los logaritmos y resolución de ecuaciones con logaritmos', 'Lapiz, hoja ministro, guía de ejercicios.', '2025-08-29', 8),
(30, 0.00, 1, 'Ecuaciones de una sola variable', 'Se verán ecuaciones simples en donde la X esté dada por despejes y propiedades básicas del algebra. ', 'Lapiz, hoja.', '2025-08-01', 8),
(31, 0.00, 1, 'Diagnóstico de Aptitud Física', 'Se realizarán trotes, flexiones, estiramientos y carreras.', 'Cancha, cuerpo.', '2025-08-01', 3),
(33, 5.00, 1, 'Evaluación de Gramática y Acentuación', 'Se evaluará la aptitud gramatical y ortográfica del estudiante.', 'Errores gramaticales a corregir por el estudiante', '2025-08-05', 7),
(34, 5.00, 1, 'Lol', 'lol', 'jaja', '2025-08-18', 1),
(35, 5.00, 1, 'ewff', 'ewfewf', 'ewfewfef', '2025-08-13', 13),
(36, 5.00, 1, 'asddsd', 'asd', 'sad', '2025-08-06', 5),
(37, 5.00, 1, '2eff', 'ewfewf', 'wefwef', '2025-08-11', 6),
(38, 5.00, 1, 'wfdwefwef', 'ewfewf', 'wefwef', '2025-08-11', 1),
(39, 5.00, 1, 'ewfwef', 'qw', 'ewf', '2025-08-05', 4),
(40, 0.00, 1, 'grwfwef', 'ewffwe', 'wefwefwef', '2025-08-04', 1),
(41, 5.00, 1, 'ewfwefwe', 'wqddqwd', 'saxas', '2025-08-12', 4),
(42, 5.00, 1, 'rt', 'asdfa', 'asdf', '2025-08-19', 2),
(43, 5.00, 1, 'Aplicacion del verbo to-be', 'Entendimiento y conjugacion del verbo to-be en los distintos tiempos y situaciones', '14 ejercicios de completacion', '2025-08-04', 6),
(44, 5.00, 1, 'Exposicion de su Historia de Vida', 'Firmeza, seguridad y presentacion.', 'Observacion directa.', '2025-08-19', 7),
(45, 5.00, 1, 'Exposicion sobre Historia de los Estados', 'Conoce, detalla y manifiesta el conocimiento en la linea de tiempo de eventos del estado correspondiente', 'Observacion directa, analisis y preguntas.', '2025-12-03', 9);

-- --------------------------------------------------------

--
-- Table structure for table `evaluacion_realizada`
--

CREATE TABLE `evaluacion_realizada` (
  `cedula_evaluado` varchar(20) DEFAULT NULL,
  `cedula_evaluador` varchar(20) DEFAULT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `fecha_evaluado` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL,
  `id_evaluacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluacion_realizada`
--

INSERT INTO `evaluacion_realizada` (`cedula_evaluado`, `cedula_evaluador`, `observaciones`, `fecha_evaluado`, `fecha_actualizacion`, `id`, `id_evaluacion`) VALUES
('27000028', '12345689', 'Excelente implementación de algoritmos con buenas prácticas', '2025-10-16 09:30:00', '2025-10-16 09:30:00', 1, 1),
('27000029', '12345689', 'Buen trabajo, necesita mejorar la documentación del código', '2025-10-16 10:00:00', '2025-10-16 10:00:00', 2, 1),
('27000030', '12345689', 'Trabajo satisfactorio, cumple con los requisitos mínimos', '2025-10-16 10:30:00', '2025-10-16 10:30:00', 3, 1),
('27000028', '12345691', 'Diseño de base de datos bien normalizado y documentado', '2025-11-13 13:00:00', '2025-11-13 13:00:00', 4, 2),
('27000029', '12345691', 'Buen diseño, algunas relaciones podrían optimizarse', '2025-11-13 14:00:00', '2025-11-13 14:00:00', 5, 2),
('27000028', '12345693', 'Proyecto integrador sobresaliente, excelente trabajo en equipo', '2025-12-11 15:00:00', '2025-12-11 15:00:00', 6, 3),
('27000029', '12345693', 'Proyecto integrador sobresaliente, excelente trabajo en equipo', '2025-12-11 15:00:00', '2025-12-11 15:00:00', 7, 3),
('27000031', '12345689', 'Análisis correcto de algoritmos con buena comparación', '2025-10-30 08:00:00', '2025-10-30 08:00:00', 8, 4),
('27000032', '12345690', 'Configuración de red completamente funcional', '2025-11-27 09:00:00', '2025-11-27 09:00:00', 9, 5),
('27000003', '12345687', 'Análisis financiero completo y bien interpretado', '2025-11-20 10:00:00', '2025-11-20 10:00:00', 12, 7),
('27000004', '12345686', 'Excelente presentación del plan de marketing, muy creativo', '2025-11-06 14:00:00', '2025-11-06 14:00:00', 13, 8),
('27000005', '12345686', 'Excelente presentación del plan de marketing, muy creativo', '2025-11-06 14:00:00', '2025-11-06 14:00:00', 14, 8),
('27000022', '87654321', 'Registros contables precisos y estados financieros correctos', '2025-10-30 09:00:00', '2025-10-30 09:00:00', 15, 9),
('27000023', '87654321', 'Buen trabajo, algunos errores menores en clasificación', '2025-10-30 10:00:00', '2025-10-30 10:00:00', 16, 9),
('27000022', '12345680', 'Auditoría exhaustiva con hallazgos bien documentados', '2025-11-27 13:00:00', '2025-11-27 13:00:00', 17, 10),
('27000035', '12345694', 'Circuito amplificador funciona correctamente, buen diseño', '2025-10-23 08:00:00', '2025-10-23 08:00:00', 18, 11),
('27000036', '12345694', 'Diseño adecuado, necesita mejorar la ganancia', '2025-10-23 09:00:00', '2025-10-23 09:00:00', 19, 11),
('27000035', '12345695', 'Sistema de control digital muy bien implementado', '2025-11-20 10:00:00', '2025-11-20 10:00:00', 20, 12),
('27000037', '12345695', 'Sistema de control digital muy bien implementado', '2025-11-20 10:00:00', '2025-11-20 10:00:00', 21, 12),
('27000039', '12345699', 'Instalación eléctrica bien calculada según normativa', '2025-10-30 12:00:00', '2025-10-30 12:00:00', 22, 13),
('27000040', '12345702', 'Diagnóstico preciso y plan de mantenimiento completo', '2025-11-27 09:00:00', '2025-11-27 09:00:00', 23, 14),
('27000044', '12345704', 'Diseño CAD profesional con tolerancias correctas', '2025-11-06 13:00:00', '2025-11-06 13:00:00', 24, 15),
('27000044', '12345703', 'Pieza fabricada con excelente precisión y acabado', '2025-12-04 15:00:00', '2025-12-04 15:00:00', 25, 16),
('27000045', '12345703', 'Pieza fabricada con excelente precisión y acabado', '2025-12-04 15:00:00', '2025-12-04 15:00:00', 26, 16),
('27000049', '12345707', 'Planificación didáctica excelente, actividades muy apropiadas', '2025-10-30 14:00:00', '2025-10-30 14:00:00', 27, 17),
('27000050', '12345710', 'Material didáctico creativo y con buena fundamentación', '2025-11-27 10:00:00', '2025-11-27 10:00:00', 28, 18),
('27000055', '12345712', 'Microenseñanza efectiva con buenas estrategias didácticas', '2025-11-06 09:00:00', '2025-11-06 09:00:00', 29, 19),
('27000055', '12345711', 'Proyecto de intervención con resultados positivos', '2025-12-04 13:00:00', '2025-12-04 13:00:00', 30, 20),
('27000056', '12345711', 'Proyecto de intervención con resultados positivos', '2025-12-04 13:00:00', '2025-12-04 13:00:00', 31, 20),
('27000061', '12345715', 'Plan de atención individualizada bien estructurado', '2025-11-13 12:00:00', '2025-11-13 12:00:00', 32, 21),
('27000061', '12345716', 'Excelente proyecto de inclusión con estrategias viables', '2025-12-11 14:00:00', '2025-12-11 14:00:00', 33, 22);

-- --------------------------------------------------------

--
-- Table structure for table `horario_eval`
--

CREATE TABLE `horario_eval` (
  `id_eval` int(11) NOT NULL,
  `id_horario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `horario_eval`
--

INSERT INTO `horario_eval` (`id_eval`, `id_horario`) VALUES
(1, 1),
(2, 2),
(3, 14),
(4, 5),
(5, 15),
(6, 2),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 10),
(24, 2),
(25, 4),
(28, 6),
(29, 15),
(30, 15),
(31, 6),
(33, 13),
(34, 1),
(35, 24),
(36, 10),
(37, 11),
(38, 1),
(39, 7),
(40, 1),
(41, 7),
(42, 3),
(43, 11);

-- --------------------------------------------------------

--
-- Table structure for table `horario_eval_clandestina`
--

CREATE TABLE `horario_eval_clandestina` (
  `id` int(11) NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL,
  `id_eval` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `horario_eval_clandestina`
--

INSERT INTO `horario_eval_clandestina` (`id`, `hora_inicio`, `hora_cierre`, `id_eval`) VALUES
(2, '10:05:00', '12:05:00', 45),
(3, '08:00:00', '10:00:00', 44);

-- --------------------------------------------------------

--
-- Table structure for table `horario_seccion`
--

CREATE TABLE `horario_seccion` (
  `id` int(11) NOT NULL,
  `dia` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') DEFAULT NULL,
  `aula` varchar(50) DEFAULT NULL,
  `modalidad` enum('Presencial','Virtual','Semipresencial') DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL,
  `id_seccion` int(11) DEFAULT NULL,
  `dia_num` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `horario_seccion`
--

INSERT INTO `horario_seccion` (`id`, `dia`, `aula`, `modalidad`, `hora_inicio`, `hora_cierre`, `id_seccion`, `dia_num`) VALUES
(1, 'Lunes', 'A-101', 'Presencial', '08:00:00', '10:00:00', 1, 0),
(2, 'Miércoles', 'A-101', 'Presencial', '08:00:00', '10:00:00', 1, 2),
(3, 'Martes', 'A-102', 'Presencial', '10:00:00', '12:00:00', 2, 1),
(4, 'Jueves', 'A-102', 'Presencial', '10:00:00', '12:00:00', 2, 3),
(5, 'Lunes', 'A-103', 'Semipresencial', '14:00:00', '16:00:00', 3, 0),
(6, 'Miércoles', 'A-103', 'Virtual', '14:00:00', '16:00:00', 3, 4),
(7, 'Martes', 'B-201', 'Presencial', '08:00:00', '10:00:00', 4, 1),
(8, 'Jueves', 'B-201', 'Presencial', '08:00:00', '10:00:00', 4, 3),
(9, 'Lunes', 'B-202', 'Presencial', '10:00:00', '12:00:00', 5, 0),
(10, 'Miércoles', 'B-202', 'Presencial', '10:00:00', '12:00:00', 5, 2),
(11, 'Lunes', 'LAB-301', 'Presencial', '08:00:00', '11:00:00', 6, 0),
(12, 'Miércoles', 'LAB-301', 'Presencial', '08:00:00', '11:00:00', 6, 2),
(13, 'Martes', 'LAB-302', 'Presencial', '14:00:00', '17:00:00', 7, 1),
(14, 'Jueves', 'LAB-302', 'Presencial', '14:00:00', '17:00:00', 7, 3),
(15, 'Viernes', 'LAB-303', 'Presencial', '08:00:00', '11:00:00', 8, 4),
(16, 'Lunes', 'LAB-401', 'Presencial', '08:00:00', '10:00:00', 9, 0),
(17, 'Miércoles', 'LAB-401', 'Presencial', '08:00:00', '10:00:00', 9, 2),
(18, 'Martes', 'LAB-402', 'Presencial', '10:00:00', '12:00:00', 10, 1),
(19, 'Jueves', 'LAB-402', 'Presencial', '10:00:00', '12:00:00', 10, 3),
(20, 'Lunes', 'LAB-501', 'Presencial', '14:00:00', '16:00:00', 11, 0),
(21, 'Miércoles', 'LAB-501', 'Presencial', '14:00:00', '16:00:00', 11, 2),
(22, 'Martes', 'LAB-502', 'Presencial', '08:00:00', '10:00:00', 12, 1),
(23, 'Lunes', 'TALLER-601', 'Presencial', '08:00:00', '11:00:00', 13, 0),
(24, 'Miércoles', 'TALLER-601', 'Presencial', '08:00:00', '11:00:00', 13, 2),
(25, 'Viernes', 'TALLER-602', 'Presencial', '14:00:00', '17:00:00', 14, 4),
(26, 'Martes', 'ED-101', 'Presencial', '08:00:00', '10:00:00', 15, 1),
(27, 'Jueves', 'ED-101', 'Presencial', '08:00:00', '10:00:00', 15, 3),
(28, 'Lunes', 'ED-102', 'Semipresencial', '10:00:00', '12:00:00', 16, 0),
(29, 'Miércoles', 'ED-102', 'Virtual', '10:00:00', '12:00:00', 16, 2),
(30, 'Martes', 'ED-201', 'Presencial', '14:00:00', '16:00:00', 17, 1),
(31, 'Jueves', 'ED-201', 'Presencial', '14:00:00', '16:00:00', 17, 3),
(32, 'Viernes', 'ED-202', 'Presencial', '08:00:00', '10:00:00', 18, 4),
(33, 'Lunes', 'ED-301', 'Presencial', '08:00:00', '10:00:00', 19, 0),
(34, 'Miércoles', 'ED-301', 'Presencial', '08:00:00', '10:00:00', 19, 2),
(35, 'Martes', 'ED-302', 'Semipresencial', '10:00:00', '12:00:00', 20, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inscripcion_seccion`
--

CREATE TABLE `inscripcion_seccion` (
  `cedula_estudiante` varchar(20) NOT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` mediumtext DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_seccion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inscripcion_seccion`
--

INSERT INTO `inscripcion_seccion` (`cedula_estudiante`, `fecha_inscripcion`, `observaciones`, `fecha_creacion`, `fecha_actualizacion`, `id_seccion`) VALUES
('27000001', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000001', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000001', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000002', '2025-02-01 08:15:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000002', '2025-02-01 08:45:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000003', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000003', '2025-02-01 09:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000004', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000004', '2025-02-01 10:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000005', '2025-02-01 13:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000005', '2025-02-01 13:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000006', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000006', '2025-02-02 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000007', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000007', '2025-02-02 09:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000008', '2025-02-02 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000009', '2025-02-02 13:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000010', '2025-02-02 14:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000011', '2025-02-03 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000011', '2025-02-03 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000012', '2025-02-03 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000012', '2025-02-03 09:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000013', '2025-02-03 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000014', '2025-02-03 13:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000015', '2025-02-03 14:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000016', '2025-02-04 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000017', '2025-02-04 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000018', '2025-02-04 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000019', '2025-02-04 13:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 1),
('27000020', '2025-02-04 14:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 2),
('27000021', '2025-02-04 15:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 3),
('27000022', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4),
('27000022', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 5),
('27000023', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4),
('27000023', '2025-02-01 09:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 5),
('27000024', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4),
('27000025', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 5),
('27000026', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 4),
('27000027', '2025-02-02 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 5),
('27000028', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6),
('27000028', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 7),
('27000028', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8),
('27000029', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6),
('27000029', '2025-02-01 09:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 7),
('27000030', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6),
('27000030', '2025-02-01 10:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8),
('27000031', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 7),
('27000032', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6),
('27000033', '2025-02-02 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 8),
('27000034', '2025-02-02 13:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 6),
('27000035', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 9),
('27000035', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 10),
('27000036', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 9),
('27000037', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 10),
('27000038', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 9),
('27000039', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 11),
('27000039', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 12),
('27000040', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 11),
('27000041', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 12),
('27000042', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 11),
('27000043', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 12),
('27000044', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 13),
('27000044', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 14),
('27000045', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 13),
('27000046', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 14),
('27000047', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 13),
('27000048', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 14),
('27000049', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 15),
('27000049', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 16),
('27000050', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 15),
('27000051', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 16),
('27000052', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 15),
('27000053', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 16),
('27000054', '2025-02-02 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 15),
('27000055', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 17),
('27000055', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 18),
('27000056', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 17),
('27000057', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 18),
('27000058', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 17),
('27000059', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 18),
('27000060', '2025-02-02 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 17),
('27000061', '2025-02-01 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 19),
('27000061', '2025-02-01 08:30:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 20),
('27000062', '2025-02-01 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 19),
('27000063', '2025-02-01 10:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 20),
('27000064', '2025-02-02 08:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 19),
('27000065', '2025-02-02 09:00:00', 'Inscripción regular', '2026-02-16 18:27:43', '2026-02-16 18:27:43', 20);

-- --------------------------------------------------------

--
-- Table structure for table `materia`
--

CREATE TABLE `materia` (
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materia`
--

INSERT INTO `materia` (`codigo`, `nombre`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('ACC-220', 'ACTIVIDADES COMPLEMENTARIAS (Ed. Física)', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ACC-320', 'ACTIVIDADES COMPLEMENTARIAS (Ed Física)', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ACC-531', 'ACTIVIDADES COMPLEMENTARIAS II(Proyectos Productivos)', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ADE-333', 'ADMINISTRACION DE EMPRESAS', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ADE-433', 'ADMINISTRACION DE EMPRESAS', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ADE-533', 'ADMINISTRACIÓN DE EMPRESAS', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ADG-143', 'ADMINISTRACIÓN GENERAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ADP-443', 'ADMINISTRACIÓN DE LA PRODUCCIÓN', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ADS-433', 'ANALISIS Y DISEÑO DE SISTEMAS', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ADS-643', 'ANALISIS Y DISEÑO DE SISTEMAS DIGITALES', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ALP-265', 'ALGORITMO Y PROGRAMACION I', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ALP-365', 'ALGORITMO Y PROGRAMACION II', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ANF-222', 'ANTROPOLOGIA FILOSOFICA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ANF-233', 'ANTROPOLOGIA FILOSOFICA', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ANF-433', 'ANTROPOLOGÍA FILOSÓFICA', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ANF-443', 'ANÁLISIS FINANCIERO I', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ANF-543', 'ANÁLISIS FINANCIERO II', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('APL-543', 'APRENDIZAJE DE LA LECTURA Y ESCRITURA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('ARC-265', 'ARQUITECTURA Y ESTRUCTURA DEL COMPUTADOR', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ARC-454', 'ARQUITECTURA DE REDES DE COMPUTADORES', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ART-243', 'ARTES PLÁSTICAS', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('ATH-443', 'ADMINISTRACIÓN DE TALENTO HUMANO', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('AUA-543', 'AUDITORÍA ADMINISTRATIVA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('AUD-443', 'AUDITORÍA I', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('AUD-532', 'AUDITORÍA II', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('AUT-443', 'AUTOMATISMOS', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('AUT-643', 'AUTOMATISMOS', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('CAL-265', 'CALCULO I', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('CAL-365', 'CALCULO II', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('CCA-532', 'CONTABILIDAD DE COSTOS APLICADO', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('CIE-243', 'CIRCUITOS ELECTRICOS I', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('CIE-343', 'CIRCUITOS ELECTRICOS II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('CIE-432', 'CREATIVIDAD INNOVACIÓN Y EMPRENDIMIENTO', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('CIN-343', 'CIENCIAS DE LA NATURALEZA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('COC-443', 'CONTABILIDAD DE COSTOS', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('COC-464', 'CONTABILIDAD DE COSTOS', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('COC-532', 'CONTROL DE CALIDAD', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('COE-543', 'CONTABILIDAD ESPECIALIZADA', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('COG-164', 'CONTABILIDAD GENERAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('COG-432', 'CONTABILIDAD GERENCIAL', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('COG-532', 'CONTABILIDAD GUBERNAMENTAL', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('COI-243', 'CONTABILIDAD INTERMEDIA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('CON-464', 'CONTROL NUMÉRICO I', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('CON-544', 'CONTABILIDAD COMPUTARIZADA', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('CON-564', 'CONTROL NUMÉRICO II', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('COS-364', 'CONTABILIDAD SUPERIOR', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('CRE-543', 'CREATIVIDAD LITERARIA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('CSC-343', 'CIENCIAS SOCIALES Y CULTURA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DEE-364', 'DISEÑO DE EQUIPOS ELECTRONICOS I', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('DEE-443', 'DISEÑO DE EQUIPOS ELECTRONICOS II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('DEE-543', 'DISEÑO DE EQUIPOS ELECTRONICOS III', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('DEE-643', 'DISEÑO DE EQUIPOS ELECTRONICOS IV', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('DEI-543', 'DESARROLLO DE LA INTELIGENCIA', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('DIA-543', 'DIFICULTADES DEL APRENDIZAJE', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('DIC-443', 'DIDÁCTICA DE LAS CIENCIAS NATURALES', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('DIC-543', 'DIDÁCTICA DE LAS CIENCIAS NATURALES', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DIG-243', 'DIDÁCTICA GENERAL', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DII-132', 'DIBUJO INDUSTRIAL I', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('DII-242', 'DIBUJO INDUSTRIAL II', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('DII-343', 'DIBUJO INDUSTRIAL III', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('DIL-443', 'DIDÁCTICA DEL LENGUAJE', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('DIM-443', 'DIDÁCTICA DE LAS MATEMÁTICAS', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('DIS-443', 'DIDÁCTICA DE LAS CIENCIAS SOCIALES', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('DPC-443', 'DIDÁCTICA DE LOS PROCESOS COGNITIVOS', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DPS-432', 'DIDÁCTICA DE LOS PROCESOS PSICOMOTOROS', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DPS-543', 'DIDÁCTICA DE LOS PROCESOS SOCIOEMOCIONALES', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('DVE-343', 'DERECHOS HUMANOS VALORES Y ÉTICA PROFESIONAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('DVH-232', 'DERECHOS HUMANOS, VALORES Y ÉTICA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('EAS-432', 'ECOLOGÍA AMBIENTE Y SUSTENTABILIDAD', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('EDA-422', 'EDUCACION AMBIENTAL', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('EDI-443', 'EVALUACIÓN Y DESARROLLO INFANTIL', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('EDT-543', 'EDUCACIÓN EN Y PARA EL TRABAJO', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('EFD-132', 'EDUCACIÓN FÍSICA Y DEPORTE', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('EFL-132', 'EDUCACIÓN FÍSICA Y LÚDICA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('ELE-343', 'ELECTRONICA I', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ELE-354', 'ELECTRICIDAD', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ELE-365', 'ELECTROTECNIA I', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELE-374', 'ELECTRONICA I', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELE-432', 'ELECTROTECNIA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ELE-443', 'ELECTRONICA II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ELE-465', 'ELECTROTECNIA II', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELE-543', 'ELECTRONICA III', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ELE-565', 'ELECTROTECNIA III', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELE-664', 'ELECTROTECNIA IV', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELI-532', 'ELECTRONICA INDUSTRIAL', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('ELT-622', 'ELECTIVA', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('EMU-532', 'EXPRESIÓN MUSICAL', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('EPS-432', 'EDUCACIÓN, PEDAGOGÍA Y SOCIEDAD', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('ESA-343', 'ESTADISTICA I', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ESA-444', 'ESTADISTICA APLICADA', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ETF-522', 'ETICA FUNDAMENTAL', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ETI-343', 'ESTADÍSTICA INFERENCIAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ETM-232', 'ESTADÍSTICA METODOLÓGICA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ETP-422', 'ÉTICA PROFESIONAL', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ETP-522', 'ETICA PROFESIONAL', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('EVA-543', 'EVALUACIÓN DE LOS APRENDIZAJES', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('EVP-532', 'EVALUACIÓN DE PROYECTOS', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FIS-143', 'FISICA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('FOC-100', 'FORMACIÓN COMPLEMENTARIA I', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOC-200', 'FORMACIÓN COMPLEMENTARIA II', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOC-300', 'FORMACIÓN COMPLEMENTARIA III', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOC-400', 'FORMACIÓN COMPLEMENTARIA IV', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOC-500', 'FORMACIÓN COMPLEMENTARIA V', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOC-600', 'FORMACIÓN COMPLEMENTARIA VI', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOH-132', 'FORMACIÓN HUMANA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('FOH-143', 'FORMACIÓN HUMANA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('GAM-432', 'GESTIÓN AMBIENTAL', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('GDD-133', 'GEOMETRIA DESCRIPTIVA Y DIBUJO I', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('GDD-233', 'GEOMETRIA DESCRIPTIVA Y DIBUJO II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('GEA-432', 'GESTIÓN ADUANERA', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('GET-443', 'GESTIÓN TRIBUTARIA', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('HSI-432', 'HIGIENE Y SEGURIDAD INDUSTRIAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('IFE-243', 'INFORMÁTICA EDUCATIVA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('IGL-332', 'INGLES III', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('ILU-532', 'ILUMINACION', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('IMI-222', 'INTROD. A LA METODOLOGIA DE LA INVESTIGACION', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('INA-232', 'INFORMÁTICA APLICADA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('INC-353', 'INTRODUCCIÓN A LA COMPUTACIÓN', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('INC-533', 'INTRODUCCION A LAS COMUNICACIONES', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('INE-243', 'INTRODUCCION A LA ELECTRONICA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('INE-332', 'INSTALACIONES ELECTRICAS I', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('INE-454', 'INSTALACIONES ELECTRICAS II', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('INE-532', 'INSTALACIONES ELECTRICAS III', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('INE-543', 'INSTRUMENTACION ELECTRONICA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('INF-432', 'INFORMATICA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ING-122', 'INGLES I', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ING-132', 'INGLÉS I', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ING-143', 'INGLÉS I', '2026-01-05 17:44:51', '2026-01-05 17:44:51'),
('ING-222', 'INGLÉS II', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('ING-232', 'INGLÉS II', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('ING-233', 'INGLES II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('ING-243', 'INGLÉS II', '2026-01-05 17:44:51', '2026-01-05 17:44:51'),
('ING-332', 'INGLÉS III', '2026-01-05 17:44:51', '2026-01-05 17:44:51'),
('INI-154', 'INTRODUCCION A LA INFORMATICA', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('INM-532', 'INVESTIGACIÓN DE MERCADO', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('INO-544', 'INVESTIGACION DE OPERACIONES', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('INS-354', 'INGENIERIA DEL SOFTWARE', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('INU-554', 'INTERFACES WEB CON EL USUARIO', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('IVE-543', 'INVESTIGACIÓN EDUCATIVA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('LEC-143', 'LENGUAJE Y COMUNICACIÓN I', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('LEC-243', 'LENGUAJE Y COMUNICACIÓN II', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('LEL-232', 'LEGISLACIÓN LABORAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('LEM-232', 'LEGISLACIÓN MERCANTIL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('LET-343', 'LEGISLACIÓN TRIBUTARIA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('LIE-532', 'LINEAS ELECTRICAS', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('LIM-253', 'LABORATORIO DE INSTRUMENTACION Y MEDICIONES', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('LOC-154', 'LOGICA COMPUTACIONAL', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('MAA-243', 'MATEMÁTICA APLICADA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MAE-332', 'MACROECONOMÍA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MAF-343', 'MATEMÁTICA FINANCIERA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MAG-143', 'MATEMÁTICAS GENERAL', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MAG-364', 'MATEMÁTICA GENERAL', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('MAH-175', 'MAQUINAS Y HERRAMIENTAS I', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MAH-264', 'MÁQUINAS Y HERRAMIENTAS II', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MAH-364', 'MAQUINAS Y HERRAMIENTAS III', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MAH-464', 'MÁQUINAS Y HERRAMIENTAS IV', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MAI-543', 'MANTENIMIENTO INDUSTRIAL', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MAT-165', 'MATEMATICA I', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('MAT-265', 'MATEMATICA II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('MAT-365', 'MATEMATICA III', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('MAT-432', 'MATEMATICAS IV', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('MEI-132', 'METODOLOGÍA DE LA INVESTIGACIÓN', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('MEI-522', 'METODOLOGIA DE LA INVESTIGACION', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('MEI-532', 'METODOLOGÍA DE LA INVESTIGACIÓN', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('MEI-533', 'METODOLOGÍA DE LA INVESTIGACIÓN', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('MET-332', 'MERCADOTÉCNIA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MIC-232', 'MICROECONOMÍA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('MIC-543', 'MICROPROCESADORES', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('MIE-532', 'METODOLOGÍA DE LA INVESTIGACIÓN', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('OEE-332', 'ORGANIZACIÓN DE LA ENTIDAD ECONÓMICA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('OFE-332', 'ORIENTACIÓN FAMILIAR Y EDUCATIVA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PAP-604', 'PASANTIA PROFESIONAL', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('PAT-543', 'PREVENCIÓN Y ATENCIÓN TEMPRANA', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('PDD-443', 'PEDAGOGÍA DE LA DIDÁCTICA DIFERENCIAL', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('PDE-443', 'PLANIFICACIÓN DE LA ENSEÑANZA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PEA-443', 'PLANIFICACIÓN Y EVALUACIÓN PARA LA ATENCIÓN EDUCATIVA ESPECIAL', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('PEE-343', 'PLANIFICACIÓN Y EVALUACIÓN EDUCATIVA', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PEL-443', 'PENSAMIENTO Y LENGUAJE', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PLE-632', 'PLANTAS ELECTRICAS', '2026-01-05 20:07:29', '2026-01-05 20:07:29'),
('PNE-443', 'PLANIFICACIÓN DE LA ENSEÑANZA', '2026-01-05 20:28:17', '2026-01-05 20:28:17'),
('PPP-443', 'PRESUPUESTO PÚBLICO Y PRIVADO', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('PRA-145', 'PRÁCTICA I', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRA-245', 'PRÁCTICA II', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRA-345', 'PRÁCTICA III', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRA-445', 'PRÁCTICA IV', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRA-545', 'PRÁCTICA V', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRA-647', 'PRÁCTICA VI', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PRE-543', 'PSICOPEDAGOGÍA DE LOS PROBLEMAS EMOCIONALES', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('PSA-254', 'PSICOLOGÍA DEL APRENDIZAJE', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PSD-154', 'PSICOLOGÍA DEL DESARROLLO', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('PSE-443', 'PSICOLOGÍA DE EDUCACIÓN ESPECIAL', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('PSI-543', 'PSICOPATOLOGÍA', '2026-01-05 20:36:17', '2026-01-05 20:36:17'),
('RSP-132', 'REALIDAD SOCIAL ECONÓMICA Y POLÍTICA DE VZLA', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('RSP-133', 'REALIDAD SOCIAL Y POLITICA DE VENEZUELA', '2026-01-05 18:01:21', '2026-01-05 18:01:21'),
('RSP-233', 'REALIDAD SOCIAL Y POLÍTICA DE VENEZUELA', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('SAM-343', 'SALUD Y AMBIENTE', '2026-01-05 20:16:14', '2026-01-05 20:16:14'),
('SBD-454', 'SISTEMA DE BASE DE DATOS', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('SDI-554', 'SISTEMAS DE INFORMACION GERENCIAL', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('SHI-222', 'SEGURIDAD E HIGIENE INDUSTRIAL', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('SHI-422', 'SEGURIDAD E HIGIENE INDUSTRIAL', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('SIC-543', 'SISTEMAS DE INFORMACIÓN CONTABLE', '2026-01-05 17:22:51', '2026-01-05 17:22:51'),
('SIC-643', 'SISTEMAS DE COMUNICACIONES', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('SIF-332', 'SISTEMAS FINANCIEROS', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('SIO-454', 'SISTEMA DE OPERACION I', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('SIO-554', 'SISTEMAS OPERATIVOS II', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('SPA-443', 'SISTEMAS Y PROCEDIMIENTOS ADMINISTRATIVOS', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('SPP-605', 'PASANTÍA PROFESIONAL (SISTEMATIZACIÓN)', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('TDP-532', 'TÉCNICAS DE PLANIFICACIÓN', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('TEC-144', 'TECNOLOGIA I', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('TEC-154', 'TECNOLOGIA', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('TEC-244', 'TECNOLOGÍA II', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('TEC-344', 'TECNOLOGÍA III', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('TEC-444', 'TECNOLOGÍA IV', '2026-01-05 20:12:08', '2026-01-05 20:12:08'),
('TED-343', 'TECNICAS DIGITALES I', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('TED-443', 'TECNICAS DIGITALES II', '2026-01-05 19:59:10', '2026-01-05 19:59:10'),
('TEG-606', 'TRABAJO ESPECIAL DE GRADO', '2026-01-05 17:34:56', '2026-01-05 17:34:56'),
('TEP-543', 'TÉCNICAS PRESUPUESTARIAS', '2026-01-05 17:09:25', '2026-01-05 17:09:25'),
('TID-122', 'TECNICAS DE INVESTIGACION DOCUMENTAL', '2026-01-05 17:34:56', '2026-01-05 17:34:56');

-- --------------------------------------------------------

--
-- Table structure for table `nivel_desempeno`
--

CREATE TABLE `nivel_desempeno` (
  `criterio_id` int(11) NOT NULL,
  `nombre_nivel` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `puntaje_maximo` decimal(5,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `orden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nivel_desempeno`
--

INSERT INTO `nivel_desempeno` (`criterio_id`, `nombre_nivel`, `descripcion`, `puntaje_maximo`, `fecha_creacion`, `fecha_actualizacion`, `orden`) VALUES
(1, 'Excelente', 'Excelente: Identificación completa, precisa y detallada de todos los requerimientos con priorización clara', 20.00, '2026-02-16 18:27:43', '2026-02-16 20:37:03', 1),
(1, 'Bueno', 'Bueno: Identificación adecuada de la mayoría de requerimientos con algunos detalles menores faltantes', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:37:13', 2),
(1, 'Suficiente', 'Suficiente: Identificación básica de requerimientos principales pero con omisiones importantes', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:37:20', 3),
(1, 'Insuficiente', 'Insuficiente: Requerimientos incompletos, confusos o incorrectos', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:40:52', 4),
(2, 'Excelente', 'Excelente: Diseño completo, coherente y profesional con todos los diagramas necesarios', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:40:57', 1),
(2, 'Bueno', 'Bueno: Diseño adecuado con la mayoría de componentes bien estructurados', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:09', 2),
(2, 'Suficiente', 'Suficiente: Diseño básico que cumple mínimamente con lo requerido', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:43:20', 3),
(2, 'Insuficiente', 'Insuficiente: Diseño incompleto, incoherente o con errores significativos', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(3, 'Excelente', 'Excelente: Código limpio, eficiente, totalmente funcional y con excelentes prácticas', 30.00, '2026-02-16 18:27:43', '2026-02-16 20:41:01', 1),
(3, 'Bueno', 'Bueno: Código funcional con buenas prácticas y estructura adecuada', 23.00, '2026-02-16 18:27:43', '2026-02-16 20:42:11', 2),
(3, 'Suficiente', 'Suficiente: Código funcional pero con prácticas de programación mejorables', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:43:41', 3),
(3, 'Insuficiente', 'Insuficiente: Código con errores, mal estructurado o no funcional', 8.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(4, 'Excelente', 'Excelente: Pruebas exhaustivas, documentadas y con cobertura completa', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:41:06', 1),
(4, 'Bueno', 'Bueno: Pruebas adecuadas cubriendo los casos principales', 11.00, '2026-02-16 18:27:43', '2026-02-16 20:42:13', 2),
(4, 'Suficiente', 'Suficiente: Pruebas básicas pero incompletas', 8.00, '2026-02-16 18:27:43', '2026-02-16 20:43:43', 3),
(4, 'Insuficiente', 'Insuficiente: Pruebas insuficientes o ausentes', 4.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(5, 'Excelente', 'Excelente: Documentación completa, clara y profesional', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:41:09', 1),
(5, 'Bueno', 'Bueno: Documentación adecuada con información suficiente', 8.00, '2026-02-16 18:27:43', '2026-02-16 20:42:15', 2),
(5, 'Suficiente', 'Suficiente: Documentación básica pero incompleta', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:43:46', 3),
(5, 'Insuficiente', 'Insuficiente: Documentación deficiente o ausente', 3.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(6, 'Excelente', 'Excelente: Dominio total del tema con profundidad y relevancia destacada', 30.00, '2026-02-16 18:27:43', '2026-02-16 20:41:12', 1),
(6, 'Bueno', 'Bueno: Buen dominio del tema con información relevante', 23.00, '2026-02-16 18:27:43', '2026-02-16 20:42:18', 2),
(6, 'Suficiente', 'Suficiente: Conocimiento básico del tema', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:43:49', 3),
(6, 'Insuficiente', 'Insuficiente: Conocimiento limitado o información irrelevante', 8.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(7, 'Excelente', 'Excelente: Estructura perfectamente organizada y coherente', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:14', 1),
(7, 'Bueno', 'Bueno: Buena organización con estructura lógica', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:20', 2),
(7, 'Suficiente', 'Suficiente: Organización básica pero mejorable', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:43:51', 3),
(7, 'Insuficiente', 'Insuficiente: Desorganizado o sin estructura clara', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(8, 'Excelente', 'Excelente: Comunicación clara, fluida y efectiva con excelente manejo del tiempo', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:17', 1),
(8, 'Bueno', 'Bueno: Comunicación adecuada y comprensible', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:22', 2),
(8, 'Suficiente', 'Suficiente: Comunicación básica con algunas dificultades', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:43:54', 3),
(8, 'Insuficiente', 'Insuficiente: Comunicación deficiente o confusa', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(9, 'Excelente', 'Excelente: Material profesional, atractivo y altamente efectivo', 20.00, '2026-02-16 18:27:43', '2026-02-16 20:41:21', 1),
(9, 'Bueno', 'Bueno: Material de buena calidad que apoya la presentación', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:42:24', 2),
(9, 'Suficiente', 'Suficiente: Material básico pero funcional', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:43:57', 3),
(9, 'Insuficiente', 'Insuficiente: Material deficiente o ausente', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(10, 'Excelente', 'Excelente: Participación constante, proactiva y de alta calidad', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:44:14', 1),
(10, 'Bueno', 'Bueno: Participación regular y efectiva', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:44:20', 2),
(10, 'Suficiente', 'Suficiente: Participación básica pero limitada', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:23', 3),
(10, 'Insuficiente', 'Insuficiente: Participación mínima o ausente', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:44:29', 4),
(11, 'Excelente', 'Excelente: Comunicación excepcional y escucha activa ejemplar', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:26', 1),
(11, 'Bueno', 'Bueno: Buena comunicación y escucha efectiva', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:30', 2),
(11, 'Suficiente', 'Suficiente: Comunicación básica adecuada', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:33', 3),
(11, 'Insuficiente', 'Insuficiente: Comunicación deficiente', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(12, 'Excelente', 'Excelente: Excelente capacidad para resolver conflictos constructivamente', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:29', 1),
(12, 'Bueno', 'Bueno: Buena gestión de diferencias', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:32', 2),
(12, 'Suficiente', 'Suficiente: Manejo básico de conflictos', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:36', 3),
(12, 'Insuficiente', 'Insuficiente: Dificultad para manejar conflictos', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(13, 'Excelente', 'Excelente: Cumplimiento total y puntual de todos los compromisos', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:33', 1),
(13, 'Bueno', 'Bueno: Buen cumplimiento de la mayoría de compromisos', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:35', 2),
(13, 'Suficiente', 'Suficiente: Cumplimiento básico con algunos retrasos', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:38', 3),
(13, 'Insuficiente', 'Insuficiente: Incumplimiento frecuente de compromisos', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(14, 'Excelente', 'Excelente: Marco teórico sólido, actualizado y ampliamente referenciado', 20.00, '2026-02-16 18:27:43', '2026-02-16 20:41:36', 1),
(14, 'Bueno', 'Bueno: Buen marco teórico con referencias adecuadas', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:42:38', 2),
(14, 'Suficiente', 'Suficiente: Marco teórico básico', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:44:41', 3),
(14, 'Insuficiente', 'Insuficiente: Marco teórico débil o insuficiente', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(15, 'Excelente', 'Excelente: Metodología rigurosa, bien justificada y apropiada', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:41', 1),
(15, 'Bueno', 'Bueno: Metodología adecuada y coherente', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:40', 2),
(15, 'Suficiente', 'Suficiente: Metodología básica', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:44', 3),
(15, 'Insuficiente', 'Insuficiente: Metodología inadecuada o mal aplicada', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(16, 'Excelente', 'Excelente: Análisis riguroso, profundo y bien fundamentado', 25.00, '2026-02-16 18:27:43', '2026-02-16 20:41:44', 1),
(16, 'Bueno', 'Bueno: Buen análisis con interpretación adecuada', 19.00, '2026-02-16 18:27:43', '2026-02-16 20:42:43', 2),
(16, 'Suficiente', 'Suficiente: Análisis básico', 13.00, '2026-02-16 18:27:43', '2026-02-16 20:44:47', 3),
(16, 'Insuficiente', 'Insuficiente: Análisis superficial o incorrecto', 7.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(17, 'Excelente', 'Excelente: Conclusiones coherentes, fundamentadas y relevantes', 20.00, '2026-02-16 18:27:43', '2026-02-16 20:41:47', 1),
(17, 'Bueno', 'Bueno: Conclusiones adecuadas y coherentes', 15.00, '2026-02-16 18:27:43', '2026-02-16 20:42:45', 2),
(17, 'Suficiente', 'Suficiente: Conclusiones básicas', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:44:49', 3),
(17, 'Insuficiente', 'Insuficiente: Conclusiones débiles o incoherentes', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(18, 'Excelente', 'Excelente: Formato impecable y referencias completas', 10.00, '2026-02-16 18:27:43', '2026-02-16 20:41:49', 1),
(18, 'Bueno', 'Bueno: Buen formato y referencias adecuadas', 8.00, '2026-02-16 18:27:43', '2026-02-16 20:42:47', 2),
(18, 'Suficiente', 'Suficiente: Formato y referencias aceptables', 5.00, '2026-02-16 18:27:43', '2026-02-16 20:44:51', 3),
(18, 'Insuficiente', 'Insuficiente: Formato deficiente o referencias incompletas', 3.00, '2026-02-16 18:27:43', '2026-02-16 20:45:26', 4),
(24, 'Sobresaliente', 'wefd', 10.00, '2026-02-24 22:04:22', '2026-02-24 22:04:22', 1),
(24, 'Notable', 'wdf', 7.50, '2026-02-24 22:04:22', '2026-02-24 22:04:22', 2),
(24, 'Aprobado', 'wdsf', 5.00, '2026-02-24 22:04:22', '2026-02-24 22:04:22', 3),
(24, 'Insuficiente', 'wsdf', 2.50, '2026-02-24 22:04:22', '2026-02-24 22:04:22', 4),
(25, 'Sobresaliente', 'Identifica con precisión las NIIF aplicables (ej. NIIF 8, NIC 1) y las leyes de inclusión laboral locales. Analiza su interacción de forma crítica y profunda.', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(25, 'Notable', 'Identifica las principales NIIF y leyes aplicables. El análisis es correcto, pero poco profundo en cuanto a su interacción.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(25, 'Aprobado', 'Menciona algunas normas generales, pero no logra vincularlas correctamente con el contexto de inclusión o comete errores menores.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(25, 'Insuficiente', 'No identifica la normativa aplicable o el análisis es incorrecto e irrelevante para el caso.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4),
(26, 'Sobresaliente', 'Propone un plan de cuentas adaptado (ej. usando pictogramas, códigos de color o simplificación) que es funcional, claro y cumple con los principios contables.', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(26, 'Notable', 'Propone un plan de cuentas adaptado, pero presenta algunas limitaciones prácticas para su implementación real por el usuario final.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(26, 'Aprobado', 'La adaptación propuesta es muy básica, poco funcional o no se alinea completamente con los principios contables.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(26, 'Insuficiente', 'No presenta una propuesta de adaptación o esta es inviable e incorrecta.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4),
(27, 'Sobresaliente', 'Diseña un modelo de estado financiero (ej. Estado de Resultados) en formato accesible (ej. lectura fácil, apoyo visual) sin perder rigor técnico.', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(27, 'Notable', 'Diseña un modelo accesible, pero sacrifica parte de la información técnica necesaria o viceversa.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(27, 'Aprobado', 'La propuesta de estado financiero es estándar, sin evidencia de adaptación para la inclusión.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(27, 'Insuficiente', 'No presenta una propuesta de estado financiero o es completamente incorrecta.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4),
(28, 'Sobresaliente', 'Justifica la viabilidad económica y operativa de la propuesta con argumentos sólidos, identificando beneficios (ej. retención de talento) y costos.', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(28, 'Notable', 'Justifica la viabilidad, pero el análisis es superficial o carece de datos concretos sobre la relación costo-beneficio.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(28, 'Aprobado', 'Presenta una justificación débil, sin abordar la viabilidad práctica o los beneficios para la empresa.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(28, 'Insuficiente', 'No justifica la propuesta o esta es inviable en todos sus aspectos.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4),
(29, 'Sobresaliente', 'Exposición clara, estructurada y dinámica. Defiende la propuesta con solvencia, respondiendo a preguntas con argumentos técnicos y éticos sólidos.', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(29, 'Notable', 'Exposición clara, pero con momentos de poca fluidez. Responde preguntas, aunque con algún titubeo.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(29, 'Aprobado', 'Exposición confusa o desorganizada. Dificultad para responder preguntas básicas sobre el proyecto.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(29, 'Insuficiente', 'Exposición pobre o no se realiza. Incapacidad para defender el trabajo.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4),
(30, 'Sobresaliente', 'Evidencia un excelente trabajo colaborativo. Demuestra una profunda comprensión y sensibilidad hacia el valor de la inclusión en el entorno empresarial', 5.83, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1),
(30, 'Notable', 'El equipo funcionó adecuadamente. La sensibilidad hacia la inclusión se manifiesta, pero no de forma transversal en el proyecto.', 4.37, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 2),
(30, 'Aprobado', 'Se observan conflictos de equipo o descoordinación. La perspectiva inclusiva es tratada como un requisito, no como un valor.', 2.92, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 3),
(30, 'Insuficiente', 'No hay evidencia de trabajo en equipo. El proyecto carece de empatía o contiene sesgos.', 1.46, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 4);

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `usuario_destino` varchar(20) NOT NULL,
  `tipo` enum('info','success','warning','error') DEFAULT 'info',
  `titulo` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `url_accion` varchar(255) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificacion`
--

INSERT INTO `notificacion` (`id`, `usuario_destino`, `tipo`, `titulo`, `mensaje`, `leido`, `url_accion`, `metadata`, `fecha`, `created_at`) VALUES
(1, '27000028', '', 'Nueva Evaluación Disponible', 'Se ha publicado una nueva evaluación de Desarrollo de Algoritmos', 0, NULL, NULL, '2025-09-20 08:00:00', '2026-02-16 18:27:43'),
(2, '27000028', '', 'Resultados Publicados', 'Los resultados de tu evaluación de Algoritmos están disponibles', 1, NULL, NULL, '2025-10-17 09:00:00', '2026-02-16 18:27:43'),
(3, '27000001', '', 'Próxima Evaluación', 'Recuerda que la evaluación de Plan Estratégico es el 22 de octubre', 0, NULL, NULL, '2025-10-15 13:00:00', '2026-02-16 18:27:43'),
(4, '27000022', '', 'Calificación Registrada', 'Se ha registrado tu calificación en Contabilidad General', 1, NULL, NULL, '2025-10-31 08:00:00', '2026-02-16 18:27:43'),
(5, '27000035', '', 'Evaluación Programada', 'La evaluación práctica de Circuitos está programada para la próxima semana', 0, NULL, NULL, '2025-10-16 10:00:00', '2026-02-16 18:27:43'),
(6, '27000049', '', 'Nuevo Material Disponible', 'Se ha publicado nuevo material didáctico en la plataforma', 1, NULL, NULL, '2025-10-10 07:00:00', '2026-02-16 18:27:43'),
(7, '12345689', '', 'Evaluaciones Pendientes', 'Tienes 3 evaluaciones pendientes por calificar', 0, NULL, NULL, '2025-10-18 07:00:00', '2026-02-16 18:27:43'),
(8, '12345678', '', 'Recordatorio', 'Fecha límite para cargar notas: 25 de octubre', 1, NULL, NULL, '2025-10-20 09:00:00', '2026-02-16 18:27:43'),
(9, '87654321', '', 'Actualización Importante', 'Nueva normativa contable disponible en recursos', 0, NULL, NULL, '2025-10-12 14:00:00', '2026-02-16 18:27:43'),
(10, '31987430', '', 'Reporte Mensual', 'El reporte de evaluaciones del mes está listo', 1, NULL, NULL, '2025-11-01 08:00:00', '2026-02-16 18:27:43'),
(11, '31987430', '', 'Sincronización Completa', 'Los datos se han sincronizado correctamente', 1, NULL, NULL, '2025-10-25 15:00:00', '2026-02-16 18:27:43'),
(12, '27000028', '', 'Nueva Evaluación Disponible', 'Se ha publicado una nueva evaluación de Desarrollo de Algoritmos', 0, NULL, NULL, '2025-09-20 08:00:00', '2026-02-16 18:28:54'),
(13, '27000028', '', 'Resultados Publicados', 'Los resultados de tu evaluación de Algoritmos están disponibles', 1, NULL, NULL, '2025-10-17 09:00:00', '2026-02-16 18:28:54'),
(14, '27000001', '', 'Próxima Evaluación', 'Recuerda que la evaluación de Plan Estratégico es el 22 de octubre', 0, NULL, NULL, '2025-10-15 13:00:00', '2026-02-16 18:28:54'),
(15, '27000022', '', 'Calificación Registrada', 'Se ha registrado tu calificación en Contabilidad General', 1, NULL, NULL, '2025-10-31 08:00:00', '2026-02-16 18:28:54'),
(16, '27000035', '', 'Evaluación Programada', 'La evaluación práctica de Circuitos está programada para la próxima semana', 0, NULL, NULL, '2025-10-16 10:00:00', '2026-02-16 18:28:54'),
(17, '27000049', '', 'Nuevo Material Disponible', 'Se ha publicado nuevo material didáctico en la plataforma', 1, NULL, NULL, '2025-10-10 07:00:00', '2026-02-16 18:28:54'),
(18, '12345689', '', 'Evaluaciones Pendientes', 'Tienes 3 evaluaciones pendientes por calificar', 0, NULL, NULL, '2025-10-18 07:00:00', '2026-02-16 18:28:54'),
(19, '12345678', '', 'Recordatorio', 'Fecha límite para cargar notas: 25 de octubre', 1, NULL, NULL, '2025-10-20 09:00:00', '2026-02-16 18:28:54'),
(20, '87654321', '', 'Actualización Importante', 'Nueva normativa contable disponible en recursos', 0, NULL, NULL, '2025-10-12 14:00:00', '2026-02-16 18:28:54'),
(21, '31987430', '', 'Reporte Mensual', 'El reporte de evaluaciones del mes está listo', 1, NULL, NULL, '2025-11-01 08:00:00', '2026-02-16 18:28:54'),
(22, '31987430', '', 'Sincronización Completa', 'Los datos se han sincronizado correctamente', 1, NULL, NULL, '2025-10-25 15:00:00', '2026-02-16 18:28:54');

-- --------------------------------------------------------

--
-- Table structure for table `notificacion_rubrica`
--

CREATE TABLE `notificacion_rubrica` (
  `id_notif` int(11) NOT NULL,
  `id_rubrica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificacion_rubrica`
--

INSERT INTO `notificacion_rubrica` (`id_notif`, `id_rubrica`) VALUES
(1, 1),
(2, 1),
(4, 4),
(5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `periodo_academico`
--

CREATE TABLE `periodo_academico` (
  `codigo` varchar(20) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodo_academico`
--

INSERT INTO `periodo_academico` (`codigo`, `fecha_inicio`, `fecha_fin`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('2025-1', '2025-08-01', '2025-12-18', 1, '2026-01-05 16:54:51', '2026-01-05 16:54:51');

-- --------------------------------------------------------

--
-- Table structure for table `permiso_docente`
--

CREATE TABLE `permiso_docente` (
  `id` int(11) NOT NULL,
  `docente_cedula` varchar(20) NOT NULL,
  `puede_crear_rubrica` tinyint(4) DEFAULT 1,
  `puede_evaluar` tinyint(4) DEFAULT 1,
  `puede_modificar_notas` tinyint(4) DEFAULT 1,
  `puede_ver_reportes` tinyint(4) DEFAULT 1,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cedula_creador` varchar(20) NOT NULL,
  `id_seccion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permiso_docente`
--

INSERT INTO `permiso_docente` (`id`, `docente_cedula`, `puede_crear_rubrica`, `puede_evaluar`, `puede_modificar_notas`, `puede_ver_reportes`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `cedula_creador`, `id_seccion`) VALUES
(1, '12345678', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 1),
(2, '12345679', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 1),
(3, '12345680', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 4),
(4, '12345680', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 5),
(5, '12345686', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 3),
(6, '12345687', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 2),
(7, '12345688', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 3),
(8, '12345689', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 6),
(9, '12345690', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 7),
(10, '12345691', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 6),
(11, '12345692', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 8),
(12, '12345693', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 7),
(13, '12345694', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 9),
(14, '12345695', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 9),
(15, '12345695', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 10),
(16, '12345696', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 10),
(17, '12345699', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 11),
(18, '12345700', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 11),
(19, '12345702', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 12),
(20, '12345703', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 13),
(21, '12345704', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 13),
(22, '12345705', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 14),
(23, '12345706', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 14),
(24, '12345707', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 15),
(25, '12345708', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 15),
(26, '12345709', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 16),
(27, '12345710', 1, 1, 1, 1, 0, '2025-09-01 07:00:00', '2026-02-17 17:13:10', '31987430', 16),
(28, '12345711', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 17),
(29, '12345712', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 17),
(30, '12345713', 1, 1, 1, 1, 0, '2025-09-01 07:00:00', '2026-02-17 18:00:46', '31987430', 18),
(31, '12345714', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 18),
(32, '12345715', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 19),
(33, '12345716', 1, 1, 1, 1, 0, '2025-09-01 07:00:00', '2026-02-17 17:15:23', '31987430', 19),
(34, '12345717', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 20),
(35, '12345718', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 20),
(36, '87654321', 1, 1, 1, 1, 1, '2025-09-01 07:00:00', '2026-02-16 18:27:32', '31987430', 4),
(37, '12345692', 1, 1, 1, 1, 1, '2026-02-17 17:11:29', '2026-02-17 17:11:29', '31987430', 7),
(38, '99999998', 1, 1, 1, 1, 1, '2026-02-17 17:12:36', '2026-02-17 17:12:36', '31987430', 281),
(39, '12345713', 1, 1, 1, 1, 1, '2026-02-17 18:01:14', '2026-02-17 18:47:22', '31987430', 7),
(40, '12345692', 1, 1, 1, 1, 1, '2026-02-17 18:22:20', '2026-02-17 18:22:20', '31987430', 118),
(41, '12345713', 1, 1, 1, 1, 1, '2026-02-17 18:22:55', '2026-02-17 18:22:55', '31987430', 6);

-- --------------------------------------------------------

--
-- Table structure for table `permiso_rol`
--

CREATE TABLE `permiso_rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `dado` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_periodo`
--

CREATE TABLE `plan_periodo` (
  `codigo_periodo` varchar(20) NOT NULL,
  `codigo_carrera` varchar(10) NOT NULL,
  `codigo_materia` varchar(10) NOT NULL,
  `num_semestre` int(11) NOT NULL,
  `id_tipo_sem` int(11) DEFAULT NULL,
  `horas_teoricas` int(11) DEFAULT NULL,
  `horas_practicas` int(11) DEFAULT NULL,
  `horas_tp` int(11) DEFAULT NULL,
  `unidades_credito` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_periodo`
--

INSERT INTO `plan_periodo` (`codigo_periodo`, `codigo_carrera`, `codigo_materia`, `num_semestre`, `id_tipo_sem`, `horas_teoricas`, `horas_practicas`, `horas_tp`, `unidades_credito`, `id`) VALUES
('2025-1', 'ADM', 'ADG-143', 1, 1, 2, 2, 0, 3, 1),
('2025-1', 'ADM', 'COG-164', 1, 1, 2, 4, 0, 4, 2),
('2025-1', 'ADM', 'EFD-132', 1, 1, 1, 2, 0, 2, 3),
('2025-1', 'ADM', 'FOH-132', 1, 1, 1, 2, 0, 2, 4),
('2025-1', 'ADM', 'FOC-100', 1, 1, 0, 0, 0, 0, 5),
('2025-1', 'ADM', 'ING-132', 1, 1, 1, 2, 0, 2, 6),
('2025-1', 'ADM', 'LEC-143', 1, 1, 2, 2, 0, 3, 7),
('2025-1', 'ADM', 'MAG-143', 1, 1, 2, 2, 0, 3, 8),
('2025-1', 'ADM', 'RSP-132', 1, 1, 1, 2, 0, 2, 9),
('2025-1', 'ADM', 'COI-243', 2, 1, 2, 2, 0, 3, 10),
('2025-1', 'ADM', 'ETM-232', 2, 1, 1, 2, 0, 2, 11),
('2025-1', 'ADM', 'FOC-200', 2, 1, 0, 0, 0, 0, 12),
('2025-1', 'ADM', 'INA-232', 2, 1, 1, 2, 0, 2, 13),
('2025-1', 'ADM', 'ING-232', 2, 1, 1, 2, 0, 2, 14),
('2025-1', 'ADM', 'LEL-232', 2, 1, 1, 2, 0, 2, 15),
('2025-1', 'ADM', 'LEM-232', 2, 1, 1, 2, 0, 2, 16),
('2025-1', 'ADM', 'LEC-243', 2, 1, 2, 2, 0, 3, 17),
('2025-1', 'ADM', 'MAA-243', 2, 1, 2, 2, 0, 3, 18),
('2025-1', 'ADM', 'MIC-232', 2, 1, 1, 2, 0, 2, 19),
('2025-1', 'ADM', 'COS-364', 3, 1, 2, 4, 0, 4, 20),
('2025-1', 'ADM', 'DVE-343', 3, 1, 2, 2, 0, 3, 21),
('2025-1', 'ADM', 'ETI-343', 3, 1, 2, 2, 0, 3, 22),
('2025-1', 'ADM', 'FOC-300', 3, 1, 0, 0, 0, 0, 23),
('2025-1', 'ADM', 'LET-343', 3, 1, 2, 2, 0, 3, 24),
('2025-1', 'ADM', 'MAE-332', 3, 1, 1, 2, 0, 2, 25),
('2025-1', 'ADM', 'MAF-343', 3, 1, 2, 2, 0, 3, 26),
('2025-1', 'ADM', 'MET-332', 3, 1, 1, 2, 0, 2, 27),
('2025-1', 'ADM', 'OEE-332', 3, 1, 1, 2, 0, 2, 28),
('2025-1', 'ADM', 'SIF-332', 3, 1, 1, 2, 0, 2, 29),
('2025-1', 'ADM', 'ADP-443', 4, 1, 2, 2, 0, 3, 30),
('2025-1', 'ADM', 'ATH-443', 4, 1, 2, 2, 0, 3, 31),
('2025-1', 'ADM', 'ANF-443', 4, 1, 2, 2, 0, 3, 32),
('2025-1', 'ADM', 'COC-443', 4, 1, 2, 2, 0, 3, 33),
('2025-1', 'ADM', 'CIE-432', 4, 1, 1, 2, 0, 2, 34),
('2025-1', 'ADM', 'EAS-432', 4, 1, 1, 2, 0, 2, 35),
('2025-1', 'ADM', 'FOC-400', 4, 1, 0, 0, 0, 0, 36),
('2025-1', 'ADM', 'HSI-432', 4, 1, 1, 2, 0, 2, 37),
('2025-1', 'ADM', 'SPA-443', 4, 1, 2, 2, 0, 3, 38),
('2025-1', 'ADM', 'ANF-543', 5, 1, 2, 2, 0, 3, 39),
('2025-1', 'ADM', 'AUA-543', 5, 1, 2, 2, 0, 3, 40),
('2025-1', 'ADM', 'EVP-532', 5, 1, 1, 2, 0, 2, 41),
('2025-1', 'ADM', 'FOC-500', 5, 1, 0, 0, 0, 0, 42),
('2025-1', 'ADM', 'INM-532', 5, 1, 1, 2, 0, 2, 43),
('2025-1', 'ADM', 'MIE-532', 5, 1, 1, 2, 0, 2, 44),
('2025-1', 'ADM', 'TDP-532', 5, 1, 1, 2, 0, 2, 45),
('2025-1', 'ADM', 'TEP-543', 5, 1, 2, 2, 0, 3, 46),
('2025-1', 'ADM', 'SPP-605', 6, 1, 0, 0, 0, 5, 47),
('2025-1', 'ADM', 'FOC-600', 6, 1, 0, 0, 0, 0, 48),
('2025-1', 'CONT', 'ADG-143', 1, 1, 2, 2, 0, 3, 49),
('2025-1', 'CONT', 'COG-164', 1, 1, 2, 4, 0, 4, 50),
('2025-1', 'CONT', 'EFD-132', 1, 1, 1, 2, 0, 2, 51),
('2025-1', 'CONT', 'FOH-132', 1, 1, 1, 2, 0, 2, 52),
('2025-1', 'CONT', 'FOC-100', 1, 1, 0, 0, 0, 0, 53),
('2025-1', 'CONT', 'ING-132', 1, 1, 1, 2, 0, 2, 54),
('2025-1', 'CONT', 'LEC-143', 1, 1, 2, 2, 0, 3, 55),
('2025-1', 'CONT', 'MAG-143', 1, 1, 2, 2, 0, 3, 56),
('2025-1', 'CONT', 'RSP-132', 1, 1, 1, 2, 0, 2, 57),
('2025-1', 'CONT', 'COI-243', 2, 1, 2, 2, 0, 3, 58),
('2025-1', 'CONT', 'ETM-232', 2, 1, 1, 2, 0, 2, 59),
('2025-1', 'CONT', 'FOC-200', 2, 1, 0, 0, 0, 0, 60),
('2025-1', 'CONT', 'INA-232', 2, 1, 1, 2, 0, 2, 61),
('2025-1', 'CONT', 'ING-232', 2, 1, 1, 2, 0, 2, 62),
('2025-1', 'CONT', 'LEL-232', 2, 1, 1, 2, 0, 2, 63),
('2025-1', 'CONT', 'LEM-232', 2, 1, 1, 2, 0, 2, 64),
('2025-1', 'CONT', 'LEC-243', 2, 1, 2, 2, 0, 3, 65),
('2025-1', 'CONT', 'MAA-243', 2, 1, 2, 2, 0, 3, 66),
('2025-1', 'CONT', 'MIC-232', 2, 1, 1, 2, 0, 2, 67),
('2025-1', 'CONT', 'COS-364', 3, 1, 2, 4, 0, 4, 68),
('2025-1', 'CONT', 'DVE-343', 3, 1, 2, 2, 0, 3, 69),
('2025-1', 'CONT', 'ETI-343', 3, 1, 2, 2, 0, 3, 70),
('2025-1', 'CONT', 'FOC-300', 3, 1, 0, 0, 0, 0, 71),
('2025-1', 'CONT', 'LET-343', 3, 1, 2, 2, 0, 3, 72),
('2025-1', 'CONT', 'MAE-332', 3, 1, 1, 2, 0, 2, 73),
('2025-1', 'CONT', 'MAF-343', 3, 1, 2, 2, 0, 3, 74),
('2025-1', 'CONT', 'MET-332', 3, 1, 1, 2, 0, 2, 75),
('2025-1', 'CONT', 'OEE-332', 3, 1, 1, 2, 0, 2, 76),
('2025-1', 'CONT', 'SIF-332', 3, 1, 1, 2, 0, 2, 77),
('2025-1', 'CONT', 'ANF-443', 4, 1, 2, 2, 0, 3, 78),
('2025-1', 'CONT', 'AUD-443', 4, 1, 2, 2, 0, 3, 79),
('2025-1', 'CONT', 'COC-464', 4, 1, 2, 4, 0, 4, 80),
('2025-1', 'CONT', 'COG-432', 4, 1, 1, 2, 0, 2, 81),
('2025-1', 'CONT', 'FOC-400', 4, 1, 0, 0, 0, 0, 82),
('2025-1', 'CONT', 'GEA-432', 4, 1, 1, 2, 0, 2, 83),
('2025-1', 'CONT', 'GAM-432', 4, 1, 1, 2, 0, 2, 84),
('2025-1', 'CONT', 'GET-443', 4, 1, 2, 2, 0, 3, 85),
('2025-1', 'CONT', 'PPP-443', 4, 1, 2, 2, 0, 3, 86),
('2025-1', 'CONT', 'ANF-543', 5, 1, 2, 2, 0, 3, 87),
('2025-1', 'CONT', 'AUD-532', 5, 1, 1, 2, 0, 2, 88),
('2025-1', 'CONT', 'CCA-532', 5, 1, 1, 2, 0, 2, 89),
('2025-1', 'CONT', 'COE-543', 5, 1, 2, 2, 0, 3, 90),
('2025-1', 'CONT', 'COG-532', 5, 1, 1, 2, 0, 2, 91),
('2025-1', 'CONT', 'FOC-500', 5, 1, 0, 0, 0, 0, 92),
('2025-1', 'CONT', 'MEI-532', 5, 1, 1, 2, 0, 2, 93),
('2025-1', 'CONT', 'SIC-543', 5, 1, 2, 2, 0, 3, 94),
('2025-1', 'CONT', 'FOC-600', 6, 1, 0, 0, 0, 0, 95),
('2025-1', 'CONT', 'SPP-605', 6, 1, 0, 0, 0, 5, 96),
('2025-1', 'INF', 'FOC-100', 1, 1, 0, 0, 0, 0, 217),
('2025-1', 'INF', 'ING-143', 1, 1, 2, 2, 0, 3, 218),
('2025-1', 'INF', 'INI-154', 1, 1, 3, 2, 0, 4, 219),
('2025-1', 'INF', 'LEC-143', 1, 1, 2, 2, 0, 3, 220),
('2025-1', 'INF', 'LOC-154', 1, 1, 3, 2, 0, 4, 221),
('2025-1', 'INF', 'MAT-165', 1, 1, 4, 2, 0, 5, 222),
('2025-1', 'INF', 'RSP-133', 1, 1, 3, 0, 0, 3, 223),
('2025-1', 'INF', 'TID-122', 1, 1, 2, 0, 0, 2, 224),
('2025-1', 'INF', 'ACC-220', 2, 1, 0, 2, 0, 0, 225),
('2025-1', 'INF', 'ALP-265', 2, 1, 4, 2, 0, 5, 226),
('2025-1', 'INF', 'ANF-233', 2, 1, 3, 0, 0, 3, 227),
('2025-1', 'INF', 'ARC-265', 2, 1, 4, 2, 0, 5, 228),
('2025-1', 'INF', 'CAL-265', 2, 1, 4, 2, 0, 5, 229),
('2025-1', 'INF', 'FOC-200', 2, 1, 0, 0, 0, 0, 230),
('2025-1', 'INF', 'ING-243', 2, 1, 2, 2, 0, 3, 231),
('2025-1', 'INF', 'ALP-365', 3, 1, 4, 2, 0, 5, 232),
('2025-1', 'INF', 'CAL-365', 3, 1, 4, 2, 0, 5, 233),
('2025-1', 'INF', 'ESA-343', 3, 1, 2, 2, 0, 3, 234),
('2025-1', 'INF', 'FOC-300', 3, 1, 0, 0, 0, 0, 235),
('2025-1', 'INF', 'INS-354', 3, 1, 3, 2, 0, 4, 236),
('2025-1', 'INF', 'IGL-332', 3, 1, 2, 1, 0, 2, 237),
('2025-1', 'INF', 'ADE-433', 4, 1, 3, 0, 0, 3, 238),
('2025-1', 'INF', 'ADS-433', 4, 1, 3, 0, 0, 3, 239),
('2025-1', 'INF', 'ARC-454', 4, 1, 3, 2, 0, 4, 240),
('2025-1', 'INF', 'ESA-444', 4, 1, 4, 0, 0, 4, 241),
('2025-1', 'INF', 'FOC-400', 4, 1, 0, 0, 0, 0, 242),
('2025-1', 'INF', 'SBD-454', 4, 1, 3, 2, 0, 4, 243),
('2025-1', 'INF', 'SIO-454', 4, 1, 3, 2, 0, 4, 244),
('2025-1', 'INF', 'CON-544', 5, 1, 4, 0, 0, 4, 245),
('2025-1', 'INF', 'ETF-522', 5, 1, 2, 0, 0, 2, 246),
('2025-1', 'INF', 'FOC-500', 5, 1, 0, 0, 0, 0, 247),
('2025-1', 'INF', 'INU-554', 5, 1, 3, 2, 0, 4, 248),
('2025-1', 'INF', 'INO-544', 5, 1, 4, 0, 0, 4, 249),
('2025-1', 'INF', 'MEI-522', 5, 1, 2, 0, 0, 2, 250),
('2025-1', 'INF', 'SDI-554', 5, 1, 3, 2, 0, 4, 251),
('2025-1', 'INF', 'SIO-554', 5, 1, 3, 2, 0, 4, 252),
('2025-1', 'INF', 'ELT-622', 6, 1, 2, 0, 0, 2, 253),
('2025-1', 'INF', 'FOC-600', 6, 1, 0, 0, 0, 0, 254),
('2025-1', 'INF', 'PAP-604', 6, 1, 0, 0, 0, 4, 255),
('2025-1', 'INF', 'TEG-606', 6, 1, 0, 0, 0, 6, 256),
('2025-1', 'ELEC', 'FIS-143', 1, 1, 2, 2, 0, 3, 321),
('2025-1', 'ELEC', 'FOC-100', 1, 1, 0, 0, 0, 0, 322),
('2025-1', 'ELEC', 'GDD-133', 1, 1, 3, 0, 0, 3, 323),
('2025-1', 'ELEC', 'ING-143', 1, 1, 2, 2, 0, 3, 324),
('2025-1', 'ELEC', 'LEC-143', 1, 1, 2, 2, 0, 3, 325),
('2025-1', 'ELEC', 'MAT-165', 1, 1, 4, 2, 0, 5, 326),
('2025-1', 'ELEC', 'RSP-133', 1, 1, 3, 0, 0, 3, 327),
('2025-1', 'ELEC', 'TEC-154', 1, 1, 3, 2, 0, 4, 328),
('2025-1', 'ELEC', 'ANF-222', 2, 1, 2, 0, 0, 2, 329),
('2025-1', 'ELEC', 'CIE-243', 2, 1, 2, 2, 0, 3, 330),
('2025-1', 'ELEC', 'FOC-200', 2, 1, 0, 0, 0, 0, 331),
('2025-1', 'ELEC', 'GDD-233', 2, 1, 3, 0, 0, 3, 332),
('2025-1', 'ELEC', 'ING-233', 2, 1, 3, 0, 0, 3, 333),
('2025-1', 'ELEC', 'IMI-222', 2, 1, 2, 0, 0, 2, 334),
('2025-1', 'ELEC', 'INE-243', 2, 1, 2, 2, 0, 3, 335),
('2025-1', 'ELEC', 'LIM-253', 2, 1, 1, 4, 0, 3, 336),
('2025-1', 'ELEC', 'MAT-265', 2, 1, 4, 2, 0, 5, 337),
('2025-1', 'ELEC', 'ACC-320', 3, 1, 0, 2, 0, 0, 338),
('2025-1', 'ELEC', 'ADE-333', 3, 1, 3, 0, 0, 3, 339),
('2025-1', 'ELEC', 'CIE-343', 3, 1, 2, 2, 0, 3, 340),
('2025-1', 'ELEC', 'DEE-364', 3, 1, 2, 4, 0, 4, 341),
('2025-1', 'ELEC', 'ELE-343', 3, 1, 2, 2, 0, 3, 342),
('2025-1', 'ELEC', 'FOC-300', 3, 1, 0, 0, 0, 0, 343),
('2025-1', 'ELEC', 'MAT-365', 3, 1, 4, 2, 0, 5, 344),
('2025-1', 'ELEC', 'TED-343', 3, 1, 2, 2, 0, 3, 345),
('2025-1', 'ELEC', 'DEE-443', 4, 1, 2, 2, 0, 3, 346),
('2025-1', 'ELEC', 'EDA-422', 4, 1, 2, 0, 0, 2, 347),
('2025-1', 'ELEC', 'ELE-443', 4, 1, 2, 2, 0, 3, 348),
('2025-1', 'ELEC', 'ELE-432', 4, 1, 1, 2, 0, 2, 349),
('2025-1', 'ELEC', 'FOC-400', 4, 1, 0, 0, 0, 0, 350),
('2025-1', 'ELEC', 'INF-432', 4, 1, 1, 2, 0, 2, 351),
('2025-1', 'ELEC', 'MAT-432', 4, 1, 2, 1, 0, 2, 352),
('2025-1', 'ELEC', 'SHI-422', 4, 1, 2, 0, 0, 2, 353),
('2025-1', 'ELEC', 'TED-443', 4, 1, 2, 2, 0, 3, 354),
('2025-1', 'ELEC', 'DEE-543', 5, 1, 2, 2, 0, 3, 355),
('2025-1', 'ELEC', 'ELE-543', 5, 1, 2, 2, 0, 3, 356),
('2025-1', 'ELEC', 'ETP-522', 5, 1, 2, 0, 0, 2, 357),
('2025-1', 'ELEC', 'FOC-500', 5, 1, 0, 0, 0, 0, 358),
('2025-1', 'ELEC', 'INE-543', 5, 1, 2, 2, 0, 3, 359),
('2025-1', 'ELEC', 'INC-533', 5, 1, 3, 0, 0, 3, 360),
('2025-1', 'ELEC', 'MIC-543', 5, 1, 2, 2, 0, 3, 361),
('2025-1', 'ELEC', 'ADS-643', 6, 1, 2, 2, 0, 3, 362),
('2025-1', 'ELEC', 'DEE-643', 6, 1, 2, 2, 0, 3, 363),
('2025-1', 'ELEC', 'FOC-600', 6, 1, 0, 0, 0, 0, 364),
('2025-1', 'ELEC', 'PAP-604', 6, 1, 0, 0, 0, 4, 365),
('2025-1', 'ELEC', 'SIC-643', 6, 1, 2, 2, 0, 3, 366),
('2025-1', 'ELEC', 'TEG-606', 6, 1, 0, 0, 0, 6, 367),
('2025-1', 'ELTEC', 'FIS-143', 1, 1, 2, 2, 0, 3, 368),
('2025-1', 'ELTEC', 'FOC-100', 1, 1, 0, 0, 0, 0, 369),
('2025-1', 'ELTEC', 'GDD-133', 1, 1, 3, 0, 0, 3, 370),
('2025-1', 'ELTEC', 'ING-143', 1, 1, 2, 2, 0, 3, 371),
('2025-1', 'ELTEC', 'LEC-143', 1, 1, 2, 2, 0, 3, 372),
('2025-1', 'ELTEC', 'MAT-165', 1, 1, 4, 2, 0, 5, 373),
('2025-1', 'ELTEC', 'RSP-133', 1, 1, 3, 0, 0, 3, 374),
('2025-1', 'ELTEC', 'TEC-154', 1, 1, 3, 2, 0, 4, 375),
('2025-1', 'ELTEC', 'ANF-222', 2, 1, 2, 0, 0, 2, 376),
('2025-1', 'ELTEC', 'CIE-243', 2, 1, 2, 2, 0, 3, 377),
('2025-1', 'ELTEC', 'FOC-200', 2, 1, 0, 0, 0, 0, 378),
('2025-1', 'ELTEC', 'GDD-233', 2, 1, 3, 0, 0, 3, 379),
('2025-1', 'ELTEC', 'ING-233', 2, 1, 3, 0, 0, 3, 380),
('2025-1', 'ELTEC', 'IMI-222', 2, 1, 2, 0, 0, 2, 381),
('2025-1', 'ELTEC', 'INE-243', 2, 1, 2, 2, 0, 3, 382),
('2025-1', 'ELTEC', 'LIM-253', 2, 1, 1, 4, 0, 3, 383),
('2025-1', 'ELTEC', 'MAT-265', 2, 1, 4, 2, 0, 5, 384),
('2025-1', 'ELTEC', 'ACC-320', 3, 1, 0, 2, 0, 0, 385),
('2025-1', 'ELTEC', 'ADE-333', 3, 1, 3, 0, 0, 3, 386),
('2025-1', 'ELTEC', 'CIE-343', 3, 1, 2, 2, 0, 3, 387),
('2025-1', 'ELTEC', 'ELE-374', 3, 1, 2, 5, 0, 5, 388),
('2025-1', 'ELTEC', 'ELE-365', 3, 1, 4, 2, 0, 5, 389),
('2025-1', 'ELTEC', 'FOC-300', 3, 1, 0, 0, 0, 0, 390),
('2025-1', 'ELTEC', 'INE-332', 3, 1, 1, 2, 0, 2, 391),
('2025-1', 'ELTEC', 'MAT-365', 3, 1, 4, 2, 0, 5, 392),
('2025-1', 'ELTEC', 'EDA-422', 4, 1, 2, 0, 0, 2, 393),
('2025-1', 'ELTEC', 'ELE-443', 4, 1, 2, 2, 0, 3, 394),
('2025-1', 'ELTEC', 'ELE-465', 4, 1, 4, 2, 0, 5, 395),
('2025-1', 'ELTEC', 'FOC-400', 4, 1, 0, 0, 0, 0, 396),
('2025-1', 'ELTEC', 'INF-432', 4, 1, 1, 2, 0, 2, 397),
('2025-1', 'ELTEC', 'INE-454', 4, 1, 3, 2, 0, 4, 398),
('2025-1', 'ELTEC', 'MAT-432', 4, 1, 2, 1, 0, 2, 399),
('2025-1', 'ELTEC', 'SHI-422', 4, 1, 2, 0, 0, 2, 400),
('2025-1', 'ELTEC', 'ELI-532', 5, 1, 1, 2, 0, 2, 401),
('2025-1', 'ELTEC', 'ELE-565', 5, 1, 4, 2, 0, 5, 402),
('2025-1', 'ELTEC', 'ETP-522', 5, 1, 2, 0, 0, 2, 403),
('2025-1', 'ELTEC', 'FOC-500', 5, 1, 0, 0, 0, 0, 404),
('2025-1', 'ELTEC', 'ILU-532', 5, 1, 1, 2, 0, 2, 405),
('2025-1', 'ELTEC', 'INE-532', 5, 1, 1, 2, 0, 2, 406),
('2025-1', 'ELTEC', 'LIE-532', 5, 1, 1, 2, 0, 2, 407),
('2025-1', 'ELTEC', 'MIC-543', 5, 1, 2, 2, 0, 3, 408),
('2025-1', 'ELTEC', 'AUT-643', 6, 1, 2, 2, 0, 3, 409),
('2025-1', 'ELTEC', 'ELE-664', 6, 1, 2, 4, 0, 4, 410),
('2025-1', 'ELTEC', 'FOC-600', 6, 1, 0, 0, 0, 0, 411),
('2025-1', 'ELTEC', 'PAP-604', 6, 1, 0, 0, 0, 4, 412),
('2025-1', 'ELTEC', 'PLE-632', 6, 1, 1, 2, 0, 2, 413),
('2025-1', 'ELTEC', 'TEG-606', 6, 1, 0, 0, 0, 6, 414),
('2025-1', 'MEC', 'DII-132', 1, 1, 1, 2, 0, 2, 415),
('2025-1', 'MEC', 'FIS-143', 1, 1, 2, 2, 0, 3, 416),
('2025-1', 'MEC', 'FOC-100', 1, 1, 0, 0, 0, 0, 417),
('2025-1', 'MEC', 'ING-122', 1, 1, 2, 0, 0, 2, 418),
('2025-1', 'MEC', 'LEC-143', 1, 1, 2, 2, 0, 3, 419),
('2025-1', 'MEC', 'MAH-175', 1, 1, 3, 4, 0, 5, 420),
('2025-1', 'MEC', 'MAT-165', 1, 1, 4, 2, 0, 5, 421),
('2025-1', 'MEC', 'TEC-144', 1, 1, 4, 0, 0, 4, 422),
('2025-1', 'MEC', 'ACC-220', 2, 1, 0, 2, 0, 0, 423),
('2025-1', 'MEC', 'DII-242', 2, 1, 1, 3, 0, 2, 424),
('2025-1', 'MEC', 'FOC-200', 2, 1, 0, 0, 0, 0, 425),
('2025-1', 'MEC', 'ING-222', 2, 1, 2, 0, 0, 2, 426),
('2025-1', 'MEC', 'MAH-264', 2, 1, 2, 4, 0, 4, 427),
('2025-1', 'MEC', 'MAT-265', 2, 1, 4, 2, 0, 5, 428),
('2025-1', 'MEC', 'RSP-233', 2, 1, 3, 0, 0, 3, 429),
('2025-1', 'MEC', 'SHI-222', 2, 1, 2, 0, 0, 2, 430),
('2025-1', 'MEC', 'TEC-244', 2, 1, 4, 0, 0, 4, 431),
('2025-1', 'MEC', 'DII-343', 3, 1, 2, 2, 0, 3, 432),
('2025-1', 'MEC', 'ELE-354', 3, 1, 3, 2, 0, 4, 433),
('2025-1', 'MEC', 'FOC-300', 3, 1, 0, 0, 0, 0, 434),
('2025-1', 'MEC', 'INC-353', 3, 1, 2, 3, 0, 3, 435),
('2025-1', 'MEC', 'MAH-364', 3, 1, 2, 4, 0, 4, 436),
('2025-1', 'MEC', 'MAT-365', 3, 1, 4, 2, 0, 5, 437),
('2025-1', 'MEC', 'TEC-344', 3, 1, 4, 0, 0, 4, 438),
('2025-1', 'MEC', 'ANF-433', 4, 1, 3, 0, 0, 3, 439),
('2025-1', 'MEC', 'AUT-443', 4, 1, 2, 2, 0, 3, 440),
('2025-1', 'MEC', 'CON-464', 4, 1, 2, 4, 0, 4, 441),
('2025-1', 'MEC', 'ETP-422', 4, 1, 2, 0, 0, 2, 442),
('2025-1', 'MEC', 'FOC-400', 4, 1, 0, 0, 0, 0, 443),
('2025-1', 'MEC', 'MAH-464', 4, 1, 2, 4, 0, 4, 444),
('2025-1', 'MEC', 'TEC-444', 4, 1, 4, 0, 0, 4, 445),
('2025-1', 'MEC', 'ACC-531', 5, 1, 0, 3, 0, 1, 446),
('2025-1', 'MEC', 'ADE-533', 5, 1, 3, 0, 0, 3, 447),
('2025-1', 'MEC', 'COC-532', 5, 1, 2, 1, 0, 2, 448),
('2025-1', 'MEC', 'CON-564', 5, 1, 2, 4, 0, 4, 449),
('2025-1', 'MEC', 'ELE-543', 5, 1, 3, 1, 0, 3, 450),
('2025-1', 'MEC', 'FOC-500', 5, 1, 0, 0, 0, 0, 451),
('2025-1', 'MEC', 'MAI-543', 5, 1, 2, 2, 0, 3, 452),
('2025-1', 'MEC', 'MEI-533', 5, 1, 3, 0, 0, 3, 453),
('2025-1', 'MEC', 'FOC-600', 6, 1, 0, 0, 0, 0, 454),
('2025-1', 'MEC', 'PAP-604', 6, 1, 0, 0, 0, 4, 455),
('2025-1', 'MEC', 'TEG-606', 6, 1, 0, 0, 0, 6, 456),
('2025-1', 'EDIN', 'EFL-132', 1, 1, 1, 2, 0, 2, 457),
('2025-1', 'EDIN', 'FOC-100', 1, 1, 0, 0, 0, 0, 458),
('2025-1', 'EDIN', 'FOH-143', 1, 1, 2, 2, 0, 3, 459),
('2025-1', 'EDIN', 'LEC-143', 1, 1, 2, 2, 0, 3, 460),
('2025-1', 'EDIN', 'MEI-132', 1, 1, 1, 2, 0, 2, 461),
('2025-1', 'EDIN', 'PRA-145', 1, 1, 2, 0, 0, 2, 462),
('2025-1', 'EDIN', 'PSD-154', 1, 1, 3, 2, 0, 4, 463),
('2025-1', 'EDIN', 'RSP-132', 1, 1, 1, 2, 0, 2, 464),
('2025-1', 'EDIN', 'ART-243', 2, 1, 2, 2, 0, 3, 465),
('2025-1', 'EDIN', 'DVH-232', 2, 1, 1, 2, 0, 2, 466),
('2025-1', 'EDIN', 'DIG-243', 2, 1, 2, 2, 0, 3, 467),
('2025-1', 'EDIN', 'FOC-200', 2, 1, 0, 0, 0, 0, 468),
('2025-1', 'EDIN', 'IFE-243', 2, 1, 2, 2, 0, 3, 469),
('2025-1', 'EDIN', 'LEC-243', 2, 1, 2, 2, 0, 3, 470),
('2025-1', 'EDIN', 'PRA-245', 2, 1, 2, 8, 0, 8, 471),
('2025-1', 'EDIN', 'PSA-254', 2, 1, 3, 2, 0, 4, 472),
('2025-1', 'EDIN', 'CIN-343', 3, 1, 2, 2, 0, 3, 473),
('2025-1', 'EDIN', 'CSC-343', 3, 1, 2, 2, 0, 3, 474),
('2025-1', 'EDIN', 'FOC-300', 3, 1, 0, 0, 0, 0, 475),
('2025-1', 'EDIN', 'MAG-364', 3, 1, 2, 4, 0, 4, 476),
('2025-1', 'EDIN', 'OFE-332', 3, 1, 1, 2, 0, 2, 477),
('2025-1', 'EDIN', 'PEE-343', 3, 1, 2, 2, 0, 3, 478),
('2025-1', 'EDIN', 'PRA-345', 3, 1, 2, 8, 0, 8, 479),
('2025-1', 'EDIN', 'SAM-343', 3, 1, 2, 2, 0, 3, 480),
('2025-1', 'EDIN', 'DPC-443', 4, 1, 2, 2, 0, 3, 481),
('2025-1', 'EDIN', 'DPS-432', 4, 1, 1, 2, 0, 2, 482),
('2025-1', 'EDIN', 'EPS-432', 4, 1, 1, 2, 0, 2, 483),
('2025-1', 'EDIN', 'EDI-443', 4, 1, 2, 2, 0, 3, 484),
('2025-1', 'EDIN', 'FOC-400', 4, 1, 0, 0, 0, 0, 485),
('2025-1', 'EDIN', 'PEL-443', 4, 1, 2, 2, 0, 3, 486),
('2025-1', 'EDIN', 'PDE-443', 4, 1, 2, 2, 0, 3, 487),
('2025-1', 'EDIN', 'PRA-445', 4, 1, 2, 8, 0, 8, 488),
('2025-1', 'EDIN', 'APL-543', 5, 1, 2, 2, 0, 3, 489),
('2025-1', 'EDIN', 'CRE-543', 5, 1, 2, 2, 0, 3, 490),
('2025-1', 'EDIN', 'DIC-543', 5, 1, 2, 2, 0, 3, 491),
('2025-1', 'EDIN', 'DPS-543', 5, 1, 2, 2, 0, 3, 492),
('2025-1', 'EDIN', 'EMU-532', 5, 1, 1, 2, 0, 2, 493),
('2025-1', 'EDIN', 'FOC-500', 5, 1, 0, 0, 0, 0, 494),
('2025-1', 'EDIN', 'IVE-543', 5, 1, 2, 2, 0, 3, 495),
('2025-1', 'EDIN', 'PRA-545', 5, 1, 2, 8, 0, 8, 496),
('2025-1', 'EDIN', 'FOC-600', 6, 1, 0, 0, 0, 0, 497),
('2025-1', 'EDIN', 'PRA-647', 6, 1, 2, 16, 0, 16, 498),
('2025-1', 'EDINT', 'EFL-132', 1, 1, 1, 0, 0, 1, 573),
('2025-1', 'EDINT', 'FOC-100', 1, 1, 0, 0, 0, 0, 574),
('2025-1', 'EDINT', 'FOH-143', 1, 1, 2, 2, 0, 3, 575),
('2025-1', 'EDINT', 'LEC-143', 1, 1, 2, 2, 0, 3, 576),
('2025-1', 'EDINT', 'MEI-132', 1, 1, 1, 2, 0, 2, 577),
('2025-1', 'EDINT', 'PRA-145', 1, 1, 2, 8, 0, 8, 578),
('2025-1', 'EDINT', 'PSD-154', 1, 1, 3, 2, 0, 4, 579),
('2025-1', 'EDINT', 'RSP-132', 1, 1, 1, 2, 0, 2, 580),
('2025-1', 'EDINT', 'ART-243', 2, 1, 2, 0, 0, 2, 581),
('2025-1', 'EDINT', 'DVH-232', 2, 1, 2, 0, 0, 2, 582),
('2025-1', 'EDINT', 'DIG-243', 2, 1, 2, 2, 0, 3, 583),
('2025-1', 'EDINT', 'FOC-200', 2, 1, 0, 0, 0, 0, 584),
('2025-1', 'EDINT', 'IFE-243', 2, 1, 2, 2, 0, 3, 585),
('2025-1', 'EDINT', 'LEC-243', 2, 1, 2, 2, 0, 3, 586),
('2025-1', 'EDINT', 'PRA-245', 2, 1, 2, 8, 0, 8, 587),
('2025-1', 'EDINT', 'PSA-254', 2, 1, 3, 2, 0, 4, 588),
('2025-1', 'EDINT', 'CIN-343', 3, 1, 2, 2, 0, 3, 589),
('2025-1', 'EDINT', 'CSC-343', 3, 1, 2, 2, 0, 3, 590),
('2025-1', 'EDINT', 'FOC-300', 3, 1, 0, 0, 0, 0, 591),
('2025-1', 'EDINT', 'MAG-364', 3, 1, 2, 4, 0, 4, 592),
('2025-1', 'EDINT', 'OFE-332', 3, 1, 1, 2, 0, 2, 593),
('2025-1', 'EDINT', 'PEE-343', 3, 1, 2, 2, 0, 3, 594),
('2025-1', 'EDINT', 'PRA-345', 3, 1, 2, 8, 0, 8, 595),
('2025-1', 'EDINT', 'SAM-343', 3, 1, 2, 2, 0, 3, 596),
('2025-1', 'EDINT', 'DIC-443', 4, 1, 2, 2, 0, 3, 597),
('2025-1', 'EDINT', 'DIS-443', 4, 1, 2, 2, 0, 3, 598),
('2025-1', 'EDINT', 'DIM-443', 4, 1, 2, 2, 0, 3, 599),
('2025-1', 'EDINT', 'DIL-443', 4, 1, 2, 2, 0, 3, 600),
('2025-1', 'EDINT', 'EPS-432', 4, 1, 1, 2, 0, 2, 601),
('2025-1', 'EDINT', 'FOC-400', 4, 1, 0, 0, 0, 0, 602),
('2025-1', 'EDINT', 'PNE-443', 4, 1, 2, 2, 0, 3, 603),
('2025-1', 'EDINT', 'PRA-445', 4, 1, 2, 8, 0, 8, 604),
('2025-1', 'EDINT', 'CRE-543', 5, 1, 2, 2, 0, 3, 605),
('2025-1', 'EDINT', 'DEI-543', 5, 1, 2, 2, 0, 3, 606),
('2025-1', 'EDINT', 'EDT-543', 5, 1, 2, 2, 0, 3, 607),
('2025-1', 'EDINT', 'EVA-543', 5, 1, 2, 2, 0, 3, 608),
('2025-1', 'EDINT', 'EMU-532', 5, 1, 1, 2, 0, 2, 609),
('2025-1', 'EDINT', 'FOC-500', 5, 1, 0, 0, 0, 0, 610),
('2025-1', 'EDINT', 'IVE-543', 5, 1, 2, 2, 0, 3, 611),
('2025-1', 'EDINT', 'PRA-545', 5, 1, 2, 8, 0, 8, 612),
('2025-1', 'EDINT', 'FOC-600', 6, 1, 0, 0, 0, 0, 613),
('2025-1', 'EDINT', 'PRA-647', 6, 1, 2, 8, 0, 8, 614),
('2025-1', 'EDESP', 'EFL-132', 1, 1, 1, 2, 0, 2, 615),
('2025-1', 'EDESP', 'FOC-100', 1, 1, 0, 0, 0, 0, 616),
('2025-1', 'EDESP', 'FOH-143', 1, 1, 2, 2, 0, 3, 617),
('2025-1', 'EDESP', 'LEC-143', 1, 1, 2, 2, 0, 3, 618),
('2025-1', 'EDESP', 'MEI-132', 1, 1, 1, 2, 0, 2, 619),
('2025-1', 'EDESP', 'PRA-145', 1, 1, 2, 8, 0, 8, 620),
('2025-1', 'EDESP', 'PSD-154', 1, 1, 3, 2, 0, 4, 621),
('2025-1', 'EDESP', 'RSP-132', 1, 1, 1, 2, 0, 2, 622),
('2025-1', 'EDESP', 'ART-243', 2, 1, 2, 2, 0, 3, 623),
('2025-1', 'EDESP', 'DVH-232', 2, 1, 1, 2, 0, 2, 624),
('2025-1', 'EDESP', 'DIG-243', 2, 1, 2, 2, 0, 3, 625),
('2025-1', 'EDESP', 'FOC-200', 2, 1, 0, 0, 0, 0, 626),
('2025-1', 'EDESP', 'IFE-243', 2, 1, 2, 2, 0, 3, 627),
('2025-1', 'EDESP', 'LEC-243', 2, 1, 2, 2, 0, 3, 628),
('2025-1', 'EDESP', 'PRA-245', 2, 1, 2, 8, 0, 8, 629),
('2025-1', 'EDESP', 'PSA-254', 2, 1, 3, 2, 0, 4, 630),
('2025-1', 'EDESP', 'CIN-343', 3, 1, 2, 2, 0, 3, 631),
('2025-1', 'EDESP', 'CSC-343', 3, 1, 2, 2, 0, 3, 632),
('2025-1', 'EDESP', 'FOC-300', 3, 1, 0, 0, 0, 0, 633),
('2025-1', 'EDESP', 'MAG-364', 3, 1, 2, 4, 0, 4, 634),
('2025-1', 'EDESP', 'OFE-332', 3, 1, 1, 2, 0, 2, 635),
('2025-1', 'EDESP', 'PRA-345', 3, 1, 2, 8, 0, 8, 636),
('2025-1', 'EDESP', 'PEE-343', 3, 1, 2, 2, 0, 3, 637),
('2025-1', 'EDESP', 'SAM-343', 3, 1, 2, 2, 0, 3, 638),
('2025-1', 'EDESP', 'DIL-443', 4, 1, 2, 2, 0, 3, 639),
('2025-1', 'EDESP', 'DIM-443', 4, 1, 2, 2, 0, 3, 640),
('2025-1', 'EDESP', 'EPS-432', 4, 1, 1, 2, 0, 2, 641),
('2025-1', 'EDESP', 'FOC-400', 4, 1, 0, 0, 0, 0, 642),
('2025-1', 'EDESP', 'PDD-443', 4, 1, 2, 2, 0, 3, 643),
('2025-1', 'EDESP', 'PEA-443', 4, 1, 2, 2, 0, 3, 644),
('2025-1', 'EDESP', 'PRA-445', 4, 1, 2, 8, 0, 8, 645),
('2025-1', 'EDESP', 'PSE-443', 4, 1, 2, 2, 0, 3, 646),
('2025-1', 'EDESP', 'DIA-543', 5, 1, 2, 2, 0, 3, 647),
('2025-1', 'EDESP', 'EMU-532', 5, 1, 1, 2, 0, 2, 648),
('2025-1', 'EDESP', 'FOC-500', 5, 1, 0, 0, 0, 0, 649),
('2025-1', 'EDESP', 'IVE-543', 5, 1, 2, 2, 0, 3, 650),
('2025-1', 'EDESP', 'PRA-545', 5, 1, 2, 8, 0, 8, 651),
('2025-1', 'EDESP', 'PAT-543', 5, 1, 2, 2, 0, 3, 652),
('2025-1', 'EDESP', 'PSI-543', 5, 1, 2, 2, 0, 3, 653),
('2025-1', 'EDESP', 'PRE-543', 5, 1, 2, 2, 0, 3, 654),
('2025-1', 'EDESP', 'FOC-600', 6, 1, 0, 0, 0, 0, 655),
('2025-1', 'EDESP', 'PRA-647', 6, 1, 2, 16, 0, 16, 656);

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` mediumtext DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id`, `nombre`, `descripcion`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'Administrador del sistema', 1, '2026-01-05 17:08:51', '2026-01-05 17:08:51'),
(2, 'Docente', 'Docente de la institución', 1, '2026-01-05 17:08:51', '2026-01-05 17:08:51'),
(3, 'Estudiante', 'Estudiante de la institución', 1, '2026-01-05 17:08:51', '2026-01-05 17:08:51');

-- --------------------------------------------------------

--
-- Table structure for table `rubrica`
--

CREATE TABLE `rubrica` (
  `id` int(11) NOT NULL,
  `nombre_rubrica` varchar(200) DEFAULT NULL,
  `cedula_docente` varchar(20) DEFAULT NULL,
  `instrucciones` mediumtext DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_tipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rubrica`
--

INSERT INTO `rubrica` (`id`, `nombre_rubrica`, `cedula_docente`, `instrucciones`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `id_tipo`) VALUES
(1, 'Rúbrica de Evaluación de Proyectos de Software', '12345689', 'Evalúa proyectos de desarrollo de software considerando análisis, diseño, implementación y documentación', 1, '2025-09-15 09:00:00', '2026-02-17 10:50:17', 2),
(2, 'Rúbrica de Presentación Oral', NULL, 'Evalúa la capacidad de presentación oral de trabajos académicos', 1, '2025-09-15 10:00:00', '2026-02-16 18:27:43', 1),
(3, 'Rúbrica de Trabajo en Equipo', '12345689', 'Evalúa las competencias de trabajo colaborativo', 1, '2025-09-16 08:00:00', '2026-02-17 10:11:59', 3),
(4, 'Rúbrica de Investigación Científica', NULL, 'Evalúa trabajos de investigación considerando metodología, análisis y conclusiones', 1, '2025-09-16 09:00:00', '2026-02-16 18:27:43', 2),
(6, 'regreg', '31987430', 'wefwfe', 1, '2026-02-24 22:04:22', '2026-02-24 22:04:22', 1),
(7, 'Proyecto de Inclusión en Contabilidad Superior', '31987430', 'Diseñar una propuesta de adaptación contable para una empresa que desea incluir laboralmente a personas con diversidad funcional (ej. discapacidad visual o auditiva), asegurando el cumplimiento de las normas internacionales de información financiera (NIIF).', 1, '2026-02-24 22:13:41', '2026-02-24 22:13:41', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rubrica_uso`
--

CREATE TABLE `rubrica_uso` (
  `id_eval` int(11) NOT NULL,
  `id_rubrica` int(11) NOT NULL,
  `estado` varchar(15) DEFAULT 'En Revision'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rubrica_uso`
--

INSERT INTO `rubrica_uso` (`id_eval`, `id_rubrica`, `estado`) VALUES
(2, 1, 'En Revision'),
(3, 1, 'En Revision'),
(4, 4, 'En Revision'),
(6, 2, 'En Revision'),
(8, 2, 'En Revision'),
(10, 4, 'En Revision'),
(12, 2, 'En Revision'),
(16, 3, 'En Revision'),
(19, 2, 'En Revision'),
(20, 3, 'En Revision'),
(21, 4, 'En Revision'),
(22, 2, 'En Revision');

-- --------------------------------------------------------

--
-- Table structure for table `seccion`
--

CREATE TABLE `seccion` (
  `id_materia_plan` int(11) NOT NULL,
  `letra` varchar(10) NOT NULL,
  `capacidad_maxima` int(11) DEFAULT 40,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seccion`
--

INSERT INTO `seccion` (`id_materia_plan`, `letra`, `capacidad_maxima`, `activo`, `fecha_creacion`, `fecha_actualizacion`, `id`) VALUES
(1, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 1),
(2, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 2),
(3, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 3),
(4, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 4),
(5, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 5),
(6, 'A', 25, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 6),
(7, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 7),
(8, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 8),
(9, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 9),
(10, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 10),
(11, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 11),
(12, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 12),
(13, 'A', 25, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 13),
(14, 'A', 25, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 14),
(15, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 15),
(16, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 16),
(17, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 17),
(18, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 18),
(19, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 19),
(20, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 20),
(21, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 21),
(22, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 22),
(23, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 23),
(24, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 24),
(25, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 25),
(26, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 26),
(27, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 27),
(28, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 28),
(29, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 29),
(30, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 30),
(31, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 31),
(32, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 32),
(33, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 33),
(34, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 34),
(35, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 35),
(36, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 36),
(37, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 37),
(38, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 38),
(39, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 39),
(40, 'A', 30, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 40),
(41, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 41),
(42, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 42),
(43, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 43),
(44, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 44),
(45, 'A', 40, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 45),
(46, 'A', 35, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 46),
(47, 'A', 20, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 47),
(48, 'A', 50, 1, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 48),
(49, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 49),
(50, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 50),
(51, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 51),
(52, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 52),
(53, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 53),
(54, 'A', 25, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 54),
(55, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 55),
(56, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 56),
(57, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 57),
(58, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 58),
(59, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 59),
(60, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 60),
(61, 'A', 25, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 61),
(62, 'A', 25, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 62),
(63, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 63),
(64, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 64),
(65, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 65),
(66, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 66),
(67, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 67),
(68, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 68),
(69, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 69),
(70, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 70),
(71, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 71),
(72, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 72),
(73, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 73),
(74, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 74),
(75, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 75),
(76, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 76),
(77, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 77),
(78, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 78),
(79, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 79),
(80, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 80),
(81, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 81),
(82, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 82),
(83, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 83),
(84, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 84),
(85, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 85),
(86, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 86),
(87, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 87),
(88, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 88),
(89, 'A', 30, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 89),
(90, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 90),
(91, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 91),
(92, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 92),
(93, 'A', 40, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 93),
(94, 'A', 35, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 94),
(95, 'A', 50, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 95),
(96, 'A', 20, 1, '2026-01-05 17:22:51', '2026-01-05 17:22:51', 96),
(217, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 97),
(218, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 98),
(219, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 99),
(220, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 100),
(221, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 101),
(222, 'A', 35, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 102),
(223, 'A', 40, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 103),
(224, 'A', 40, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 104),
(225, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 105),
(226, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 106),
(227, 'A', 40, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 107),
(228, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 108),
(229, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 109),
(230, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 110),
(231, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 111),
(232, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 112),
(233, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 113),
(234, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 114),
(235, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 115),
(236, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 116),
(237, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 117),
(238, 'A', 40, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 118),
(239, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 119),
(240, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 120),
(241, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 121),
(242, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 122),
(243, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 123),
(244, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 124),
(245, 'A', 35, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 125),
(246, 'A', 40, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 126),
(247, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 127),
(248, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 128),
(249, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 129),
(250, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 130),
(251, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 131),
(252, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 132),
(253, 'A', 30, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 133),
(254, 'A', 25, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 134),
(255, 'A', 20, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 135),
(256, 'A', 20, 1, '2026-01-05 18:05:47', '2026-01-05 18:05:47', 136),
(321, 'A', 25, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 137),
(322, 'A', 30, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 138),
(323, 'A', 25, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 139),
(324, 'A', 25, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 140),
(325, 'A', 30, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 141),
(326, 'A', 30, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 142),
(327, 'A', 40, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 143),
(328, 'A', 25, 1, '2026-01-05 20:02:29', '2026-01-05 20:02:29', 144),
(329, 'A', 40, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 145),
(330, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 146),
(331, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 147),
(332, 'A', 25, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 148),
(333, 'A', 25, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 149),
(334, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 150),
(335, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 151),
(336, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 152),
(337, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 153),
(338, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 154),
(339, 'A', 40, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 155),
(340, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 156),
(341, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 157),
(342, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 158),
(343, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 159),
(344, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 160),
(345, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 161),
(346, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 162),
(347, 'A', 40, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 163),
(348, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 164),
(349, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 165),
(350, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 166),
(351, 'A', 25, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 167),
(352, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 168),
(353, 'A', 40, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 169),
(354, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 170),
(355, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 171),
(356, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 172),
(357, 'A', 40, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 173),
(358, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 174),
(359, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 175),
(360, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 176),
(361, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 177),
(362, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 178),
(363, 'A', 15, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 179),
(364, 'A', 30, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 180),
(365, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 181),
(366, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 182),
(367, 'A', 20, 1, '2026-01-05 20:02:30', '2026-01-05 20:02:30', 183),
(368, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 184),
(369, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 185),
(370, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 186),
(371, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 187),
(372, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 188),
(373, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 189),
(374, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 190),
(375, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 191),
(376, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 192),
(377, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 193),
(378, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 194),
(379, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 195),
(380, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 196),
(381, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 197),
(382, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 198),
(383, 'A', 15, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 199),
(384, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 200),
(385, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 201),
(386, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 202),
(387, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 203),
(388, 'A', 15, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 204),
(389, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 205),
(390, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 206),
(391, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 207),
(392, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 208),
(393, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 209),
(394, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 210),
(395, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 211),
(396, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 212),
(397, 'A', 25, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 213),
(398, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 214),
(399, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 215),
(400, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 216),
(401, 'A', 15, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 217),
(402, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 218),
(403, 'A', 40, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 219),
(404, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 220),
(405, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 221),
(406, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 222),
(407, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 223),
(408, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 224),
(409, 'A', 15, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 225),
(410, 'A', 15, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 226),
(411, 'A', 30, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 227),
(412, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 228),
(413, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 229),
(414, 'A', 20, 1, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 230),
(415, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 231),
(416, 'A', 25, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 232),
(417, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 233),
(418, 'A', 25, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 234),
(419, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 235),
(420, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 236),
(421, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 237),
(422, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 238),
(423, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 239),
(424, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 240),
(425, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 241),
(426, 'A', 25, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 242),
(427, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 243),
(428, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 244),
(429, 'A', 40, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 245),
(430, 'A', 40, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 246),
(431, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 247),
(432, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 248),
(433, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 249),
(434, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 250),
(435, 'A', 25, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 251),
(436, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 252),
(437, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 253),
(438, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 254),
(439, 'A', 40, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 255),
(440, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 256),
(441, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 257),
(442, 'A', 40, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 258),
(443, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 259),
(444, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 260),
(445, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 261),
(446, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 262),
(447, 'A', 40, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 263),
(448, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 264),
(449, 'A', 15, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 265),
(450, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 266),
(451, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 267),
(452, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 268),
(453, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 269),
(454, 'A', 30, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 270),
(455, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 271),
(456, 'A', 20, 1, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 272),
(457, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 273),
(458, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 274),
(459, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 275),
(460, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 276),
(461, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 277),
(462, 'A', 20, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 278),
(463, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 279),
(464, 'A', 40, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 280),
(465, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 281),
(466, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 282),
(467, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 283),
(468, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 284),
(469, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 285),
(470, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 286),
(471, 'A', 15, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 287),
(472, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 288),
(473, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 289),
(474, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 290),
(475, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 291),
(476, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 292),
(477, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 293),
(478, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 294),
(479, 'A', 15, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 295),
(480, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 296),
(481, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 297),
(482, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 298),
(483, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 299),
(484, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 300),
(485, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 301),
(486, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 302),
(487, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 303),
(488, 'A', 15, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 304),
(489, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 305),
(490, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 306),
(491, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 307),
(492, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 308),
(493, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 309),
(494, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 310),
(495, 'A', 25, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 311),
(496, 'A', 15, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 312),
(497, 'A', 30, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 313),
(498, 'A', 10, 1, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 314),
(573, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 315),
(574, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 316),
(575, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 317),
(576, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 318),
(577, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 319),
(578, 'A', 20, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 320),
(579, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 321),
(580, 'A', 40, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 322),
(581, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 323),
(582, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 324),
(583, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 325),
(584, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 326),
(585, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 327),
(586, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 328),
(587, 'A', 20, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 329),
(588, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 330),
(589, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 331),
(590, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 332),
(591, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 333),
(592, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 334),
(593, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 335),
(594, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 336),
(595, 'A', 20, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 337),
(596, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 338),
(597, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 339),
(598, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 340),
(599, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 341),
(600, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 342),
(601, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 343),
(602, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 344),
(603, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 345),
(604, 'A', 20, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 346),
(605, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 347),
(606, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 348),
(607, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 349),
(608, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 350),
(609, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 351),
(610, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 352),
(611, 'A', 25, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 353),
(612, 'A', 20, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 354),
(613, 'A', 30, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 355),
(614, 'A', 15, 1, '2026-01-05 20:31:20', '2026-01-05 20:31:20', 356),
(615, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 357),
(616, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 358),
(617, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 359),
(618, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 360),
(619, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 361),
(620, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 362),
(621, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 363),
(622, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 364),
(623, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 365),
(624, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 366),
(625, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 367),
(626, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 368),
(627, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 369),
(628, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 370),
(629, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 371),
(630, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 372),
(631, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 373),
(632, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 374),
(633, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 375),
(634, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 376),
(635, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 377),
(636, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 378),
(637, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 379),
(638, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 380),
(639, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 381),
(640, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 382),
(641, 'A', 25, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 383),
(642, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 384),
(643, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 385),
(644, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 386),
(645, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 387),
(646, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 388),
(647, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 389),
(648, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 390),
(649, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 391),
(650, 'A', 20, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 392),
(651, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 393),
(652, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 394),
(653, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 395),
(654, 'A', 15, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 396),
(655, 'A', 30, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 397),
(656, 'A', 10, 1, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 398);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('0uiTL0cNjov7taUns3rFL16jWpBosTEW', 1772212942, '{\"cookie\":{\"originalMaxAge\":1199990,\"expires\":\"2026-02-27T17:22:21.826Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"login\":true,\"username\":\"Heracles Sanchez\",\"cedula\":\"31987430\",\"email\":\"heracles.sanchez@gmail.com\",\"id_rol\":1,\"activo\":1,\"ultimaActividad\":1772211741709,\"tipo\":\"Administrador\"}');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_rubrica`
--

CREATE TABLE `tipo_rubrica` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo_rubrica`
--

INSERT INTO `tipo_rubrica` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Rubrica estudiantil', NULL),
(2, 'Rubrica estudiantil', NULL),
(3, 'Rubrica estudiantil', NULL),
(105, 'Rubrica de Evaluación Docente', 'Rubrica para Evaluación Docente');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_semestre`
--

CREATE TABLE `tipo_semestre` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `descripcion` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo_semestre`
--

INSERT INTO `tipo_semestre` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Técnico', 'Semestre académico del periodo técnico'),
(2, 'Avanzado', 'Semestre académico para títulos como ingenierías, usualmente después del 6to semestre del técnico.');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apeliido` varchar(100) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `fecha_ult_acceso` timestamp NULL DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `fecha_bloqueo` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`cedula`, `nombre`, `apeliido`, `id_rol`, `activo`, `fecha_ult_acceso`, `intentos_fallidos`, `fecha_bloqueo`, `fecha_creacion`, `fecha_actualizacion`, `email`, `password`, `fecha_nac`) VALUES
('12345678', 'María', 'González', 2, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'maria.gonzalez@instituto.edu', '4545', NULL),
('12345679', 'Roberto', 'Mendoza', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'roberto.mendoza@instituto.edu', '4545', NULL),
('12345680', 'Patricia', 'Silva', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'patricia.silva@instituto.edu', '4545', NULL),
('12345681', 'Jorge', 'Vargas', 2, 0, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'jorge.vargas@instituto.edu', '4545', NULL),
('12345682', 'Gabriela', 'Morales', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'gabriela.morales@instituto.edu', '4545', NULL),
('12345683', 'Ricardo', 'Castro', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'ricardo.castro@instituto.edu', '4545', NULL),
('12345684', 'Heracles', 'Sánchez Coello', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'SANCHEZHERACLES@GMAIL.COM', '4545', NULL),
('12345685', 'Francisco', 'Nuñez', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'francisco.nunez@instituto.edu', '4545', NULL),
('12345686', 'Mónica', 'Delgado', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'monica.delgado@instituto.edu', '4545', NULL),
('12345687', 'Alberto', 'Ortega', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'alberto.ortega@instituto.edu', '4545', NULL),
('12345688', 'Claudia', 'Peña', 2, 1, NULL, 0, NULL, '2026-01-05 17:16:12', '2026-01-05 17:16:12', 'claudia.pena@instituto.edu', '4545', NULL),
('12345689', 'Miguel', 'Fernández', 2, 1, NULL, 0, NULL, '2026-01-05 17:34:56', '2026-01-05 17:34:56', 'miguel.fernandez@instituto.edu', '4545', NULL),
('12345690', 'Carolina', 'Bermúdez', 2, 1, NULL, 0, NULL, '2026-01-05 17:34:56', '2026-01-05 17:34:56', 'carolina.bermudes@instituto.edu', '4545', NULL),
('12345691', 'Raúl', 'Suárez', 2, 1, NULL, 0, NULL, '2026-01-05 17:34:56', '2026-01-05 17:34:56', 'raul.suarez@instituto.edu', '4545', NULL),
('12345692', 'Daniela', 'Acosta', 2, 1, NULL, 0, NULL, '2026-01-05 17:34:56', '2026-01-05 17:34:56', 'daniela.acosta@instituto.edu', '4545', NULL),
('12345693', 'Oscar', 'Chávez', 2, 1, NULL, 0, NULL, '2026-01-05 17:34:56', '2026-01-05 17:34:56', 'oscar.chavez@instituto.edu', '4545', NULL),
('12345694', 'Javier', 'Rivas', 2, 1, NULL, 0, NULL, '2026-01-05 19:59:10', '2026-01-05 19:59:10', 'javier.rivas@instituto.edu', '4545', NULL),
('12345695', 'Elena', 'Navarro', 2, 1, NULL, 0, NULL, '2026-01-05 19:59:10', '2026-01-05 19:59:10', 'elena.navarro@instituto.edu', '4545', NULL),
('12345696', 'Pablo', 'Molina', 2, 1, NULL, 0, NULL, '2026-01-05 19:59:10', '2026-01-05 19:59:10', 'pablo.molina@instituto.edu', '4545', NULL),
('12345697', 'Verónica', 'Cordero', 2, 1, NULL, 0, NULL, '2026-01-05 19:59:10', '2026-01-05 19:59:10', 'veronica.cordero@instituto.edu', '4545', NULL),
('12345698', 'Héctor', 'Salazar', 2, 1, NULL, 0, NULL, '2026-01-05 19:59:10', '2026-01-05 19:59:10', 'hector.salazar@instituto.edu', '4545', NULL),
('12345699', 'Arturo', 'Contreras', 2, 1, NULL, 0, NULL, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 'arturo.contreras@instituto.edu', '4545', NULL),
('12345700', 'Rebeca', 'Márquez', 2, 1, NULL, 0, NULL, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 'rebeca.marquez@instituto.edu', '4545', NULL),
('12345701', 'Simón', 'Borges', 2, 1, NULL, 0, NULL, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 'simon.borges@instituto.edu', '4545', NULL),
('12345702', 'Natalia', 'Ferrer', 2, 1, NULL, 0, NULL, '2026-01-05 20:07:29', '2026-01-05 20:07:29', 'natalia.ferrer@instituto.edu', '4545', NULL),
('12345703', 'Rodrigo', 'Soto', 2, 1, NULL, 0, NULL, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 'rodrigo.soto@instituto.edu', '4545', NULL),
('12345704', 'Beatriz', 'Lugo', 2, 1, NULL, 0, NULL, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 'beatriz.lugo@instituto.edu', '4545', NULL),
('12345705', 'Federico', 'Paredes', 2, 1, NULL, 0, NULL, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 'federico.paredes@instituto.edu', '4545', NULL),
('12345706', 'Adriana', 'Rangel', 2, 1, NULL, 0, NULL, '2026-01-05 20:12:08', '2026-01-05 20:12:08', 'adriana.rangel@instituto.edu', '4545', NULL),
('12345707', 'Luisa', 'Valdez', 2, 1, NULL, 0, NULL, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 'luisa.valdez@instituto.edu', '4545', NULL),
('12345708', 'Tomás', 'Méndez', 2, 1, NULL, 0, NULL, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 'tomas.mendez@instituto.edu', '4545', NULL),
('12345709', 'Clara', 'Ortega', 2, 1, NULL, 0, NULL, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 'clara.ortega@instituto.edu', '4545', NULL),
('12345710', 'Santiago', 'Campos', 2, 1, NULL, 0, NULL, '2026-01-05 20:16:14', '2026-01-05 20:16:14', 'santiago.campos@instituto.edu', '4545', NULL),
('12345711', 'Marta', 'Reyes', 2, 1, NULL, 0, NULL, '2026-01-05 20:28:17', '2026-01-05 20:28:17', 'marta.reyes@instituto.edu', '4545', NULL),
('12345712', 'Alonso', 'Sánchez', 2, 1, NULL, 0, NULL, '2026-01-05 20:28:17', '2026-01-05 20:28:17', 'alonso.sanchez@instituto.edu', '4545', NULL),
('12345713', 'Lucía', 'Bravo', 2, 1, NULL, 0, NULL, '2026-01-05 20:28:17', '2026-01-05 20:28:17', 'lucia.bravo@instituto.edu', '4545', NULL),
('12345714', 'César', 'Montes', 2, 1, NULL, 0, NULL, '2026-01-05 20:28:17', '2026-01-05 20:28:17', 'cesar.montes@instituto.edu', '4545', NULL),
('12345715', 'Rosario', 'Guzmán', 2, 1, NULL, 0, NULL, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 'rosario.guzman@instituto.edu', '4545', NULL),
('12345716', 'Mateo', 'Cárdenas', 2, 1, NULL, 0, NULL, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 'mateo.cardenas@instituto.edu', '4545', NULL),
('12345717', 'Valeria', 'Miranda', 2, 1, NULL, 0, NULL, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 'valeria.miranda@instituto.edu', '4545', NULL),
('12345718', 'Ignacio', 'Ríos', 2, 1, NULL, 0, NULL, '2026-01-05 20:36:17', '2026-01-05 20:36:17', 'ignacio.rios@instituto.edu', '4545', NULL),
('23456789', 'Ana', 'Pérez', 2, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'ana.perez@instituto.edu', '4545', NULL),
('27000001', 'Juan', 'Pérez', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'juan.perez@instituto.edu', '4545', NULL),
('27000002', 'María', 'García', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'maria.garcia@instituto.edu', '4545', NULL),
('27000003', 'Carlos', 'López', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'carlos.lopez@instituto.edu', '4545', NULL),
('27000004', 'Ana', 'Rodríguez', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'ana.rodriguez@instituto.edu', '4545', NULL),
('27000005', 'Pedro', 'Martínez', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'pedro.martinez@instituto.edu', '4545', NULL),
('27000006', 'Laura', 'Sánchez', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'laura.sanchez@instituto.edu', '4545', NULL),
('27000007', 'José', 'Hernández', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'jose.hernandez@instituto.edu', '4545', NULL),
('27000008', 'Carmen', 'Díaz', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'carmen.diaz@instituto.edu', '4545', NULL),
('27000009', 'Miguel', 'Torres', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'miguel.torres@instituto.edu', '4545', NULL),
('27000010', 'Sofía', 'Ramírez', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'sofia.ramirez@instituto.edu', '4545', NULL),
('27000011', 'Diego', 'Flores', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'diego.flores@instituto.edu', '4545', NULL),
('27000012', 'Valentina', 'Castro', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'valentina.castro@instituto.edu', '4545', NULL),
('27000013', 'Andrés', 'Ortega', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'andres.ortega@instituto.edu', '4545', NULL),
('27000014', 'Camila', 'Rojas', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'camila.rojas@instituto.edu', '4545', NULL),
('27000015', 'Fernando', 'Mendoza', 3, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'fernando.mendoza@instituto.edu', '4545', NULL),
('27000016', 'Carlos', 'Alvarado', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'carlos.alvarado@instituto.edu', '4545', NULL),
('27000017', 'Mariana', 'Brito', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'mariana.brito@instituto.edu', '4545', NULL),
('27000018', 'José', 'Cáceres', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'jose.caceres@instituto.edu', '4545', NULL),
('27000019', 'Ana', 'Delgado', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'ana.delgado@instituto.edu', '4545', NULL),
('27000020', 'Luis', 'Espinoza', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'luis.espinoza@instituto.edu', '4545', NULL),
('27000021', 'Carmen', 'Fuentes', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'carmen.fuentes@instituto.edu', '4545', NULL),
('27000022', 'Miguel', 'Gómez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'miguel.gomez@instituto.edu', '4545', NULL),
('27000023', 'Sara', 'Herrera', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'sara.herrera@instituto.edu', '4545', NULL),
('27000024', 'Pedro', 'Iglesias', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'pedro.iglesias@instituto.edu', '4545', NULL),
('27000025', 'Laura', 'Jiménez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'laura.jimenez@instituto.edu', '4545', NULL),
('27000026', 'Juan', 'Klein', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'juan.klein@instituto.edu', '4545', NULL),
('27000027', 'Elena', 'López', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'elena.lopez@instituto.edu', '4545', NULL),
('27000028', 'Ricardo', 'Mendoza', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'ricardo.mendoza@instituto.edu', '4545', NULL),
('27000029', 'Patricia', 'Nuñez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'patricia.nunez@instituto.edu', '4545', NULL),
('27000030', 'Fernando', 'Ortiz', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'fernando.ortiz@instituto.edu', '4545', NULL),
('27000031', 'Gabriela', 'Pérez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'gabriela.perez@instituto.edu', '4545', NULL),
('27000032', 'Andrés', 'Quintero', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'andres.quintero@instituto.edu', '4545', NULL),
('27000033', 'Claudia', 'Ramírez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'claudia.ramirez@instituto.edu', '4545', NULL),
('27000034', 'Diego', 'Suárez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'diego.suarez@instituto.edu', '4545', NULL),
('27000035', 'Valeria', 'Torres', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'valeria.torres@instituto.edu', '4545', NULL),
('27000036', 'Samuel', 'Urbina', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'samuel.urbina@instituto.edu', '4545', NULL),
('27000037', 'Natalia', 'Vargas', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'natalia.vargas@instituto.edu', '4545', NULL),
('27000038', 'Héctor', 'Wong', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'hector.wong@instituto.edu', '4545', NULL),
('27000039', 'Isabel', 'Ximénez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'isabel.ximenez@instituto.edu', '4545', NULL),
('27000040', 'Oscar', 'Yépez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'oscar.yepez@instituto.edu', '4545', NULL),
('27000041', 'Rosa', 'Zambrano', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'rosa.zambrano@instituto.edu', '4545', NULL),
('27000042', 'Mario', 'Acosta', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'mario.acosta@instituto.edu', '4545', NULL),
('27000043', 'Teresa', 'Bermúdez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'teresa.bermudez@instituto.edu', '4545', NULL),
('27000044', 'Felipe', 'Castro', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'felipe.castro@instituto.edu', '4545', NULL),
('27000045', 'Lucía', 'Díaz', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'lucia.diaz@instituto.edu', '4545', NULL),
('27000046', 'Roberto', 'Escobar', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'roberto.escobar@instituto.edu', '4545', NULL),
('27000047', 'Mónica', 'Flores', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'monica.flores@instituto.edu', '4545', NULL),
('27000048', 'Javier', 'García', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'javier.garcia@instituto.edu', '4545', NULL),
('27000049', 'Beatriz', 'Hernández', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'beatriz.hernandez@instituto.edu', '4545', NULL),
('27000050', 'Alberto', 'Ibarra', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'alberto.ibarra@instituto.edu', '4545', NULL),
('27000051', 'Cecilia', 'Jara', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'cecilia.jara@instituto.edu', '4545', NULL),
('27000052', 'Raúl', 'Katz', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'raul.katz@instituto.edu', '4545', NULL),
('27000053', 'Diana', 'León', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'diana.leon@instituto.edu', '4545', NULL),
('27000054', 'Simón', 'Márquez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'simon.marquez@instituto.edu', '4545', NULL),
('27000055', 'Eugenia', 'Navarro', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'eugenia.navarro@instituto.edu', '4545', NULL),
('27000056', 'César', 'Ortega', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'cesar.ortega@instituto.edu', '4545', NULL),
('27000057', 'Adriana', 'Paredes', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'adriana.paredes@instituto.edu', '4545', NULL),
('27000058', 'Manuel', 'Quintana', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'manuel.quintana@instituto.edu', '4545', NULL),
('27000059', 'Silvia', 'Rojas', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'silvia.rojas@instituto.edu', '4545', NULL),
('27000060', 'Tomás', 'Sánchez', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'tomas.sanchez@instituto.edu', '4545', NULL),
('27000061', 'Victoria', 'Tapia', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'victoria.tapia@instituto.edu', '4545', NULL),
('27000062', 'Víctor', 'Urdaneta', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'victor.urdaneta@instituto.edu', '4545', NULL),
('27000063', 'Ximena', 'Valencia', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'ximena.valencia@instituto.edu', '4545', NULL),
('27000064', 'Walter', 'Wilson', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'walter.wilson@instituto.edu', '4545', NULL),
('27000065', 'Yolanda', 'Zapata', 3, 1, NULL, 0, NULL, '2026-01-05 21:07:25', '2026-01-05 21:07:25', 'yolanda.zapata@instituto.edu', '4545', NULL),
('31987430', 'Heracles', 'Sanchez', 1, 1, NULL, 0, NULL, '2026-01-29 23:02:35', '2026-01-29 23:02:35', 'heracles.sanchez@gmail.com', '4545', '2006-04-09'),
('34567890', 'Luis', 'Martínez', 2, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'luis.martinez@instituto.edu', '4545', NULL),
('45678901', 'Laura', 'Hernández', 2, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'laura.hernandez@instituto.edu', '4545', NULL),
('87654321', 'Carlos', 'Rodríguez', 2, 1, NULL, 0, NULL, '2026-01-05 17:11:14', '2026-01-05 17:11:14', 'carlos.rodriguez@instituto.edu', '4545', NULL),
('99999998', 'Sara', 'Castañeda', 2, 1, NULL, 0, NULL, '2026-02-17 15:15:14', '2026-02-17 15:15:14', 'inspirarte@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuario_docente`
--

CREATE TABLE `usuario_docente` (
  `cedula_usuario` varchar(20) NOT NULL,
  `especializacion` varchar(100) NOT NULL,
  `descripcion` mediumtext DEFAULT NULL,
  `telf` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario_docente`
--

INSERT INTO `usuario_docente` (`cedula_usuario`, `especializacion`, `descripcion`, `telf`) VALUES
('12345678', 'Administración de Empresas', 'Especialista en administración y finanzas corporativas', NULL),
('12345679', 'Administración de Producción', 'Especialista en procesos productivos y gestión de operaciones', NULL),
('12345680', 'Contabilidad de Costos', 'Experta en sistemas de costos y presupuestos', NULL),
('12345681', 'Estadística', 'Especialista en análisis estadístico y métodos cuantitativos', NULL),
('12345682', 'Legislación', 'Abogada especializada en derecho laboral y mercantil', NULL),
('12345683', 'Matemáticas', 'Matemático con especialización en aplicaciones empresariales', NULL),
('12345684', 'magister', '', '04221323458'),
('12345685', 'Informática', 'Especialista en sistemas informáticos y aplicaciones', NULL),
('12345686', 'Mercadotecnia', 'Experta en marketing y estrategias comerciales', NULL),
('12345687', 'Finanzas', 'Especialista en análisis financiero y evaluación de proyectos', NULL),
('12345688', 'Recursos Humanos', 'Experta en gestión del talento y desarrollo organizacional', NULL),
('12345689', 'Programación y Algoritmos', 'Especialista en desarrollo de software y algoritmia', NULL),
('12345690', 'especialista', 'Experta en sistemas operativos y arquitectura de redes', '04145544855'),
('12345691', 'Bases de Datos', 'Especialista en diseño y administración de bases de datos', NULL),
('12345692', 'Matemáticas Computacionales', 'Matemático especializado en computación', NULL),
('12345693', 'Ingeniería de Software', 'Ingeniero de software con maestría en desarrollo de sistemas', NULL),
('12345694', 'Circuitos Electrónicos', 'Especialista en diseño y análisis de circuitos electrónicos', NULL),
('12345695', 'Electrónica Digital', 'Experta en sistemas digitales y microprocesadores', NULL),
('12345696', 'Comunicaciones', 'Especialista en sistemas de comunicaciones electrónicas', NULL),
('12345697', 'Instrumentación Electrónica', 'Experta en instrumentación y mediciones electrónicas', NULL),
('12345698', 'Física Aplicada', 'Físico especializado en aplicaciones electrónicas', NULL),
('12345699', 'Electrotecnia', 'Especialista en sistemas eléctricos de potencia', NULL),
('12345700', 'Instalaciones Eléctricas', 'Experta en diseño de instalaciones eléctricas', NULL),
('12345701', 'Plantas Eléctricas y Líneas', 'Especialista en plantas eléctricas y líneas de transmisión', NULL),
('12345702', 'Automatismos Industriales', 'Experto en sistemas de automatización industrial', NULL),
('12345703', 'Máquinas y Herramientas', 'Especialista en diseño y operación de máquinas herramientas', NULL),
('12345704', 'Dibujo Industrial', 'Experta en dibujo técnico industrial y diseño mecánico', NULL),
('12345705', 'Control Numérico', 'Especialista en sistemas de control numérico computarizado', NULL),
('12345706', 'Tecnología Industrial', 'Experta en procesos tecnológicos industriales', NULL),
('12345707', 'Desarrollo Infantil', 'Especialista en psicología del desarrollo infantil', NULL),
('12345708', 'Didáctica de Educación Inicial', 'Experto en metodologías de enseñanza para educación inicial', NULL),
('12345709', 'Psicomotricidad y Lúdica', 'Especialista en desarrollo psicomotor y actividades lúdicas', NULL),
('12345710', 'Literatura Infantil', 'Experto en literatura y creatividad para niños', NULL),
('12345711', 'Didáctica de Ciencias', 'Especialista en enseñanza de ciencias naturales y sociales', NULL),
('12345712', 'Didáctica de Matemáticas y Lenguaje', 'Experto en metodologías de enseñanza de matemáticas y lenguaje', NULL),
('12345713', 'Desarrollo Cognitivo', 'Especialista en desarrollo de la inteligencia y procesos cognitivos', NULL),
('12345714', 'Evaluación Educativa', 'Experto en evaluación de aprendizajes y procesos educativos', NULL),
('12345715', 'Educación Especial', 'Especialista en pedagogía diferencial y necesidades educativas especiales', NULL),
('12345716', 'Dificultades del Aprendizaje', 'Experto en diagnóstico e intervención de dificultades de aprendizaje', NULL),
('12345717', 'Psicopedagogía Especial', 'Especialista en psicopedagogía y problemas emocionales', NULL),
('12345718', 'Atención Temprana', 'Experto en prevención y atención temprana en educación especial', NULL),
('23456789', 'Economía', 'Economista con especialización en macroeconomía', NULL),
('34567890', 'Matemáticas Financieras', 'Especialista en matemáticas aplicadas a finanzas', NULL),
('45678901', 'Recursos Humanos', 'Especialista en gestión del talento humano', NULL),
('87654321', 'Contabilidad', 'Contador público con maestría en auditoría', NULL),
('99999998', 'profesor', 'Pilas.', '04245555555');

-- --------------------------------------------------------

--
-- Table structure for table `usuario_estudiante`
--

CREATE TABLE `usuario_estudiante` (
  `cedula_usuario` varchar(20) NOT NULL,
  `codigo_carrera` varchar(10) NOT NULL,
  `periodo_inicio` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario_estudiante`
--

INSERT INTO `usuario_estudiante` (`cedula_usuario`, `codigo_carrera`, `periodo_inicio`) VALUES
('27000001', 'ADM', '2025-1'),
('27000002', 'ADM', '2025-1'),
('27000003', 'ADM', '2025-1'),
('27000004', 'ADM', '2025-1'),
('27000005', 'ADM', '2025-1'),
('27000006', 'ADM', '2025-1'),
('27000007', 'ADM', '2025-1'),
('27000008', 'ADM', '2025-1'),
('27000009', 'ADM', '2025-1'),
('27000010', 'ADM', '2025-1'),
('27000011', 'ADM', '2025-1'),
('27000012', 'ADM', '2025-1'),
('27000013', 'ADM', '2025-1'),
('27000014', 'ADM', '2025-1'),
('27000015', 'ADM', '2025-1'),
('27000016', 'ADM', '2025-1'),
('27000017', 'ADM', '2025-1'),
('27000018', 'ADM', '2025-1'),
('27000019', 'ADM', '2025-1'),
('27000020', 'ADM', '2025-1'),
('27000021', 'ADM', '2025-1'),
('27000022', 'CONT', '2025-1'),
('27000023', 'CONT', '2025-1'),
('27000024', 'CONT', '2025-1'),
('27000025', 'CONT', '2025-1'),
('27000026', 'CONT', '2025-1'),
('27000027', 'CONT', '2025-1'),
('27000028', 'INF', '2025-1'),
('27000029', 'INF', '2025-1'),
('27000030', 'INF', '2025-1'),
('27000031', 'INF', '2025-1'),
('27000032', 'INF', '2025-1'),
('27000033', 'INF', '2025-1'),
('27000034', 'ELEC', '2025-1'),
('27000035', 'ELEC', '2025-1'),
('27000036', 'ELEC', '2025-1'),
('27000037', 'ELEC', '2025-1'),
('27000038', 'ELEC', '2025-1'),
('27000039', 'ELTEC', '2025-1'),
('27000040', 'ELTEC', '2025-1'),
('27000041', 'ELTEC', '2025-1'),
('27000042', 'ELTEC', '2025-1'),
('27000043', 'ELTEC', '2025-1'),
('27000044', 'MEC', '2025-1'),
('27000045', 'MEC', '2025-1'),
('27000046', 'MEC', '2025-1'),
('27000047', 'MEC', '2025-1'),
('27000048', 'MEC', '2025-1'),
('27000049', 'EDIN', '2025-1'),
('27000050', 'EDIN', '2025-1'),
('27000051', 'EDIN', '2025-1'),
('27000052', 'EDIN', '2025-1'),
('27000053', 'EDIN', '2025-1'),
('27000054', 'EDIN', '2025-1'),
('27000055', 'EDINT', '2025-1'),
('27000056', 'EDINT', '2025-1'),
('27000057', 'EDINT', '2025-1'),
('27000058', 'EDINT', '2025-1'),
('27000059', 'EDINT', '2025-1'),
('27000060', 'EDINT', '2025-1'),
('27000061', 'EDESP', '2025-1'),
('27000062', 'EDESP', '2025-1'),
('27000063', 'EDESP', '2025-1'),
('27000064', 'EDESP', '2025-1'),
('27000065', 'EDESP', '2025-1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tabla` (`tabla`),
  ADD KEY `idx_operacion` (`operacion`),
  ADD KEY `idx_usuario_cedula` (`usuario_cedula`),
  ADD KEY `idx_fecha` (`fecha`);

--
-- Indexes for table `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `criterio_rubrica`
--
ALTER TABLE `criterio_rubrica`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rubrica_id` (`rubrica_id`),
  ADD KEY `idx_orden` (`orden`);

--
-- Indexes for table `detalle_evaluacion`
--
ALTER TABLE `detalle_evaluacion`
  ADD PRIMARY KEY (`evaluacion_r_id`,`orden_detalle`,`id_criterio_detalle`),
  ADD KEY `evaluacion_r_id` (`evaluacion_r_id`),
  ADD KEY `nivel_seleccionado_fk` (`id_criterio_detalle`,`orden_detalle`);

--
-- Indexes for table `estrategia_empleada`
--
ALTER TABLE `estrategia_empleada`
  ADD PRIMARY KEY (`id_estrategia`,`id_eval`),
  ADD KEY `estrategia_empleada_id_eval_fk` (`id_eval`);

--
-- Indexes for table `estrategia_eval`
--
ALTER TABLE `estrategia_eval`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluacion_id_seccion_fk` (`id_seccion`);

--
-- Indexes for table `evaluacion_realizada`
--
ALTER TABLE `evaluacion_realizada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluacion_realizada_cedula_evaluado_fk` (`cedula_evaluado`),
  ADD KEY `evaluacion_realizada_cedula_evaluador_fk` (`cedula_evaluador`),
  ADD KEY `id_evaluacion_a_evaluar_fk` (`id_evaluacion`);

--
-- Indexes for table `horario_eval`
--
ALTER TABLE `horario_eval`
  ADD PRIMARY KEY (`id_eval`,`id_horario`),
  ADD KEY `horario_eval_id_horario` (`id_horario`);

--
-- Indexes for table `horario_eval_clandestina`
--
ALTER TABLE `horario_eval_clandestina`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horario_eval_clan_id_eval_fk` (`id_eval`);

--
-- Indexes for table `horario_seccion`
--
ALTER TABLE `horario_seccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horario_seccion_id_seccion_fk` (`id_seccion`);

--
-- Indexes for table `inscripcion_seccion`
--
ALTER TABLE `inscripcion_seccion`
  ADD PRIMARY KEY (`cedula_estudiante`,`id_seccion`),
  ADD KEY `inscripcion_seccion_cedula_estudiante_fk` (`cedula_estudiante`),
  ADD KEY `id_seccion` (`id_seccion`);

--
-- Indexes for table `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `nivel_desempeno`
--
ALTER TABLE `nivel_desempeno`
  ADD PRIMARY KEY (`criterio_id`,`orden`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario_destino` (`usuario_destino`),
  ADD KEY `idx_leido` (`leido`),
  ADD KEY `idx_fecha` (`fecha`);

--
-- Indexes for table `notificacion_rubrica`
--
ALTER TABLE `notificacion_rubrica`
  ADD PRIMARY KEY (`id_notif`,`id_rubrica`),
  ADD KEY `id_rubrica_notif_rubric_fk` (`id_rubrica`);

--
-- Indexes for table `periodo_academico`
--
ALTER TABLE `periodo_academico`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `permiso_docente`
--
ALTER TABLE `permiso_docente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permiso_docente_cedula_creador` (`cedula_creador`),
  ADD KEY `permiso_docente_id_seccion_fk` (`id_seccion`),
  ADD KEY `id_cedula_docente_permisos_docente_fk` (`docente_cedula`);

--
-- Indexes for table `permiso_rol`
--
ALTER TABLE `permiso_rol`
  ADD PRIMARY KEY (`id_rol`,`nombre`);

--
-- Indexes for table `plan_periodo`
--
ALTER TABLE `plan_periodo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `plan_periodo_codigo_carrera_fk` (`codigo_carrera`),
  ADD KEY `plan_periodo_codigo_materia_fk` (`codigo_materia`),
  ADD KEY `plan_periodo_id_tipo_sem_fk` (`id_tipo_sem`),
  ADD KEY `codigo_periodo` (`codigo_periodo`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rubrica`
--
ALTER TABLE `rubrica`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipo_r_fk` (`id_tipo`);

--
-- Indexes for table `rubrica_uso`
--
ALTER TABLE `rubrica_uso`
  ADD PRIMARY KEY (`id_eval`,`id_rubrica`),
  ADD KEY `rubrica_uso_id_rubric` (`id_rubrica`);

--
-- Indexes for table `seccion`
--
ALTER TABLE `seccion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `seccion_id_materia_plan_fk` (`id_materia_plan`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `idx_expires` (`expires`);

--
-- Indexes for table `tipo_rubrica`
--
ALTER TABLE `tipo_rubrica`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipo_semestre`
--
ALTER TABLE `tipo_semestre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`cedula`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `usuario_id_rol_fk` (`id_rol`);

--
-- Indexes for table `usuario_docente`
--
ALTER TABLE `usuario_docente`
  ADD PRIMARY KEY (`cedula_usuario`,`especializacion`);

--
-- Indexes for table `usuario_estudiante`
--
ALTER TABLE `usuario_estudiante`
  ADD PRIMARY KEY (`cedula_usuario`,`codigo_carrera`),
  ADD KEY `usuario_estudiante_codigo_carrera_fk` (`codigo_carrera`),
  ADD KEY `usuario_estudiante_periodo_academico_fk` (`periodo_inicio`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criterio_rubrica`
--
ALTER TABLE `criterio_rubrica`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `estrategia_eval`
--
ALTER TABLE `estrategia_eval`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `evaluacion_realizada`
--
ALTER TABLE `evaluacion_realizada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `horario_eval_clandestina`
--
ALTER TABLE `horario_eval_clandestina`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `horario_seccion`
--
ALTER TABLE `horario_seccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `permiso_docente`
--
ALTER TABLE `permiso_docente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `plan_periodo`
--
ALTER TABLE `plan_periodo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=657;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rubrica`
--
ALTER TABLE `rubrica`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `seccion`
--
ALTER TABLE `seccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=399;

--
-- AUTO_INCREMENT for table `tipo_rubrica`
--
ALTER TABLE `tipo_rubrica`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_usuario_fk` FOREIGN KEY (`usuario_cedula`) REFERENCES `usuario` (`cedula`);

--
-- Constraints for table `criterio_rubrica`
--
ALTER TABLE `criterio_rubrica`
  ADD CONSTRAINT `criterio_rubrica_rubrica_id_fk` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`);

--
-- Constraints for table `detalle_evaluacion`
--
ALTER TABLE `detalle_evaluacion`
  ADD CONSTRAINT `id_evaluacion_detalle_fk` FOREIGN KEY (`evaluacion_r_id`) REFERENCES `evaluacion_realizada` (`id`),
  ADD CONSTRAINT `nivel_seleccionado_fk` FOREIGN KEY (`id_criterio_detalle`,`orden_detalle`) REFERENCES `nivel_desempeno` (`criterio_id`, `orden`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `estrategia_empleada`
--
ALTER TABLE `estrategia_empleada`
  ADD CONSTRAINT `estrategia_empleada_id_estrategia_fk` FOREIGN KEY (`id_estrategia`) REFERENCES `estrategia_eval` (`id`),
  ADD CONSTRAINT `estrategia_empleada_id_eval_fk` FOREIGN KEY (`id_eval`) REFERENCES `evaluacion` (`id`);

--
-- Constraints for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD CONSTRAINT `evaluacion_id_seccion_fk` FOREIGN KEY (`id_seccion`) REFERENCES `seccion` (`id`);

--
-- Constraints for table `evaluacion_realizada`
--
ALTER TABLE `evaluacion_realizada`
  ADD CONSTRAINT `evaluacion_realizada_cedula_evaluado_fk` FOREIGN KEY (`cedula_evaluado`) REFERENCES `usuario` (`cedula`),
  ADD CONSTRAINT `evaluacion_realizada_cedula_evaluador_fk` FOREIGN KEY (`cedula_evaluador`) REFERENCES `usuario` (`cedula`),
  ADD CONSTRAINT `id_evaluacion_a_evaluar_fk` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacion` (`id`);

--
-- Constraints for table `horario_eval`
--
ALTER TABLE `horario_eval`
  ADD CONSTRAINT `horario_eval_id_eval_fk` FOREIGN KEY (`id_eval`) REFERENCES `evaluacion` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `horario_eval_id_horario` FOREIGN KEY (`id_horario`) REFERENCES `horario_seccion` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `horario_eval_clandestina`
--
ALTER TABLE `horario_eval_clandestina`
  ADD CONSTRAINT `horario_eval_clan_id_eval_fk` FOREIGN KEY (`id_eval`) REFERENCES `evaluacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `horario_eval_clandest_id_eval_fk` FOREIGN KEY (`id_eval`) REFERENCES `evaluacion` (`id`);

--
-- Constraints for table `horario_seccion`
--
ALTER TABLE `horario_seccion`
  ADD CONSTRAINT `horario_seccion_id_seccion_fk` FOREIGN KEY (`id_seccion`) REFERENCES `seccion` (`id`);

--
-- Constraints for table `inscripcion_seccion`
--
ALTER TABLE `inscripcion_seccion`
  ADD CONSTRAINT `inscripcion_seccion_cedula_estudiante_fk` FOREIGN KEY (`cedula_estudiante`) REFERENCES `usuario_estudiante` (`cedula_usuario`),
  ADD CONSTRAINT `inscripcion_seccion_id_seccion_fk` FOREIGN KEY (`id_seccion`) REFERENCES `seccion` (`id`);

--
-- Constraints for table `nivel_desempeno`
--
ALTER TABLE `nivel_desempeno`
  ADD CONSTRAINT `nivel_desempeno_criterio_id_fk` FOREIGN KEY (`criterio_id`) REFERENCES `criterio_rubrica` (`id`);

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`usuario_destino`) REFERENCES `usuario` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notificacion_rubrica`
--
ALTER TABLE `notificacion_rubrica`
  ADD CONSTRAINT `id_notif_notif_rubric_fk` FOREIGN KEY (`id_notif`) REFERENCES `notificacion` (`id`),
  ADD CONSTRAINT `id_rubrica_notif_rubric_fk` FOREIGN KEY (`id_rubrica`) REFERENCES `rubrica` (`id`);

--
-- Constraints for table `permiso_docente`
--
ALTER TABLE `permiso_docente`
  ADD CONSTRAINT `id_cedula_docente_permisos_docente_fk` FOREIGN KEY (`docente_cedula`) REFERENCES `usuario_docente` (`cedula_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permiso_docente_cedula_creador` FOREIGN KEY (`cedula_creador`) REFERENCES `usuario` (`cedula`),
  ADD CONSTRAINT `permiso_docente_id_seccion_fk` FOREIGN KEY (`id_seccion`) REFERENCES `seccion` (`id`);

--
-- Constraints for table `permiso_rol`
--
ALTER TABLE `permiso_rol`
  ADD CONSTRAINT `permiso_rol_id_rol_fk` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);

--
-- Constraints for table `plan_periodo`
--
ALTER TABLE `plan_periodo`
  ADD CONSTRAINT `plan_periodo_codigo_carrera_fk` FOREIGN KEY (`codigo_carrera`) REFERENCES `carrera` (`codigo`),
  ADD CONSTRAINT `plan_periodo_codigo_materia_fk` FOREIGN KEY (`codigo_materia`) REFERENCES `materia` (`codigo`),
  ADD CONSTRAINT `plan_periodo_codigo_periodo_fk` FOREIGN KEY (`codigo_periodo`) REFERENCES `periodo_academico` (`codigo`),
  ADD CONSTRAINT `plan_periodo_id_tipo_sem_fk` FOREIGN KEY (`id_tipo_sem`) REFERENCES `tipo_semestre` (`id`);

--
-- Constraints for table `rubrica`
--
ALTER TABLE `rubrica`
  ADD CONSTRAINT `id_tipo_r_fk` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_rubrica` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `rubrica_id_tipo_fk` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_rubrica` (`id`);

--
-- Constraints for table `rubrica_uso`
--
ALTER TABLE `rubrica_uso`
  ADD CONSTRAINT `rubrica_uso_id_evalu` FOREIGN KEY (`id_eval`) REFERENCES `evaluacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rubrica_uso_id_rubric` FOREIGN KEY (`id_rubrica`) REFERENCES `rubrica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `seccion`
--
ALTER TABLE `seccion`
  ADD CONSTRAINT `seccion_id_materia_plan_fk` FOREIGN KEY (`id_materia_plan`) REFERENCES `plan_periodo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_id_rol_fk` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);

--
-- Constraints for table `usuario_docente`
--
ALTER TABLE `usuario_docente`
  ADD CONSTRAINT `usuario_docente_cedula_usuario_fk` FOREIGN KEY (`cedula_usuario`) REFERENCES `usuario` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usuario_estudiante`
--
ALTER TABLE `usuario_estudiante`
  ADD CONSTRAINT `usuario_estudiante_cedula_usuario_fk` FOREIGN KEY (`cedula_usuario`) REFERENCES `usuario` (`cedula`),
  ADD CONSTRAINT `usuario_estudiante_codigo_carrera_fk` FOREIGN KEY (`codigo_carrera`) REFERENCES `carrera` (`codigo`),
  ADD CONSTRAINT `usuario_estudiante_periodo_academico_fk` FOREIGN KEY (`periodo_inicio`) REFERENCES `periodo_academico` (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
