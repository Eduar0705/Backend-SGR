const CalificacionesModel = require('../model/CalificacionesModel');

class CalificacionesController {
    async getCalificaciones(req, res) {
        try {
            const cedula = req.user.cedula;
            const results = await CalificacionesModel.getCalificacionesByEstudiante(cedula);

            // Procesar resultados en estructura de lapsos
            const lapsosMap = new Map();
            const allMaterias = [];

            results.forEach(row => {
                const lapsoKey = row.lapso_academico || 'Sin Periodo';

                if (!lapsosMap.has(lapsoKey)) {
                    lapsosMap.set(lapsoKey, new Map());
                }

                const materiasMap = lapsosMap.get(lapsoKey);

                if (!materiasMap.has(row.materia_codigo)) {
                    materiasMap.set(row.materia_codigo, {
                        nombre: row.materia_nombre,
                        codigo: row.materia_codigo,
                        seccion: row.seccion_codigo,
                        uc: 3,
                        nota_referencial: 10,
                        rubricas: [],
                        calificacion_final: 0,
                        porcentaje_acumulado: 0,
                        total_evaluado: 0
                    });
                }

                const materia = materiasMap.get(row.materia_codigo);

                if (row.rubrica_id) {
                    const maxPuntaje = parseFloat(row.puntaje_maximo_rubrica) || 0;
                    const puntajeObtenido = parseFloat(row.puntaje_total) || 0;
                    const porcentajeRubrica = parseFloat(row.porcentaje_evaluacion) || 0;

                    let calificacionRubrica = 0;
                    if (maxPuntaje > 0 && row.puntaje_total !== null) {
                        calificacionRubrica = (puntajeObtenido / maxPuntaje) * porcentajeRubrica;
                        materia.calificacion_final += calificacionRubrica;
                    }

                    materia.total_evaluado += porcentajeRubrica;
                    if (row.puntaje_total !== null) {
                        materia.porcentaje_acumulado += porcentajeRubrica;
                    }

                    materia.rubricas.push({
                        nombre: row.nombre_rubrica,
                        porcentaje: porcentajeRubrica,
                        puntaje_obtenido: row.puntaje_total !== null ? puntajeObtenido : null,
                        puntaje_maximo: maxPuntaje,
                        observaciones: row.observaciones || null,
                        fecha: row.fecha_evaluacion || null
                    });
                }
            });

            const lapsos = [];
            for (const [lapsoNombre, materiasMap] of lapsosMap.entries()) {
                const materiasDelLapso = Array.from(materiasMap.values());

                materiasDelLapso.forEach(m => {
                    m.nota_20 = (m.calificacion_final / 100) * 20;
                    m.nota_100 = m.calificacion_final;
                    m.nota_display = Math.round(m.nota_20);
                    allMaterias.push(m);
                });

                lapsos.push({
                    nombre: lapsoNombre,
                    materias: materiasDelLapso
                });
            }

            lapsos.sort((a, b) => b.nombre.localeCompare(a.nombre));

            const totalMaterias = allMaterias.length;
            const materiasAprobadas = allMaterias.filter(m => m.nota_20 >= 10).length;

            let promedioGeneral = 0;
            if (totalMaterias > 0) {
                const sum20 = allMaterias.reduce((acc, m) => acc + m.nota_20, 0);
                promedioGeneral = (sum20 / totalMaterias).toFixed(1);
            }

            let porcentajeCompletado = 0;
            if (totalMaterias > 0) {
                porcentajeCompletado = (allMaterias.reduce((acc, m) => acc + m.porcentaje_acumulado, 0) / totalMaterias).toFixed(1);
            }

            res.json({
                success: true,
                data: {
                    lapsos,
                    stats: {
                        promedioGeneral,
                        materiasAprobadas,
                        totalMaterias,
                        porcentajeCompletado
                    }
                }
            });
        } catch (error) {
            console.error('Error getCalificaciones:', error);
            res.status(500).json({ success: false, message: 'Error al cargar las calificaciones' });
        }
    }
}

module.exports = new CalificacionesController();
