'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game manager.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var GameManager = function(gameSession) {
	
	let Game;

	let FakeNewsLib = require('./games/FakeNews');
	Game = new FakeNewsLib();
	
	Game.Initialize(gameSession);

	return Game;

};

module.exports = GameManager;