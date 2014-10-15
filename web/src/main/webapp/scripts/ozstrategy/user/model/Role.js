/**
 * Created with IntelliJ IDEA.
 * User: wangym
 * Date: 2/1/13
 * Time: 11:06 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.model.Role',{
  extend: 'Ext.data.Model',
  fields:[
    {name:'id'},
    'name',
    'displayName',
      'context',
      'systemViewId',
    'description',
      'text',
    {name:'createDate',convert:function(v){
        return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
    }},
    {name:'lastUpdateDate',convert:function(v){
        return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
    }},
      'simpleFeatures',
      'users'
  ],
    hasMany: { model: 'FlexCenter.user.model.Feature', name: 'simpleFeatures' },
    hasMany: { model: 'FlexCenter.user.model.User', name: 'users' }

});