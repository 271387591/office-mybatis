/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.store.FlowForm', {
    extend: 'Ext.data.Store',
    alias: 'store.flowForm',

    requires: [
        'FlexCenter.forms.model.FlowForm'
    ],

    model: 'FlexCenter.forms.model.FlowForm',
    pageSize: 20,
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: 'flowFormController.do?method=listFlowForms',
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
});
