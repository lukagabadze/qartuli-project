const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    teacher: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

const Group = mongoose.model('group', groupSchema);

module.exports = Group;