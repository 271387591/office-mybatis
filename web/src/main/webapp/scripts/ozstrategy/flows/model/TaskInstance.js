/**
 * Created by lihao on 10/10/14.
 */
Ext.define('FlexCenter.flows.model.TaskInstance',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'documentation',
        'taskKey',
        'startDate',
        'endDate',
        'overdueDate',
        'elementId',
        'assigneeId',
        'assigneeFullName',
        'assigneeUsername',
        'instanceId',
        'remarks',
        'actTaskId',
        'status',
        'creatorId',
        'creatorFullName',
        'lastUpdaterId',
        'lastUpdaterFullName',
        'durationIn',
        {name:'startDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'endDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'overdueDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }}
    ]
});