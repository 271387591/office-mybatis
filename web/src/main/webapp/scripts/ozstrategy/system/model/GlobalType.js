/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 15/7/13
 * Time: 2:34 下午
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.model.GlobalType',{
  extend: 'Ext.data.Model',
  fields:[
    {name:'typeId', type:'long'},
    {name:'parentId', type:'long'},
    'parentName',
    'typeName',
    'typeKey',
    'path',
    'catKey',
    'text',
    {name:'createDate'},
    {name:'depth',type:'int'},
    {name:'priority',type:'int'}
  ]
});