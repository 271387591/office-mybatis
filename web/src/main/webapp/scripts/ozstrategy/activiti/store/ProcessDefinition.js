/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 1:31 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.ProcessDefinition',{
    extend: 'Ext.data.Store',
    requires:[
        'FlexCenter.activiti.model.ProcessDefinition'
    ],
    model:'FlexCenter.activiti.model.ProcessDefinition',
    proxy:{
        type: 'ajax',
        url:'processesController/getProcessDefinitions',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
