/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 3:12 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.ProcessInstance',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'suspended',
        'businessKey',
        'definitionId',
        'end',
        'activityId',
        'activityName',
        'category',
        'startTime',
        'startUser',
        'executionId'
    ]
});
