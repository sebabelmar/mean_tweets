module.exports = function(app) {
	var tweet = require ('./controllers/tweets.controller');

	// server routes ===========================================================
	app.get('/tweets', tweet.list);

	

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};