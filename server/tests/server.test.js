const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {User} = require('./../models/user');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens.token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);

	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('users/me')
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		let email = 'example@example.com';
		let password = '123mnb!';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if (err) {
				return done(err);
			}

			User.findOne({email}).then((user) => {
				expect(user).toBeTruthy();
				done();	
			}).catch((e) => {
				return done(e);
			});	
		});

	});

	it('should validation error if request invalid', (done) => {
		request(app)
		.post('/users')
		.send({
			email: 'abc',
			password: '123'
		})
		.expect(400)
		.end(done);
	});

	it('should not create user if email in use', (done) => {
		request(app)
		.post('/users')
		.send({
			email: users[0].email,
			password: 'Password123!'
		})
		.expect(400)
		.end(done);
	});
});

describe('POST /users/login', () => {
	it('Should login user and return auth token', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email, 
			password: users[1].password
		})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
		}) 
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			User.findById(users[1]._id).then((user) => {
				expect(user.tokens[0]).toContain({
					access: 'auth',
					token: res.headers['x-auth']
				});
				done();
			}).catch((e) => done(e)); 
		});	

	});

	it('Should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email, 
			password: 'abc123'
		})
		.expect(400)
		.expect((res) => {
			expect(res.headers['x-auth']).toNotExist();
		}) 
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			User.findById(users[1]._id).then((user) => {
				expect(user.tokens[0]).toNotExist();
				done();
			}).catch((e) => done(e)); 
		});
	});
});


