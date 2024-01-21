
const express = require('express');
const dotenv = require('dotenv').config();
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const logger = require('morgan');

const HTTPSTATUSCODE = require('./src/utils/httpStatusCode');
const connectMongo = require('./src/utils/db');

const fontsRouter = require('./src/routes/fontRoutes');
const usersRouter = require('./src/routes/userRoutes');
const projectsRouter = require('./src/routes/projectRoutes');

const PORT = process.env.PORT;

connectMongo();


const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

/*SANEAR PETICIONES*/
mongoSanitize();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Acess-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(cors);


app.use(logger('dev'));

app.disable('x-powered-by');


app.set('secretKey', 'nodeRestApi');


app.use('/api/fuentes', fontsRouter);
app.use('/api/usuario', usersRouter);
app.use('/api/proyectos', projectsRouter);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Estás en la ruta base'
    })
})


app.use((req, res, next) => {
    let error = new Error();
    error.status = 404;
    error.message = HTTPSTATUSCODE[404];
    next(error);
})
app.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
})


app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
})




