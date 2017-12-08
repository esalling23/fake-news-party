/**
 * Emerging Citizens
 * 
 * GameData Model
 * @module models
 * @class GameData
 * @author Johnny Richardson
 * 
 * ==========
 */
"use strict";

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * GameData Model
 * ==========
 */
var GameData = new keystone.List('GameData', {
	editable: false,
	cancreate: false,
	// hidden: true,
    track: true
});
/**
 * Model Fields
 * @main GameData
 */
GameData.add({

  accessCode: { type: String, required: true, initial: true, hidden: true }, 
  updated: { type: Date, noedit: true }

});

/**
 * Registration
 */
GameData.register();
exports = module.exports = GameData;
