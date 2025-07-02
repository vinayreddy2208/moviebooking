
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PriorityNotifySchema = new Schema({
    theaterID: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    theaterName: String,
    movieID: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    emails: { type: [String], required: true },
})

const PriorityNotifyModel = mongoose.model('PriorityNotification', PriorityNotifySchema)
module.exports = PriorityNotifyModel;
