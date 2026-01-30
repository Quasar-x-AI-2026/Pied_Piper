const express = require('express');
const bodyparser = require('body-parser');
const connect = require('./config/database');
const {PORT} = require('./config/serverConfig');
const routes = require('./routes/index');
const cors = require('cors');

const app = express();

const connection = async () => {
    connect();
    app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use('/api', routes);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });


}

connection();



