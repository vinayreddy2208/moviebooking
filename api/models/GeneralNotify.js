
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GeneralNotifySchema = new Schema({
    movieID: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    city: String,
    emails: { type: [String], required: true },
})

const GeneralNotificationModel = mongoose.model('GeneralNotification', GeneralNotifySchema)
module.exports = GeneralNotificationModel;
