/**
 * Created by .
 * User: liaodongming
 * Date: 11-10-21
 * Time: PM2:45
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.store.AllFeatures', {
    extend: 'Ext.data.Store',
    alias: 'store.allFeatures',

    requires: [
      'FlexCenter.user.model.Feature',
      'Oz.data.DwrProxy'
    ],

    model: 'FlexCenter.user.model.Feature',

    pageSize: 20,

    proxy: {
      type: 'ajax',
      url: 'userRoleController.do?method=listFeatures',
//
//      api : {
//        read: userRoleController.listFeatures,
//          update: userRoleController.saveOrUpdate,
//          create:userRoleController.saveOrUpdate,
//          destroy:userRoleController.saveOrUpdate
//      },

      reader: {
        root : 'data',
        totalProperty  : 'total',
        messageProperty: 'message'
      },

      writer: {
        writeAllFields: true,
        root: 'data'
      },

      listeners: {
        exception: function(proxy, response, operation) {
          Ext.MessageBox.show({
              title: globalRes.remoteException,
              msg: operation.getError(),
              icon: Ext.MessageBox.ERROR,
              buttons: Ext.Msg.OK
            }
          );
        }
      }
    }
  })