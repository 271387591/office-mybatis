/**
 * Created by lihao on 12/1/14.
 */
Ext.define('FlexCenter.system.store.SystemMessage', {
    extend: 'Ext.data.Store',
    alias: 'store.systemMessageStore',

    requires: [
        'FlexCenter.system.model.SystemMessage'
    ],
    model: 'FlexCenter.system.model.SystemMessage',
    proxy: {
        type: 'ajax',
        url: 'systemMessageController.do?method=listSystemMessages',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            messageProperty: 'message'
        }
    }


});