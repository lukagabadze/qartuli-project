const jwt = require('jsonwebtoken');
const User = require('../models/User')

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err);
                // res.locals.user = null;
                req.app.locals.user = null;
                next();
            } else {
                const userId = decodedToken.id;
                let user = await User.findById(userId);
                // res.locals.user = user;
                req.app.locals.user = user;
                next();
            }
        })
    } else {
        // res.locals.user = null;
        req.app.locals.user = null;
        next();
    }
}

module.exports = {
    checkUser,
}