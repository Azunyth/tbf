var dotenv = require('dotenv');
var fs = require('fs');
var Utils = require('./utils');
var Twitter = require('twitter');

dotenv.config();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

var regLines = /([a-zA-Z- #]*)\n/g;

fs.readFile('./data/words.txt', 'utf8', function(err, data) {
    if (err) {
        Utils.log(err);
    } else {
        var keywords = Utils.getMatches(data, regLines);
        var keywordsShuffled = Utils.shuffleArray(keywords);

        var params = {
            q: keywordsShuffled.join(' OR '),
            count:100,
            result_type: 'mixed'
        };

        client.get('search/tweets', params, function(error, tweets, response) {
            if(error) {
                Utils.log(error[0].message);
            } else {
                var statuses = tweets.statuses;
                if (statuses.length > 0) {
                    function iterateStatus(i) {
                        if (i < statuses.length) {
                            var status = statuses[i];
                            var user = status.user;
                            var accountProtected = user.protected;
                            var accountVerified = user.verified;
                            if (accountProtected === true || accountVerified === true) {
                                // if the user has a protected account, we do not ask to follow him
                                iterateStatus(i + 1);
                            } else {
                                // check if we already following him
                                var paramsFollow = {
                                    user_id: user.id
                                };
                                client.get('friendships/lookup', paramsFollow, (errLookup, relation, resLookup) => {
                                    if(errLookup) {
                                        Utils.log(errLookup[0].message);
                                    } else {
                                        if (relation[0] != undefined && relation[0].connections.indexOf("following") === -1) {
                                            // follow him
                                            client.post('friendships/create', paramsFollow, function(errFollow, follow, resFollow) {
                                                if(errFollow) {
                                                    iterateStatus(i + 1);
                                                } else {
                                                    Utils.log("We are now following : " + follow.name + " @" + follow.screen_name);
                                                    Utils.log("Reason : " + status.text);
                                                }

                                            });
                                        } else {
                                            iterateStatus(i + 1);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    iterateStatus(0);
                }
            }
        });
    }
});
