const dotenv = require('dotenv');
dotenv.config({path: require('path').resolve(__dirname, '../../.env')});


module.exports = {
    PORT: process.env.PORT || 3000,
    mongodbUrl: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
};