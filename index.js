
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const multer = require('multer');
const PORT = process.env.PORT || 9004


// const session = require('express-session');
// for parsing multipart/form-data

app.use(express.static('public'));
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

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })



// var link = [{
//     "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
//   },
//   {
//     "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
//   },
//   {
//     "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
//   },
//   {
//     "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
// // login Session

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

app.post('/upload', upload.single('meme'), authRoute.upload)



app.get('/test',function(req,res){
  res.sendFile(__dirname + '/test.html');
 
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
  
})

app.get('/logoutpage', authRoute.logout);


app.listen(PORT, function () {
  console.log('app on >>>>'+ PORT);
})
