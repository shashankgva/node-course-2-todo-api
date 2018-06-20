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
	text: 'Prepare camera',
	completed: true,
	completedAt: 333
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

describe('DELETE todos/:id', () => {
	it('should remove todo', (done) => {
		var hexId = todos[2]._id.toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toBeFalsy();
				done(); 
			}).catch((e) => done(e));
		});

	});

	it('should return 404 if result not found', (done) => {
		var id = new ObjectID().toHexString();
		request(app)
		.delete(`/todos/${id}`)
		.expect(404)
		.end(done);
	});

	it('Should return 404 if ObjectID is invalid', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);
	});
});

describe('PATCH todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'This should be new text';

		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(typeof res.body.todo.completedAt).toBe('number');
		})
		.end(done);
	});

	it('Should clear completedAt when not completed', (done) => {

		var hexId = todos[0]._id.toHexString();
		var text = 'This should be newest text!!!';

		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: false,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toBeFalsy();
		})
		.end(done);

	});
});






