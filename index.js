const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/authroutes');
const profileRoutes = require('./routes/profileroutes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 1 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose
	.connect(
		"mongodb+srv://deepofficial9664:DRMGi3zE0Min2nzn@cluster0.n6fv89m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
	)

	.then(() => console.log("✅ MongoDb is connected"))
	.catch((err) => console.log("⚠️ ", err));

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});