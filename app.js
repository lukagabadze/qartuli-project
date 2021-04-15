const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes')
const { checkUser } = require('./middleware/authMiddleware')


mongoose.connect(process.env.MONGO_URI,
    { 
        useUnifiedTopology: true,
        useNewUrlParser: true
    },() => {
        
        console.log('connected to db');
        app.listen(3000, () => {
            console.log('listening to port 3000')
        });
});
mongoose.set('useCreateIndex', true);



// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs')

// routes
app.get('*', checkUser);
app.use('/', authRoutes);
app.use('/', mainRoutes);