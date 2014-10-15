/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 24/1/13
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.store.Roles',{
  extend: 'Ext.data.Store',
  alias: 'store.roles',

  requires:[
    'FlexCenter.user.model.Role'
  ],
  model:'FlexCenter.user.model.Role',
  proxy:{
    type: 'ajax',
    url: 'userRoleController.do?method=listRoles',
    reader: {
      type: 'json',
      root : 'data',
      totalProperty  : 'total',
      messageProperty: 'message'
    },
      writer: {
          writeAllFields: false,
          root: 'data'
      }
  },
  sorters: [
    {
      property: 'id',
      direction: 'DESC'
    }
  ],
  baseParams:{
    roleName:''
  }

});