/**
 * (Site name here) 
 * 
 * TimeSpan page Model
 * @module TimeSpan
 * @class TimeSpan
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * TimeSpan model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var TimeSpan = new keystone.List('TimeSpan', 
	{
		label: 'TimeSpans',
		singular: 'TimeSpan',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main TimeSpan
 */
TimeSpan.add({

	name: { type: String, label: 'Timespan Name', note: 'These should be centuries -- Ex: "1800"', required: true, initial: true },

    type: { type: Types.Select, label: 'Timespan Type', options: 'BC, AD'}, 

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});


/**
 * Model Registration
 */
TimeSpan.defaultSort = '-createdAt';
TimeSpan.defaultColumns = 'name, updatedAt';
TimeSpan.register();
