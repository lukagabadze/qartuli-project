const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '*Name is required*'],
        maxlength: [50, '*Max folder name length is 50 characters*'],
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student_id',
        required: 'true',
    },
    student_name: {
        type: String,
    },
    student_files: [{
        type: String,
    }],
    teacher_files: [{
        type: String,
    }],
    date: {
        type: Date,
        default: Date.now(),
    },
})


const Folder = mongoose.model('folder', folderSchema);

module.exports = Folder;