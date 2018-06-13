var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connect_str;

if (process.env.PORT) {
	connect_str = 'mongodb://shashankgva:abc123@ds159100.mlab.com:59100/todoapp';
} else {
	connect_str = 'mongodb://localhost:27017/TodoApp';
}

mongoose.connect(connect_str);

module.exports = {
	mongoose
};