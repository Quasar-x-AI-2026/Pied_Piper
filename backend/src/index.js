const express = require('express');
const bodyparser = require('body-parser');
const connect = require('./config/database');
const {PORT} = require('./config/serverConfig');

const app = express();

const connection = async () => {
    connect();
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}

connection();



