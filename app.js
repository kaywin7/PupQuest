if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const shelterRoutes = require('./routes/shelters')
const reviewRoutes = require('./routes/reviews')
const vectRoutes = require('./routes/vect')
const vreviewRoutes = require('./routes/vreviews')
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
const MongoDBStore = require("connect-mongo")(session);
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
})
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSON STORE ERROR", e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(mongoSanitize());
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'coltttt@gmail.com', username: 'coltt' });
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/shelters', shelterRoutes)
app.use('/shelters/:id/reviews', reviewRoutes)
app.use('/vects', vectRoutes)
app.use('/vects/:id/reviews', vreviewRoutes)
app.get('/', (req, res) => {
    res.render('home')
});
app.get('/care', (req, res) => {
    res.render('static')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port = process.env.Port || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
