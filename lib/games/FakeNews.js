'use strict';

var coreModule = require('learning-games-core'),
    Core = coreModule.Core,
    shuffle = coreModule.ShuffleUtil, 
    _ = require('underscore');

class FakeNews extends Core {

	constructor() {

		super();

		this.Templates,
		this.keystone,
		this.Profiles,
		this.Events,
		this.roundCap = 12,

		this.badges = [],
		this.articlePool = [],
		this.feed = [],
		this.profilePool = [],

		this.currentProfile,
		this.currentBuckets = [],
		this.articles,
		this.reactions,
		this.shared,
		this.points,
		this.goodResponse,
		this.badResponse,

		this.gameSocket,
		this.playerData,

		this.gameEvents,
		this.round,

		this.action_history = {};

	  }

	  Initialize(session) {

		console.log("initialize", session);

		// Init template loader with current game type - Credit to JR
		var TemplateLoader = require('../TemplateLoader');
		this.Templates = new TemplateLoader();

		this.keystone = require('keystone');

		this.Profiles = this.keystone.list('Profile').model;
		this.Scenario = this.keystone.list('Scenario').model;
		this.Articles = this.keystone.list('Article').model;

		// Grab the profiles
		this.Profiles.findOne({ '_id': session.profile })
		.populate('pros cons neutrals missions')
		.exec((err, result) => {
			this.currentProfile = result;
			console.log(this.currentProfile, " is the profile chosen");
			// Later will show missions to pick from, for now just pick random mission

			this.currentMission = result.missions[_.random(0, result.missions.length - 1)];
			console.log(this.currentMission, " is the random mission");

			this.Scenario.findOne({ _id: this.currentMission._id })
			.populate('events')
			.exec((err, result) => {

				_.each(result.events, (event) => {

					_.each(event.articles, (article) => {

						this.Articles.findOne({ _id: article })
						.populate('pros cons types')
						.exec((err, result) => {
							this.articlePool.push(result);
						});

					});
					
				});

			});

		});
		
	 }

	 StartGame(socket, initial) {

	 	// Wow, this player is starting a game! There should be something done about that
		this.round = 0;
		this.gameSocket = socket;

		this.playerData = {};
	 	this.currentBuckets = [];

	 	let bucketPool = [];

	 	console.log(this.currentProfile);

		
		let path = 'partials/game/profile';
		let data = {
		    currentProfile: this.currentProfile
		};

		this.Templates.Load(path, data, (html) => {

			 // Send the new profile and events 
			 this.gameSocket.emit('game:newProfile', { html: html, data: data });

		});

	}

	NewFeed(socket) {

		this.playerData.correct = 0;
		this.goodResponse = 0;
		this.badResponse = 0;
		this.feed = [];
		this.shareData = {
			'bad': [],
			'good': [],
			'neutral': []
		};
		
	 	// Set the articles
		let path = 'partials/game/feed';
		let data = {
			currentProfile: this.currentProfile,
		    articles: _.shuffle(this.articlePool),
		    pointCount: this.points
		};		

		this.Templates.Load(path, data, (html) => {

			// Send the new feed
			this.gameSocket.emit('game:newFeed', { html: html, data: data });

		});

	}

	CheckPost(socket, data) {
		// reset reactions
		this.reactions = [];

	 	console.log(data, " backend data")

		var currentArticle = _.where(this.feed, { key: data.post })[0];

		currentArticle.shared = data.shared;

		let likes = [];
		let hates = [];
		
		_.each(this.currentBuckets, (bucket) => {
			// add the reactions!
			var reaction = this.CheckBucket(bucket, currentArticle, data.shared);
			// console.log(reaction.length)
			if (reaction)
				this.reactions.push(reaction);
		});
	
		let originalpoints = this.currentProfile.level * 10000;

		this.Checkpoints();
		this.gameSocket.emit('feed:update', { 
			article: currentArticle.key, 
			reactions: this.reactions, 
			points: this.points
		});

	}

	CheckBucket(bucket, article, shared) {

		// Compare the profile buckets with this article's lovers/haters
		let lover = _.where(article.lovers, {'key':bucket.trait.key});
		let hater = _.where(article.haters, {'key':bucket.trait.key});

		if (article.fake == true) {
			var chance = Math.round(Math.random()*10)%2;
		}
		if (chance == 0) {
			article.debunked = true;
		}

		if ( article.debunked == true ) {
			console.log("debunk message")
			this.gameSocket.emit('feed:response', { comment: 'follower', msg: _.shuffle(article.debunked)[0] });
		}

		if (lover.length > 0) {
			console.log(bucket.trait.name + ' loves this');
			if (shared == true) {
				this.points += this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('feed:update', { points: this.points });
				article.correct = true;
				return 'likes';
			} else {
				this.points -= this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('feed:update', { points: this.points });
				article.correct = false;
				return '';
			}
		} else if (hater.length > 0) {
			console.log(bucket.trait.name + ' hates this');
			if (shared == true) {
				this.points -= this.points * ( parseInt( bucket.ratio.split(':')[1] )/1000 );
				this.gameSocket.emit('feed:update', { points: this.points });
				article.correct = false;
				return 'angry';
			} else {
				this.points += this.points * ( parseInt( bucket.ratio.split(':')[0] )/1000 );
				this.gameSocket.emit('feed:update', { points: this.points });
				article.correct = true;
				return '';
			}

		} 
		else {
		// 	console.log(bucket.trait.name + ' doesn\'t care about this');
		// 	let ratio = 100 - ( parseInt( bucket.ratio.split(':')[0] ) + parseInt( bucket.ratio.split(':')[1] ) );
		// 	this.points += this.points * (ratio/1000);
		// 	this.gameSocket.emit('feed:update', { points: this.points });
			return '';
		}
		
	}

