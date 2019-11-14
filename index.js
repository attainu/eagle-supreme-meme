const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));


app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var link = [{"image":"https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"},
            {"image":"https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"},
            {"image":"https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"},
            {"image":"https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"}
]


app.get('/',function(req,res){
    res.render('home',{
        data: link
    });
});
app.get('/loginpage',function(req,res){
    res.render('login');
})



app.listen(9090);