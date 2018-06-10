// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server.');
	}

	console.log('Connected to MongoDB Server');

	var db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5b1cc26321d614b153a41812')
	// }, {
	// 	$set: {
	// 		completed: false
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5b1be42a6ab0f2253a44c89b'),
	}, {
		$set: {
			name: 'Shashank GVA'
		},
		$inc: {
			age: -3
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});
	//client.close();
});