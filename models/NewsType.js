/**
 * (Site name here) 
 * 
 * NewsType page Model
 * @module NewsType
 * @class NewsType
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * NewsType model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var NewsType = new keystone.List('NewsType', 
	{
		label: 'NewsTypes',
		singular: 'NewsType',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main NewsType
 */
NewsType.add({

	name: { type: String, label: 'Headline', required: true, initial: true },
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});


/**
 * Model Registration
 */
NewsType.defaultSort = '-createdAt';
NewsType.defaultColumns = 'name, updatedAt';
NewsType.register();
