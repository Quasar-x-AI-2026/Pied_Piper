const mongoose = require('mongoose');
const { mongodbUrl } = require('./serverConfig');

const connect = async () => {
    try {
    console.log('Testing MongoDB Atlas connection...\n');
    await mongoose.connect(mongodbUrl);

    console.log('Connected to MongoDB Atlas');
    console.log(`Database: ${mongoose.connection.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('FAILED:', error.message);
    process.exit(1);
  }
}

module.exports = connect;