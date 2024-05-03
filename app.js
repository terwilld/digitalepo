const express = require('express');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const path = require('path')
require('dotenv').config()
const Routes = require('./routes/base.js')
const { initUploadFolders } = require('./controllers/files.js')
const morgan = require("morgan");
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



initUploadFolders(path.join(process.cwd(), process.env.processingDirectory));
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));

const sessionConfig = {
    // name: 'myfancycoookiename',
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    // store: store
}
app.use(session(sessionConfig))
app.use(flash());
app.use((req, res, next) => {
    // console.log(req.query)
    // console.log('inside the flash middleware')
    res.locals.currentUser = req.user
    // console.log(res.locals.currentUser)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.use('/', Routes)

app.listen(3000, () => {
    console.log('app is running on 3000')
})