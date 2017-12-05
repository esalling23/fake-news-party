/**
 * (Site name here) 
 * 
 * Scenario page Model
 * @module Scenario
 * @class Scenario
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * Scenario model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Scenario = new keystone.List('Scenario', 
	{
		label: 'Scenarios',
		singular: 'Scenario',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Scenario
 */
Scenario.add({

	name: { type: String, label: 'Name', required: true, initial: true },

	events: { 
		type: Types.Relationship, 
		label: 'Events', 
		ref: 'Event', 
		note: 'Events will be randomized and chosen in groups of 3',	 
		many: true
	},

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

Scenario.schema.statics.removeResourceRef = function(resourceId, callback) {

    Scenario.model.update({
            $or: [{
                'events': resourceId
            }]
        },

        {
            $pull: {
                'events': resourceId
            }
        },

        {
            multi: true
        },

        function(err, result) {

            callback(err, result);

            if (err)
                console.error(err);
        }
    );

};

/**
 * Model Registration
 */
Scenario.defaultSort = '-createdAt';
Scenario.defaultColumns = 'name, updatedAt';
Scenario.register();
