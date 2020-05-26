var express=require('express');
var app=express();
const bodyParser = require('body-parser');
var port = 3000;
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var shortid=require('shortid');

db=low(adapter);

db.defaults({users: [] }).write();

app.set('view engine','pug');
app.set('views','./views');

app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended: true })) ;

app.get('/',function(req,res){
	res.render('index',{
		name:'aaa'
	});
});
app.get('/users',function(req,res){
	res.render('users/index',{
		users:db.get('users').value()
	});
});

app.get('/users/search',function(req,res){
	var q=req.query.q;
	var match=db.get('users').value().filter(function(user){
		return user.name.toLowerCase().indexOf(q.toLowerCase())!==-1;
	});
	res.render('users/index',{
		users:match
	});
});

app.get('/users/create',function(req,res){
	res.render('users/create');
});

app.get('/users/:id',function(req,res){
	var id=req.params.id;
	var user=db.get('users').find({id: id }).value();
	res.render('users/view',{
		user: user
	});
});

app.post('/users/create',function(req,res){
	req.body.id=shortid.generate();
		db.get('users').push(req.body).write();
		res.redirect('/users');
});



app.listen(port,function(){
		console.log('Server listen on port:'+port);
});