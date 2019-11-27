const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


const multer = require('multer');
const PORT = process.env.PORT || 9090

const db = require('./models/index.js');

// const session = require('express-session');
// for parsing multipart/form-data


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
  // destination: function (req, file, cb) {
  //   // console.log(file);
  //   cb(null, 'public/uploads/')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({
  storage: storage,
  // fileFilter: function (req, file, callback) {
  //   var ext = file.mimetype;
  //   var allowedType = [
  //     'image/png',
  //     'images/jpg',
  //     'image/jpeg',
  //     'image/jpe',
  //     'image/gif'
  //   ]
  //   if (allowedType.indexOf(ext) === -1) {
  //     return callback("Invalid file type")
  //   }
  //   callback(null, true)
  // }
})




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
var controllers = require('./routes/index.js')

app.use(authRoute.checkIfLoggedIn);
//routes

// login/signup
app.post('/signup', controllers.accountController.signUp);
app.post('/signin', controllers.accountController.signIn);
app.post('/forPass', controllers.accountController.forPass);

app.get('/', authRoute.home);

app.get('/loginpage', function (req, res) {
  if (!req.session.user) {
    res.render('login', {
      layout: 'userlogin'
    });
  } else {
    res.redirect('/logoutpage')
  }
})

// reaction
app.post('/like', authRoute.like);
app.post('/likeCount', authRoute.likeCount);

// comments
app.post('/getComments', authRoute.getComment);
app.post('/saveComment', authRoute.saveComment);

//ADMIN SECTION START
app.get('/admin', authRoute.adminLoginPage);
app.post('/auth', authRoute.adminAuthentication);
app.get('/dashboard', authRoute.adminDashboard);
app.get('/adminlogout', authRoute.adminLogout);
app.post('/approval', authRoute.adminPostApproval);
app.post('/decline', authRoute.adminPostDecline);
app.get('/reported', authRoute.adminReported);
app.post('/report', authRoute.adminReportedPost);
app.post('/review', authRoute.adminReview);
app.post('/delete', authRoute.adminDelete);
//ADMIN SECTION END

//AUTHENTICATED USER WISHLIST ADD
app.post('/wishlist', authRoute.wishList);
//AUTHENTICATED USER WISHLIST GET
app.get('/mywishlist', authRoute.getWishList);


app.post('/upload', upload.single('meme'), authRoute.upload)

// app.get('/upload', function (req, res) {
//   // console.log('hello');
//   res.render('upload');
// })
app.get('/whatsnew', authRoute.whatsnew);

// app.get('/test', function (req, res) {
//   res.sendFile(__dirname + '/test.html');

// });

// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   res.send(file)

// })

app.get('/logoutpage', authRoute.logout);

//Search Operation
app.get('/search', authRoute.search);

//Trending Post
app.get('/trending', authRoute.trending);

//check login (only for upload modal)
app.post('/checkLogin', function(req, res){
  if(req.session.user){
    res.send("loggedIn")
  } else{
    res.send("notLoggedIn")
  }
})


db.connect()
  .then(function () {
    app.listen(PORT, function () {
      console.log('app on >>>>' + PORT);
    })
  })
  .catch(function (err) {
    console.log(err)
  })