const express = require('express');
const app = express();

app.get('/', function(req,res){
    res.send('welcome to memlyfy');
})



app.listen(8080, function(){
    console.log('app on 8080');
})