const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgrounds = require('./routes/campgrounds');
const review = require('./routes/reviews');
const user = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", (e) => {
    console.error(`Error connecting to mongoose: $(e)`);
});
db.once('open', () => {
    console.log("mongoose db connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.msg = req.flash('success');
    res.locals.err = req.flash('error');
    next();
})

app.use('/', user);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', review);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next)  => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {status = 500, msg = 'Something went wrong'} = err;
    res.status(status).render('error', {err});
})

app.listen(3000, (req, res) => {
    console.log("listening on port 3000");
})