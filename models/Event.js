/**
 * (Site name here) 
 * 
 * Event page Model
 * @module Event
 * @class Event
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * Event model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Event = new keystone.List('Event', 
	{
		label: 'Events',
		singular: 'Event',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Event
 */
Event.add({

	name: { type: String, label: 'Headline', required: true, initial: true },
	trendingDescription: { type: Types.Markdown, label: 'Trending Event Description' },
	
	articles: { 
		type: Types.Relationship, 
		label: 'Articles', 
		ref: 'Article', 
		note: 'Articles are pulled based on events',
		many: true
	},

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

Event.schema.statics.removeResourceRef = function(resourceId, callback) {

    Event.model.update({
            $or: [{
                'articles': resourceId
            }]
        },

        {
            $pull: {
                'articles': resourceId
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
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name, updatedAt';
Event.register();
