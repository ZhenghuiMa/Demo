/*jslint node: true */
'use strict';
// Get dependencies
var Twitter = require('twitter');
// Set up Twitter client
var client = new Twitter({
  consumer_key: 'your_key',
  consumer_secret: 'your_key',
  access_token_key: 'your_key',
  access_token_secret: 'your_key'
});
// Set up connection to Redis
var redis;
if (process.env.REDIS_URL) {
  redis = require('redis').createClient(process.env.REDIS_URL);
} else {
  redis = require('redis').createClient();
}
client.stream('statuses/filter', {track: 'javascript', lang: 'en'}, function(stream) {
  stream.on('data', function(tweet) {
    // Log it to console
    console.log(tweet);
    // Publish it
    redis.publish('tweets', JSON.stringify(tweet));
    // Persist it to a Redis list
    redis.rpush('stream:tweets', JSON.stringify(tweet));
  });
  // Handle errors
  stream.on('error', function (error) {
    console.log(error);
  });
});