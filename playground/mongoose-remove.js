const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

//Todo.findOneAndRemove((''))

// Todo.findByIdAndRemove('5b27cd253620d963c4fe961a').then((todo) => {
// 	console.log(todo);
// });

Todo.findOneAndRemove({_id: '5b27cd7c3620d963c4fe9658'}).then((todo) => {
	console.log(todo);
}); 
