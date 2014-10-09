/**
 * Created by lihao on 9/28/14.
 */
Ext.define('FlexCenter.flows.store.ProcessDefInstanceDraft', {
    extend: 'Ext.data.Store',
    requires: [
        'FlexCenter.flows.model.ProcessDefInstanceDraft'
    ],
    model: 'FlexCenter.flows.model.ProcessDefInstanceDraft',
    pageSize: 20,
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: 'processDefInstanceDraftController.do?method=listProcessDefInstanceDraft',
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