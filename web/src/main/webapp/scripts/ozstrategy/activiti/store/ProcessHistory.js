/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 10:38 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.ProcessHistory',{
    extend: 'Ext.data.Store',
    alias: 'store.message',

    requires:[
        'FlexCenter.activiti.model.ProcessHistory'
    ],
    model:'FlexCenter.activiti.model.ProcessHistory',
    proxy:{
        type: 'ajax',
        url:'processesController/getProcessHistories',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
