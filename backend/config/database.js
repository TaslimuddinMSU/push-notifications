const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/push-notification');
        console.log('Database is connected');
    } catch (error) {
        console.log("Database is not connected", error)
    }
};

module.exports = connectDB;