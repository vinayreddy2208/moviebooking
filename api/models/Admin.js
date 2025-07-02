
const mongoose = require('mongoose');
const {Schema} = mongoose;

const AdminSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    authority: Number,
});

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = AdminModel;