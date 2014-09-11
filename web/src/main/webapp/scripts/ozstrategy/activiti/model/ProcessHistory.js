/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 10:36 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('FlexCenter.activiti.model.ProcessHistory',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'startActivityId',
        'businessKey',
        'definitionId',
        'startActivityName',
        'startTime',
        'endTime',
        'startUserId',
        'durationInMillis',
        'diagramHtml',
        'category',
        'deploymentId'
    ]
});
