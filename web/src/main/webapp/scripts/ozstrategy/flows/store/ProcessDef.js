/**
 * Created by lihao on 9/10/14.
 */
Ext.define('FlexCenter.flows.store.ProcessDef', {
    extend: 'Ext.data.Store',
    requires: [
        'FlexCenter.flows.model.ProcessDef'
    ],
    model: 'FlexCenter.flows.model.ProcessDef',
    pageSize: 20,
    autoLoad:false,
    
    proxy: {
        type: 'ajax',
        url: 'processDefController.do?method=listProcessDefs',
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
