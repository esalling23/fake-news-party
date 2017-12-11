/**
 * (Site name here) 
 * 
 * Article page Model
 * @module Article
 * @class Article
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;



/**
 * Article model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Article = new keystone.List('Article', 
	{
		label: 'Articles',
		singular: 'Article',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Article
 */
Article.add({

	name: { type: String, label: 'Headline', required: true, initial: true },
	user: { type: String, label: 'Username', note: 'This could be a fake username, a real individual\'s name, or a company/brand/group' },
	thumbnail: { type: Types.CloudinaryImage, label: 'User Thumbnail Image', folder: 'FakeNews/Articles' },
	location: { type: String, label: 'User Location' },
	cover: { type: Types.CloudinaryImage, label: 'Post Cover Photo', folder: 'FakeNews/Articles' },
	comments: { type: Types.TextArray, label:'Potential Comments' },
	source: { type: String, label: 'Source' },
	description: { type: Types.Markdown, label: 'Article Description' },
	types: { 
		type: Types.Relationship, 
		label: 'Type of News', 
		ref: 'NewsType', 
		many: true
	}, 
	// debunked : { type: Types.TextArray, label: 'Debunked messages', dependsOn: { 'fake': true } },
	hashtags: { 
		type: Types.Relationship, 
		label: 'Pro Hashtags', 
		ref: 'Hashtag', 
		many: true
	}, 
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

Article.schema.statics.removeResourceRef = function(resourceId, callback) {

    Article.model.update({
            $or: [{
                'hashtags': resourceId, 
                'types': resourceId
            }]
        },

        {
            $pull: {
                'hashtags': resourceId, 
                'types': resourceId
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
Article.defaultSort = '-createdAt';
Article.defaultColumns = 'name, updatedAt';
Article.register();
