/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 8:29 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.ATask',{
    extend: 'Ext.data.Store',

    requires:[
        'FlexCenter.activiti.model.ATask'
    ],
    model:'FlexCenter.activiti.model.ATask',
    proxy:{
        type: 'ajax',
        url:'processesController/getTasks',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
