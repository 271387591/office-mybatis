/**
 * Created by lihao on 10/22/14.
 */
Ext.define('FlexCenter.flows.store.ProcessInstanceHistory', {
    extend: 'Ext.data.Store',
    requires: [
        'FlexCenter.flows.model.ProcessInstanceHistory'
    ],
    model: 'FlexCenter.flows.model.ProcessInstanceHistory',
    pageSize: 20,
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: 'processInstanceHistoryController.do?method=listProcessInstanceHistories',
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