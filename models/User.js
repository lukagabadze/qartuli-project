const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Group = require('./Group');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, '*Username is required*'],
        minlength: [6, '*Minimum username length is 6 characters*'],
    },
    password: {
        type: String,
        required: [true, '*Password is required*'],
        minlength: [8, '*Minimum password length is 8 characters*'],
    },
    isTeacher: {
        type: Boolean,
        default: false,
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    date: {
        type: Date,
        default: Date.now(),
    }
})

userSchema.post('save', function(doc, next) {
    // nothing much
    next();
})
userSchema.pre('save', async function(next) {
    // this არის User
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch(err) {
        console.log(err);
    }
    
    next();
})

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username })//, 'password');
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw {username: '', password: '*Password is incorrect*'};
    }
    throw {username:'*Username does not exist*', password: ''};
}

const User = mongoose.model('User', userSchema);

module.exports = User;