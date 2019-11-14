const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//middelwares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//database
var db = null;
var url = 'mongodb://localhost:27017';
MongoClient.connect(url, function (err, client) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      db = client.db('meme-hub');
      var collection = db.collection('users');
      collection.find({}).toArray(function(err,res){
		// console.log(err);
		// console.log(res);
	})
    //   client.close();
    }
  });

//routes
app.post('/signup',function(req,response){
	var data = req.body;
	var collection = db.collection('users');
	collection.insertOne(data,function(err,res){
		if (err){
			console.log(err);
		}
		console.log();
		return response.send('created user');
    })
    
	
	// console.log(collection);
});  


app.listen(9091, function(){
    console.log('app on 9091');
})