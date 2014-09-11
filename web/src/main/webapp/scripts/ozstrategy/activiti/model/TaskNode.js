/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/22/13
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.TaskNode',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'taskKey',
        'taskName',
        'modelId',
        'deployedId',
        'processDefinitionId',
        'type',
        'objection',
        'fieldInfo',
        'formDataId',
        'taskAssignee',
        'assigneeName',
        'metaInfo',
        'formKey',
        'assigneeType'
    ]
});
