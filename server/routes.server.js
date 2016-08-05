module.exports = function(app) {
	var tweet = require ('./controllers/tweets.controller.server.js');

	// server routes ===========================================================
	app.get('/tweets', tweet.list);
	app.get('/tweets/aggregate', tweet.aggregate);
	
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};