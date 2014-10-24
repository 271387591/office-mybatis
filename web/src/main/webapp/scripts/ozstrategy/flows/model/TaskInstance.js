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
        'title',
        'processDefId',
        'processName',
        'processVersion',
        {name:'groupBy',convert:function(v,record){
            return (record.get('processName')+":"+record.get('title')+":"+record.get('instanceId'))
        }},
        {name:'startDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        
        {name:'endDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'overdueDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'createDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'lastUpdateDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }}
    ]
});