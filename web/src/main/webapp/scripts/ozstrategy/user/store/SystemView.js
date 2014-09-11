/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 24/1/13
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.store.SystemView',{
  extend: 'Ext.data.Store',
  alias: 'store.users',

  requires:[
    'FlexCenter.user.model.SystemView'
  ],
  model:'FlexCenter.user.model.SystemView',
  proxy:{
    type: 'ajax',
    url: 'systemViewController.do?method=listSystemView',
    reader: {
      type: 'json',
      root : 'data',
//      successProperty: 'success',
      totalProperty  : 'total',
      messageProperty: 'message'
    }
  },
  sorters: [
    {
      property: 'createDate',
      direction: 'ASC'
    }
  ],
  baseParams:{
  },
  autoLoad:true,
  autoSync: true

});