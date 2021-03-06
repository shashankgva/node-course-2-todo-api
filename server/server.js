require('./config/config');



const _ = require('lodash');

const {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}).catch((e) => {
		res.status(400).send(e);
	});
})

//GET todos/12345

app.get('/todos/:id', (req,res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		res.status(404).send({});
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			res.status(404).send({})
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		res.status(400).send({});
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			res.status(404).send({});
		} else {
			res.status(200).send({todo});
		}
	}).catch((e) => {
		res.status(400).send({});
	});
});

app.patch('/todos/:id', (req,res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) {
		res.status(400).send({});
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			res.status(404).send({});
		} else {
			res.send({todo});
		} 

	}).catch((e) => {
		res.status(400).send();
	});
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	user.save().then((user) => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();	
	});
});



app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send();
	});
});


app.listen(port, () => {
	console.log(`Started on PORT at ${port}`);
});

module.exports = {app};

