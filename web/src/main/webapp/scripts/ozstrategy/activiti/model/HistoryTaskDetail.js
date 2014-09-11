/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/28/13
 * Time: 7:11 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.HistoryTaskDetail',{
    extend: 'Ext.data.Model',
    fields:[
        'taskName',
        'assignee',
        'startTime',
        'endTime',
        'durationIn',
        'objection',
        'type',
        'assigneeName'
    ]
});
