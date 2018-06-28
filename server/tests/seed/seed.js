const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID(); 
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'shashankgva@gmail.com',
	password: 'userOnePass',
	tokens: {
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}
}, {
	_id: userTwoId,
	email: 'shashankgva1@gmail.com',
	password: 'userTwoPass',
}];

const todos = [{
	_id: new ObjectID(),
	text: 'Bike tour to BR Hills'
},{
	_id: new ObjectID(),
	text: 'Prepare bike'
}, {
	_id: new ObjectID(),
	text: 'Prepare camera',
	completed: true,
	completedAt: 333
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {
	populateTodos,
	todos,
	users,
	populateUsers
};