	// Check points when article is skipped/shared
	Checkpoints() {

		let wrong = _.where(this.feed, { 'correct': false }).length;
		let right = _.where(this.feed, { 'correct': true }).length

		if ( wrong >= this.feed.length/4 && wrong < this.feed.length/3 && this.badResponse == 0) {

			this.badResponse++;

			console.log('you got 1/4 the damn shit wrong already')
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienBad[0] });

		} else if (wrong >= this.feed.length/3 && wrong < this.feed.length/2 && this.badResponse == 1) {

			this.badResponse++;
			console.log('you got 1/3 the damn shit wrong already')
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienBad[1] });

		} else if (wrong >= this.feed.length/2 && this.badResponse == 2) {

			this.badResponse++;
			console.log('you got 1/2 the damn shit wrong already')
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienBad[2] });

		} else if (right >= this.feed.length/4 && right < this.feed.length/3 && this.goodResponse == 0) {

			this.goodResponse++;
			console.log('you got 1/4 the shit right already!')
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienGood[0] });

		} else if (right >= this.feed.length/3 && right < this.feed.length/2 && this.goodResponse == 1) {

			this.goodResponse++;
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienGood[1] });

			console.log('you got 1/3 the shit right already!')

		} else if (right >= this.feed.length/2 && this.badResponse == 2) {

			this.goodResponse++;
			this.gameSocket.emit('feed:response', { comment: 'alien', msg: this.currentProfile.alienGood[2] });

			console.log('you got 1/2 the shit right already!')

		}

	 	if (this.points <= 1000 * this.currentProfile.level)
	 		FailProfile();
	 	// else if (this.points <= 8000 * this.currentProfile.level) {
	 		// // send some comment notifications their way
	 		// this.gameSocket.emit('feed:update', { reaction: 'comment' });

	 	// }

	}

	// Give players points for popping reaction bubbles
	PostReaction(socket, reaction){

		if (reaction == 'likes')
		  this.points += 50;
		else if (reaction == 'angry')
		  this.points -= 50;
		else if (reaction == 'angry-react') 
		  this.points += 20;
		else if (reaction == 'extra-angry') 
		  this.points -= 50;

		this.gameSocket.emit('feed:update', { points: this.points });

	}

	FailProfile() {

	 	// Clear round

	 	// Send player back to badges screen

	 	// Send data
		this.gameSocket.emit('game:base', { state: 'fail', badges: this.badges });

	 }

	 CompleteProfile() {

	 	let correct = _.where(this.articlePool, { 'correct': true });

	 	// Check for more than 50%? (extra 'stars')
	 	// if (correct >= this.feed.length/2)
	 		
	 	// Save completed profile as a badge on player model (relationship)


	 	// Add profile to badges
	 	this.badges.push(this.currentProfile);

	 	// _.where(this.profilePool, { key: this.currentProfile.key });

	 	this.gameSocket.emit('game:playerData', { state: 'won', badges: this.badges });


	 }

	

	 ProfileScore(socket) {

	 	this.gameSocket = socket;

	 	let shared = _.where(this.feed, { 'shared': true });
	 	let skipped = _.where(this.feed, { 'shared': false });

	 	let correct = _.where(this.feed, { 'correct': true });

	 	let fake = _.where(shared, { 'fake': true });
	 	let debunked = _.where(fake, { 'debunked': true });

	 	console.log(fake);

		// Check if the player did well or not -- tell them!!
		if(this.points >= 5000 * this.currentProfile.level)
			this.CompleteProfile();
		else
			this.FailProfile();

		// Load end screen
		let path = 'partials/game/round';
		let data = {
		  currentProfile: this.currentProfile,
		  score: correct.length, 
		  shared: shared.length, 
		  skipped: skipped.length,
		  fake: fake.length,
		  debunked: debunked.length,
		  points: this.points
		};

		this.Templates.Load(path, data, (html) => {
			 // Send the new event and goal 
			 this.gameSocket.emit('profile:score', { html: html, data: data });

		});

	 }


	 

	 // For basic add/sub do not include reaction
	 // For reactions, num equals the ratio
	 
	 

	 PlayerData() {

		// let path = 'partials/end';
		// let data = {
		//     identityGrip: this.identityGrip
		// };

		// this.Templates.Load(path, data, (html) => {
		// 	 // Send the new event and goal 
		// 	this.gameSocket.emit('game:end', { html: html, data: data });

		// });

	 }

	 

}

module.exports = FakeNews;