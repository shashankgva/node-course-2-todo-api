// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB Server');

	var db = client.db('TodoApp');

	// db.collection('Todos').deleteMany({text: 'To take bath'}).then((result) => {
	// 	console.log(result);
	// }).catch((err) => {
	// 	console.log('Not able to delete Todo', err);
	// });

	// db.collection('Todos').deleteOne({text: 'To take bath'}).then((result) => {
	// 	console.log(result);
	// }).catch((err) => {
	// 	console.log('Not able to delete Todo', err);
	// });

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// }).catch((err) => {
	// 	console.log('Not able to delete Todo', err);
	// });	

	db.collection('Users').deleteMany({name: 'Ganesh Adiga'});

	db.collection('Users').findOneAndDelete({
		_id: new ObjectID('5b1be4ea04d9b2257c6faa66')
	}).then((results) => {
		console.log(JSON.stringify(results,undefined,2));
	});

	//client.close();
});