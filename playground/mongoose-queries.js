const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '7b1eb5e8bf791c1d29850a233';

// if (!ObjectID.isValid(id)) {
// 	console.log('ID Not valid');
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo) {
// 		console.log('ID Not found');
// 	} else {
// 		console.log('Todo by ID', todo);	
// 	}
	
// }).catch((e) => console.log(e));

var id = '5b1d2ec7f67a6c7b3da0e863';

User.findById(id).then((user) => {
	if (!user) {
		console,log('No user data found.');
	} else {
		console.log('User', user);
	}
}).catch((e) => console.log(e));