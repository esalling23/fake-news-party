/**
 * Emerging Citizens
 * 
 * Hashtag Model
 * @module Hashtag
 * @class Hashtag
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Hashtag Model
 * ==========
 */

var Hashtag = new keystone.List('Hashtag');

Hashtag.add({
	name: { type: String, label: 'Hashtag', required: true, initial: true, index: true },
	// category: {
 //        type: Types.Relationship,
 //        ref: 'ContentCategory',
 //        label: 'Category',
 //        required: true,
 //        initial: true,
 //        many: true
 //    }
});

/**
 * Registration
 */

Hashtag.defaultColumns = 'name, hashtag, category';
Hashtag.register();
