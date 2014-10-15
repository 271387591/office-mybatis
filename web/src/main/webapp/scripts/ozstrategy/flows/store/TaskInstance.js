/**
 * Created by lihao on 9/10/14.
 */
Ext.define('FlexCenter.flows.store.TaskInstance', {
    extend: 'Ext.data.Store',
    requires: [
        'FlexCenter.flows.model.TaskInstance'
    ],
    model: 'FlexCenter.flows.model.TaskInstance',
    pageSize: 20,
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: 'taskInstanceController.do?method=listTaskInstances',
        reader: {
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
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
});
