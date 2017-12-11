/**
 * (Site name here) 
 * 
 * Profile page Model
 * @module Profile
 * @class Profile
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Profile model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Profile = new keystone.List('Profile', 
	{
		label: 'Profiles',
		singular: 'Profile',
		track: true,
		autokey: { path: 'key', from: 'name', unique: true },
	});

/**
 * Model Fields
 * @main Profile
 */
Profile.add({

	name: { type: String, label: 'Profile Name', hidden: true },
	cover: { type: Types.CloudinaryImage, label: 'Cover Photo', folder: 'FakeNews/Profiles' },
	image: { type: Types.CloudinaryImage, label: 'Profile Image', folder: 'FakeNews/Profiles' },
	bio: { type: Types.Markdown, label: 'Profile About Bio'},

	alienMessage: { type: Types.Markdown, label: 'Initial message from the Aliens about understanding of this human' },
	alienGood: { type: Types.TextArray, label: 'Alien esponses to players doing well', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	alienBad: { type: Types.TextArray, label: 'Alien esponses to players doing poorly', note: 'Should be in increasingly dramatic tone, up to 3 messages'},
	
	missions: { 
		type: Types.Relationship,
	 	label: 'Missions/Scenarios',
	 	ref: 'Scenario', 
	 	many: true
	}, 

	timeSpan: { 
		type: Types.Relationship,
	 	label: 'Related Timespan',
	 	ref: 'TimeSpan', 
	 	many: false
	}, 

	decadeBlock: { type: Types.Select, label: 'Decade(s) Within Time Span', options: '00, 20, 40, 60, 80'}

}, 'Leanings', {
	pros: { 
		type: Types.Relationship,
	 	label: 'Hashtags this profile supports',
	 	ref: 'Hashtag', 
	 	many: true
	},
	cons: { 
		type: Types.Relationship,
	 	label: 'Hashtags this profile does not support',
	 	ref: 'Hashtag', 
	 	many: true
	},
	neutrals: {
		type: Types.Relationship,
	 	label: 'Hashtags this profile is neutral towards',
	 	ref: 'Hashtag', 
	 	many: true
	}
	// ratio: { type: String, label: 'Ratio', note: 'Should be in 40:20 format, adding up to 100 or less. If less, leftover is nuetral parties.'}
});

Profile.schema.statics.removeResourceRef = function(resourceId, callback) {

    Profile.model.update({
            $or: [{
                'pros': resourceId, 
                'cons': resourceId, 
                'neutrals': resourceId, 
                'missions': resourceId
            }]
        },

        {
            $pull: {
                'pros': resourceId, 
                'cons': resourceId, 
                'neutrals': resourceId, 
                'missions': resourceId
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
Profile.defaultSort = '-createdAt';
Profile.defaultColumns = 'name, updatedAt';
Profile.register();
