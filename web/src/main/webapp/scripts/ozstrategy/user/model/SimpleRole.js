/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-01
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.model.SimpleRole', {
  extend: 'Ext.data.Model',

  fields: [
    {name: 'id'},
    {name: 'name',type:'string'},
    {name: 'displayName',type:'string'}

  ]
});