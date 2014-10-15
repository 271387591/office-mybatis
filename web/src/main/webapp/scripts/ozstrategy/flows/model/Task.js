/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 8:07 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.flows.model.Task',{
    extend: 'Ext.data.Model',
    fields:[
         'id',
         'name',
         'assignee',
         'actInstanceId',
         'instanceId',
         'executionId',
         'processDefinitionId',
         'taskDefinitionKey',
         'parentTaskId',
         'suspended',
        'processDefinitionName',
        'priority',
        'description',
        'owner',
        'deploymentId',
        'delegationState',
        'category',
        'tenantId',
        'processDefId',
        'title',
        'taskType',
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'dueDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        'graphResId',
        'formKey'
    ]
});
