const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var multer = require('multer');
var upload = multer();

// const session = require('express-session');
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

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
    console.log(req);
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

// login Session
// app.use(session({
//   name: "assignment",
//   secret: 'someRandomStuff',
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     maxAge: 120000,
//     path: '/',
//     sameSite: true,
//     secure: false
//   }
// }))

var link = [{
    "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
  },
  {
    "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
  },
  {
    "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
  },
  {
    "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
  }
]

// controller
var authRoute = require('./routes/route.js');

//routes
app.post('/signup', authRoute.signUp);

app.post('/signin', authRoute.signIn)

app.get('/', function (req, res) {
  res.render('home', {
    data: link
  });
});
app.get('/loginpage', function (req, res) {
  res.render('login');
})
app.get('/upload', function(req,res){
  // console.log('hello');
  res.render('upload');
})

app.post('/upload', upload.single('meme'), authRoute.upload)

app.listen(9008, function () {
  console.log('app on 9096');
})