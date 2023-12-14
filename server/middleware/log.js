//1. Move the logger function to this file
//logger
function log(req, res, next) {
	console.log('Log every request');
	next();
}

//2. Export the logger function 
module.exports = log;
//3. Open root>index.js