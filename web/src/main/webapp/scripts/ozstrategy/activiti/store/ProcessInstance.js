/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 3:13 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.ProcessInstance',{
    extend: 'Ext.data.Store',
    alias: 'store.message',

    requires:[
        'FlexCenter.activiti.model.ProcessInstance'
    ],
    model:'FlexCenter.activiti.model.ProcessInstance',
    proxy:{
        type: 'ajax',
        url:'processesController/getProcessInstances',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
