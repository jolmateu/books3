const path =  require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect;

//const cors = require('cors'); // Place this with other requires (like 'path' and 'express')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(process.env.PORT || 3000);
})




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
    