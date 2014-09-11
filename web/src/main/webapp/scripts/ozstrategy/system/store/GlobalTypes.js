/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/9/13
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.store.GlobalTypes', {
  extend: 'Ext.data.Store',
  alias: 'store.globalType',

  requires: [
    'FlexCenter.system.model.GlobalType'
  ],
  model: 'FlexCenter.system.model.GlobalType',
  proxy: {
    type: 'ajax',
    url: 'globalTypeController.do?method=listGlobalTypes',
    reader: {
      type: 'json',
      root: 'data',
      totalProperty: 'total',
      messageProperty: 'message'
    }
  }


});
