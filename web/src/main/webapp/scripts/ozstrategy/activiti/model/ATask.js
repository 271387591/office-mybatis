/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 8:07 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.ATask',{
    extend: 'Ext.data.Model',
    fields:[
         'id',
         'name',
         'assignee',
         'processInstanceId',
         'executionId',
         'processDefinitionId',
         'createTime',
         'dueDate',
         'taskDefinitionKey',
         'parentTaskId',
         'suspended',
        'processDefinitionName',
        'priority',
        'description',
        'owner',
        'deploymentId',
        'initial',
        'signTaskRunNode',
        'turnBack',
        'flowFileAttach'
    ]
});
