/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 24/1/13
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.store.Users',{
  extend: 'Ext.data.Store',
  alias: 'store.users',

  requires:[
    'FlexCenter.user.model.User'
  ],
  model:'FlexCenter.user.model.User',
  proxy:{
    type: 'ajax',
    url: 'userController.do?method=listUsers',
//    api : {
//      read: '',
//      create: '',
//      update: ''
//    },
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
  autoLoad:false,
  autoSync: true

});