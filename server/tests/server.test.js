const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
	_id: new ObjectID(),
	text: 'Bike tour to BR Hills'
},{
	_id: new ObjectID(),
	text: 'Prepare bike'
}, {
	_id: new ObjectID(),
	text: 'Prepare camera'
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
});

describe('POST /todos', () => {
	it('Should create new todo', (done) =>{
		var text = 'Test todo text';

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) =>{
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find({text}).then((todos) =>{
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => {
				done();
			})
		})
	});

	it('Should not create todo with empty body', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(3);
				done();
			}).catch((e) => {
				done(e);
			});
		})
	});	
});

describe('GET /todos', () =>{
	it('Should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(3);
		})
		.end(done);
	})
});

describe('GET todo By ID', () => {
	it('Should return todo by id', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('Should return 404 if todo is not found', (done) => {
		var id = new ObjectID().toHexString();
		request(app)
		.get(`/todos/${id}`)
		.expect(404)
		.end(done);
	});

	it('Should 404 if invalid object ID', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);
	});
});