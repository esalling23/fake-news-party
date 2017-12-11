 /**
  * Emerging Citizens
  * 
  * GameConfig Model
  * @module models
  * @class GameConfig
  * @author Johnny Richardson
  * 
  * For field docs: http://keystonejs.com/docs/database/
  *
  * ==========
  */
 var keystone = require('keystone');
 var Types = keystone.Field.Types;

 /**
  * GameConfig Model
  * ==========
  */

 var GameConfig = new keystone.List('GameConfig', {
     label: 'Games Config',
     track: true,
     candelete: true,
     cancreate: true
 });

 GameConfig.add({

    name: { type: String }, 

    defProfPic: { type: Types.CloudinaryImage, label: 'Default Profile Picture for Articles', folder: 'FakeNews/Config'}, 
    rounds: { type: Number, label: 'Round Cap'}
     
});

 
 /**
  * Registration
  */

 GameConfig.defaultColumns = 'gameType';
 GameConfig.register();