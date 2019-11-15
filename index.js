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


app.use(session({
  name: "assignment",
  secret: 'someRandomStuff',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 120000,
    path: '/',
    sameSite: true,
    secure: false
  }
}));

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
var temp = {
  "username":"admin",
  "password":"admin"
};

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

app.listen(9091, function () {
  console.log('app on 9091');
})