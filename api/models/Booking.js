
const mongoose = require('mongoose');

const bookingShema = new mongoose.Schema({

    movie: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Movie' },
    
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    phoneNum: String,

    bookingDate: { type: Date, required: true },
    screen: { type: String, required: true },
    screenName: { type: String, required: true },
    showTime: { type: String, requried: true },
    seats: { type: [String], required: true },

    cost: { type: Number, required: true },
    valid: { type: Boolean, default: true },
});

const BookingModel = mongoose.model('Booking', bookingShema);

module.exports = BookingModel;
