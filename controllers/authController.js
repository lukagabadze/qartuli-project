const User = require('../models/User')
const jwt = require('jsonwebtoken');

const errorHandler = (err) => {
    const errors = { 'username': null, 'password': null };
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3600 * 24 * 365;
const createToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
        })
    }
    catch(err) {
        console.log(err);
    }
    
}

const signup_get = (req, res) => {
    res.render('auth/signup.ejs')
}

const signup_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({username, password});
        console.log('user created ^_^')

        // create jwt token
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: maxAge*1000 })

        res.json({ id: user._id });
    }
    catch(err) {
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}

const login_get = (req, res) => {
    //console.log(res.locals.user);
    res.render('auth/login.ejs')
}

const login_post = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.login(username, password);

        // create jwt token
        const token = createToken(user._id);
        res.cookie('jwt', token, { maxAge: maxAge*1000 });

        res.json({user})
    }
    catch(err) {
        //console.log('im in catch - ' + err)
        res.json({err});
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
}