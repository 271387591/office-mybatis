/**
 * Created by lihao on 9/10/14.
 */
Ext.define('FlexCenter.flows.store.Task', {
    extend: 'Ext.data.Store',
    requires: [
        'FlexCenter.flows.model.Task'
    ],
    model: 'FlexCenter.flows.model.Task',
    pageSize: 20,
    autoLoad:false,
    sorters: [
        {
            property: 'createDate',
            direction: 'DESC'
        }
    ],
    proxy: {
        type: 'ajax',
        url: 'taskController.do?method=listCandidateTasks',
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
