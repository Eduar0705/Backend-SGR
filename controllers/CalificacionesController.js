const CalificacionesModel = require('../model/CalificacionesModel');
const { aplicarRedondeoPuntaje } = require('../utils/evaluacionUtils');

class CalificacionesController {
    async getCalificaciones(req, res) {
        try {
            const cedula = req.user.cedula;
            const results = await CalificacionesModel.getCalificacionesByEstudiante(cedula);
            const lapsosMap = new Map();
            const uniqueMateriasMap = new Map();

            results.forEach(row => {
                const lapsoKey = row.lapso_academico || 'Sin Periodo';
                const fechaPeriodo = row.fecha_periodo; // Extraemos la fecha del periodo

                if (!lapsosMap.has(lapsoKey)) {
                    lapsosMap.set(lapsoKey, new Map());
                }

                const materiasMap = lapsosMap.get(lapsoKey);

                if (!materiasMap.has(row.materia_codigo)) {
                    const nuevaMateria = {
                        nombre: row.materia_nombre,
                        codigo: row.materia_codigo,
                        seccion: row.seccion_codigo,
                        uc: 3,
                        nota_referencial: 10,
                        rubricas: [],
                        calificacion_final: 0,
                        porcentaje_acumulado: 0, 
                        puntaje_acum_sobre_20: 0,
                        total_evaluado: 0,
                        fecha_periodo: fechaPeriodo // Guardamos la fecha del periodo
                    };
                    materiasMap.set(row.materia_codigo, nuevaMateria);

                    // Lógica para stats únicas basada en fecha_periodo
                    if (!uniqueMateriasMap.has(row.materia_codigo)) {
                        uniqueMateriasMap.set(row.materia_codigo, nuevaMateria);
                    } else {
                        const existente = uniqueMateriasMap.get(row.materia_codigo);
                        const fechaActual = new Date(fechaPeriodo).getTime();
                        const fechaExistente = new Date(existente.fecha_periodo).getTime();
                        
                        // Si la fecha actual es estrictamente mayor, es el periodo más reciente
                        if (fechaActual > fechaExistente) {
                            uniqueMateriasMap.set(row.materia_codigo, nuevaMateria);
                        }
                    }
                }

                const materia = materiasMap.get(row.materia_codigo);

                if (row.nombre_rubrica) {
                    const maxPuntaje = parseFloat(row.puntaje_maximo_rubrica) || 0;
                    const porcentajeRubrica = parseFloat(row.porcentaje_evaluacion) || 0;
                    const puntajeObtenidoRaw = row.puntaje_total !== null ? parseFloat(row.puntaje_total) : null;
                    const puntajeObtenido = puntajeObtenidoRaw !== null
                        ? aplicarRedondeoPuntaje(puntajeObtenidoRaw, porcentajeRubrica)
                        : 0;

                    let calificacionRubrica = 0;
                    if (maxPuntaje > 0 && row.puntaje_total !== null) {
                        calificacionRubrica = (puntajeObtenido / maxPuntaje) * porcentajeRubrica;
                        materia.calificacion_final += calificacionRubrica;
                    }

                    materia.total_evaluado += porcentajeRubrica;
                    if (row.puntaje_total !== null) {
                        materia.porcentaje_acumulado += porcentajeRubrica;
                    }

                    const fechaEvalTime = row.fecha_evaluacion ? new Date(row.fecha_evaluacion).getTime() : null;
                    const fechaModifTime = row.fecha_modif ? new Date(row.fecha_modif).getTime() : null;
                    const hasModification = fechaEvalTime && fechaModifTime && fechaEvalTime !== fechaModifTime;

                    materia.rubricas.push({
                        nombre: row.nombre_rubrica,
                        porcentaje: porcentajeRubrica,
                        puntaje_obtenido: row.puntaje_total !== null ? puntajeObtenido : null,
                        puntaje_maximo: maxPuntaje,
                        observaciones: row.observaciones || null,
                        fecha_eval: row.fecha_evaluacion || null,
                        fecha_fija: row.fecha_fija || null,
                        fecha_modif: hasModification ? row.fecha_modif : null
                    });
                }
            });

            const lapsos = [];
            for (const [lapsoNombre, materiasMap] of lapsosMap.entries()) {
                const materiasDelLapso = Array.from(materiasMap.values());

                materiasDelLapso.forEach(m => {
                    m.nota_20 = (m.calificacion_final / 5);
                    m.nota_100 = m.calificacion_final;
                    m.puntaje_acum_sobre_20 = m.porcentaje_acumulado / 5;
                    console.log(m.codigo, m.nota_20, m.nota_100, m.puntaje_acum_sobre_20)
                });

                lapsos.push({
                    nombre: lapsoNombre,
                    materias: materiasDelLapso
                });
            }

            lapsos.sort((a, b) => b.nombre.localeCompare(a.nombre));

            // Usamos el Map global que ya contiene solo la materia de su periodo más reciente
            const allMaterias = Array.from(uniqueMateriasMap.values());

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