const Appointment = require('./appointment');
const Categories = require('./categories');
const Universities = require('./universities');
const University = require('./university');
const Doctors = require('./doctors');
const {checkAuth, checkRole} = require('../middlewares/checkAuth')

module.exports = (app) => {
    app.use('/appointment', Appointment)
    app.use('/universities', Universities)
    app.use('/university', checkAuth, checkRole, University)
    app.use('/categories', Categories)
    app.use('/doctors', checkAuth, Doctors)
    app.use('/check-role', checkAuth, checkRole, (_req, res) => res.sendStatus(200))
}

