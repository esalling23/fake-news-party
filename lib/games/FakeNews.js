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

		this.config,
		this.badges = [],
		this.articlePool = [],
		this.feed = [],
		this.profilePool = [],
		this.eventPool = [],

		this.newsTypes,
		this.currentProfile,
		this.currentMission,
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
		this.GameConfig = this.keystone.list('GameConfig').model;

		this.GameConfig.findOne({}, {}, {
	        sort: {
	            'createdAt': -1
	        }
      	}).exec((err, config) => {

      		this.config = config;

      		// Grab the profiles
			this.Profiles.findOne({ '_id': session.profile })
			.populate('pros cons neutrals missions')
			.exec((err, result) => {
				this.currentProfile = result;
				// Later will show missions to pick from, for now just pick random mission
				this.currentMission = result.missions[_.random(0, result.missions.length - 1)];

				this.Scenario.findOne({ _id: this.currentMission._id })
				.populate('events')
				.exec((err, scenario) => {

					_.each(scenario.events, (event) => {

						this.eventPool.push(event);

						_.each(event.articles, (article) => {

							this.Articles.findOne({ _id: article })
							.populate('types hastags')
							.exec((err, result) => {
								this.articlePool.push(result);
							});

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

	 	console.log(this.currentProfile, "StartGame:101");
		
		let path = 'partials/game/profile';
		let data = {
		    currentProfile: this.currentProfile, 
		    config: this.config
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
		this.feed = _.shuffle(this.articlePool);
		this.shareData = {
			'bad': [],
			'good': [],
			'neutral': []
		};
		this.NewsTypes = this.keystone.list('NewsType').model;

		this.NewsTypes.find({})
		.exec((err, result) => {

			this.newsTypes = result;

			// Set the articles
			let path = 'partials/game/feed';
			let data = {
				config: this.config,
				currentProfile: this.currentProfile,
				events: this.eventPool,
			    articles: this.feed,
			    newsTypes: this.newsTypes
			};		

			this.Templates.Load(path, data, (html) => {

				// Send the new feed
				this.gameSocket.emit('game:newFeed', { html: html, data: data });

			});

		});

	}

	CheckPost(socket, eventData) {
		// reset reactions
		this.reactions = [];

	 	console.log(eventData, " backend data")

		var currentArticle = _.where(this.feed, { key: eventData.post })[0];

		console.log(_.where(this.feed, { key: eventData.post}));

		console.log(this.feed, "CheckPost:154, this.feed");

		console.log(currentArticle, "CheckPost:156, currentArticle");

		currentArticle.shared = eventData.shared;

		// Check article hashtags and compare with profile pros/cons
		this.CheckHashtags(currentArticle);
	
		this.CheckRep(this.reactions);

		// this.CheckSpyStatus(this.reactions);

		this.gameSocket.emit('feed:update', { 
			article: currentArticle.key, 
			reactions: this.reactions, 
			points: this.points
		});

	}

	CheckHashtags(article) {

		_.each(article.hashtags, (tag) => {
			// Check Pros first
			_.each(this.currentProfile.pros, (pros) => {

				console.log(tag, pros);

				if (pros.key == tag.key) {
					if (article.shared)
						this.reactions.push("positive");
					else 
						this.reactions.push("negative");
				}

			});

			// Check Cons
			_.each(this.currentProfile.cons, (cons) => {

				console.log(tag, cons);

				if (cons.key == tag.key) {
					if (article.shared)
						this.reactions.push("negative");
					else 
						this.reactions.push("positive");
				}

			});

		});

	}

	// Check points when article is skipped/shared
	CheckRep(reactions) {

		let wrong = _.where(this.reactions, "negative").length;
		let right = _.where(this.reactions, "positive").length;

		let reputation = 10 * (right - wrong) + 100;

		let data = {
			reputation: reputation
		};

		this.gameSocket.emit( 'feed:update', data );

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
			config: this.config, 
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