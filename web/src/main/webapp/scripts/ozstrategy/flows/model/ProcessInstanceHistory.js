/**
 * Created by lihao on 10/22/14.
 */
Ext.define('FlexCenter.flows.model.ProcessInstanceHistory',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'processName',
        'title',
        'processDefId',
        'processDefinitionId',
        'actInstanceId',
        'instanceId',
        'startUserId',
        'runTasks',
        {name:'startTime',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'endTime',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }}
    ],
    hasMany: [
        { model: 'FlexCenter.flows.model.Task', name: 'runTasks' }
    ]
});