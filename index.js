
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


const multer = require('multer');
const PORT = process.env.PORT || 9090


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
  destination: function (req, file, cb) {
    // console.log(file);
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

var temp = {
  "username":"admin",
  "password":"admin"
};

 
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


app.get('/admin',function(req,res){
    res.render('adminlogin',{
      layout:"admin.hbs"
    });
})
app.post('/auth',function(req,res){
  if(temp.username==req.body.username && temp.password==req.body.password){
    req.session.user=true;
    return res.json({status:"200",message:"success"});
    
    
  }
  return res.json({status:"402",message:"Invalid"});
})
app.get('/dashboard',function(req,res){
  if(req.session.user){
    return res.render('dashboard',{
      layout:"admin.hbs"
    })
  }
  return res.redirect('/admin');

  console.log(req.body);
  
})
app.get('/adminlogout',function(req,res){
  if(req.session.user){
    req.session.destroy(function(err){
      if(err){
        next(err)
      }else{
        res.clearCookie('assignment')
        
        return res.redirect('/admin');
      }
    })
  }

  else return res.redirect('/admin');
})


app.post('/upload', upload.single('meme'), authRoute.upload)

app.get('/upload', function(req,res){
  // console.log('hello');
  res.render('upload');
})

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

