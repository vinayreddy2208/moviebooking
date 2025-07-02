
const mongoose = require('mongoose');
const { Schema } = mongoose;

// const SeatSchema = new Schema({
//     seat_number: { type: String, required: true },
//     status: { type: String, default: 'available' }
// });

// const ShowSchema = new Schema({
//     movie_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'Movie',
//         required: true,
//     },
//     show_date: {
//         type: Date,
//         required: true,
//     },
//     show_time: {
//         type: String,
//         required: true,
//     },
//     seats: {
//         type: [[SeatSchema]],
//         required: true,
//         default: [],
//     },
//     booking_end_date: {
//         type: Date,
//         required: true,
//     }
// });

// const ScreenSchema = new Schema({
//     screen_number: {
//         type: Number,
//         required: true
//     },
//     showtimings: {
//         type: [ShowSchema],
//         required: true,
//     }
// })

const TheatreSchema = new Schema({

    name: { type: String, required: true },

    features: [String], //! Not using
    address: String, //! Not using

    city: { type: String, required: true },

    showTimings: { type: [String] },

    seats: [[String]], //! Not using

    // location: { type: [Number], index: '2dsphere' }, 

    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },

    screens: [
        {
            screenName: { type: String },
            ticketPrice: { type: String },
            currentMovie: {
                movieID: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
                movieName: { type: String },
                endDate: Date
            },
        }
    ]
});

TheatreSchema.index({ location: '2dsphere' })

const TheatreModel = mongoose.model('Theatre', TheatreSchema);

module.exports = TheatreModel;