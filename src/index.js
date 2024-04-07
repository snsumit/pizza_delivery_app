const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const routes = require("../routes/web");
const axios = require("axios");
require("./conn");
const session = require("express-session");
const flash = require('express-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require("passport");
const Emitter  = require('events')
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/pizza', 
    collection: 'sessions' 
});
store.on('error', function(error) {
    console.error('Session store error:', error);
});


app.use(session({
    secret:"thisismysecret",
    resave: true,
    store:store,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));






// passport configuration
const PassportInit = require("../app/config/passport")
PassportInit(passport)
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
   res.locals.session=req.session;
   res.locals.user = req.user;
    next();
})




app.use(flash());



app.use(express.json());
app.use(express.urlencoded({
    extended:false,
}))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static("public"));
app.use(express.static("resources"))
app.use(routes)


const server  = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

