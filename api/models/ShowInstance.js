
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShowSchema = new Schema({
    movie_id: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    screen: {
        type: String,
        required: true,
    },
    screenName: {
        type: String,
        required: true,
    },
    show_date: {
        type: Date,
        required: true,
    },
    show_time: {
        type: String,
        required: true,
    },
    seats: {
        type: Map,
        of: {
            status: { type: String, enum: ['available', 'booked', 'reserved'], default: 'available' },
            booked_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        },
        required: true,
        default: new Map(),
    }
});

const ShowModel = mongoose.model('Show', ShowSchema);
module.exports = ShowModel;