const path =  require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');
//const mongoConnect = require('./util/database').mongoConnect;

//const cors = require('cors'); // Place this with other requires (like 'path' and 'express')

const MONGODB_URL =
    'mongodb+srv://jolmateu:Isabella1107@cluster0.3mvfv.mongodb.net/shop?retryWrites=true';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
  });
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URL)
    .then(result => {
    app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
});

//mongoConnect(() => {
//    app.listen(process.env.PORT || 3000);
//})

//const corsOptions = {
//    origin: "https://cse341books.herokuapp.com/",
//    optionsSuccessStatus: 200
//};
//app.use(cors(corsOptions));

//const options = {
//    useUnifiedTopology: true,
//    useNewUrlParser: true,
//    useCreateIndex: true,
//    useFindAndModify: false,
//    family: 4
//};

//const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://jolmateu:Isabella1107@cluster0.3mvfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    