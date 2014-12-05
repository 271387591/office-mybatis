/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.store.FormField', {
    extend: 'Ext.data.Store',
    alias: 'store.formField',
    requires: [
        'FlexCenter.forms.model.FormField'
    ],
    model: 'FlexCenter.forms.model.FormField',
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: 'flowFormController.do?method=listFlowForms',
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
    },
    autoLoad:false
});
