/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/22/13
 * Time: 1:06 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.TaskNode',{
    extend: 'Ext.data.Store',
    requires:[
        'FlexCenter.activiti.model.TaskNode'
    ],
    model:'FlexCenter.activiti.model.TaskNode',
    proxy:{
        type: 'ajax',
        url:'modelController/getTaskNodes',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
