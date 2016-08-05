'use strict';

/**
 * Module dependencies.
 */
var Tweet = require('../models/tweet.model.server.js');

/**
 * List of Tweets
 */
exports.list = function(req, res) {
	Tweet.find(function(err, tweet) {
		if (err)
			res.send(err);

		res.json(tweet);
	});
};

/**
 * Aggregate of Tweets
 */
exports.aggregate = function(req, res) {
	Tweet.aggregate(
		[
			{ $group: { _id: "$state", totalCount: { $sum: 1 } } }
		],
		function(err, result) {
			if (err)
				res.send(err);

			res.json(result);
		}
	);
};