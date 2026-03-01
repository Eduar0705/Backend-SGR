const TeacherEvaluacionesModel = require('./model/TeacherEvaluacionesModel');

async function test() {
    try {
        const res = await TeacherEvaluacionesModel.getTeacherEvaluaciones('123', true);
        console.log("Success! Returned " + res.length + " rows.");
    } catch (e) {
        console.error("SQL_ERROR_TEST:", e);
    }
}
test();
