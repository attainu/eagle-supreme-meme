
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');

//middelwares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//handlebars
app.engine('.hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// login Session
app.use(session({
  name: "assignment",
  secret: 'someRandomStuff',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 3600000,
    path: '/',
    sameSite: true,
    secure: false
  }
}))


// controller
var authRoute = require('./routes/route.js');

app.use(authRoute.checkIfLoggedIn);
//routes
app.post('/signup', authRoute.signUp);

app.post('/signin', authRoute.signIn)

app.get('/', authRoute.home);

app.get('/loginpage', function (req, res) {
  res.render('login');
})

app.get('/logoutpage', authRoute.logout);



app.listen(9091, function () {
  console.log('app on 9091');
});