const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
	id: 6
};
 
let token = jwt.sign(data,'123abc');
console.log(token);

let decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

// let message = 'I may go to oorige ee weekend';
// let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// let data = {
// 	id: 4
// };


// let token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString() 
// };

// token.data.id = 5;

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
// 	console.log('Data was not changed');
// } else {
// 	console.log('changed');
// }