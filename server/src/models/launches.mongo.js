const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    upcoming: {
        type: Boolean,
        default: true,
        required: true,
    },
    success: {
        type: Boolean,
        default: true,
        required: true,
    },
    destination: String,
    customers: [String],
});

// connect launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);