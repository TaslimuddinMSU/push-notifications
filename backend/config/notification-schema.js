const mongoose  = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    title: {type: String, require: true},
    message: {type: String, require: true},
    read:    { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now}
});

const Notifications = mongoose.model('Notification', NotificationSchema);
module.exports = Notifications;