const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const api = require('./routes/api');

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log('Google profile', profile);
    done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// save session to cookie
passport.serializeUser((user, done) => {
    // select data for save to cookie session
    console.log('serializeUser');
    console.log(user);
    done(null, user.id);
});

// read session from cookie
passport.deserializeUser((obj, done) => {
    console.log('deserializeUser');
    console.log(obj);
    done(null, obj);
});

const app = express();

function checkLoggedIn(req, res, next) {
    console.log('user :', req.user);
    // const isLoggedIn = req.user; // or req.isAuthenticated
    // const isLoggedIn = req.isAuthenticated(); // or
    const isLoggedIn = req.isAuthenticated() && req.user; // for extra confidence
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must log in',
        });
    }
    next();
}

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));
app.use(helmet());
app.use(cookieSession({
    name: 'session',
    maxAge: 12 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
})) // set before initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate(
        'google',
        {
            failureRedirect: '/failure',
            successRedirect: '/',
            session: true,
        },
    ),
    (req, res) => {
        console.log('Come back from google login');
        res.status(200).send('Come back from google login');
    }
);

app.get('/auth/logout', (req, res) => {
    req.logout(); // removes req.user , terminate or clears any logged in session
    return res.redirect('/');
});

app.use('/v1', api);

app.get('/secret', checkLoggedIn, (req, res) => {
    return res.status(200).send('This is secret page');
});
app.get('/failure', (req, res) => {
    return res.status(200).send('Failed to login');
});

app.get('/pid', (req, res) => {
    return res.status(200).json({ pid: process.pid });
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;