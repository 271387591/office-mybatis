/**
 * Created by lihao on 10/9/14.
 */
Ext.define('FlexCenter.flows.view.TaskView',{
    requires:[
        'FlexCenter.flows.store.Task',
        'FlexCenter.flows.view.TaskAssigneeView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.taskView',
    itemId:'taskView',
    title:'待办事项',
    text:'待办事项',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.Task',{
            storeId:'aTaskViewStore'
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        me.tbar = [
            {
                xtype:'button',
                frame:true,
                text:'刷新',
                iconCls:'refresh',
                scope:this,
                handler:function(){
                    me.down('grid').getStore().load();
                }
            },
            '->',
            {
                xtype: 'textfield',
                name: 'keyword',
                itemId:'taskViewSearch'
            },
            {
                xtype:'button',
                text:'搜索',
                iconCls:'search',
                handler:function(){
                    var value = me.down('#taskViewSearch').getValue();
                    var grid=me.down('grid');
                    grid.getStore().load({
                        params:{
                            keyword:value
                        }
                    });
                }
            },
            {
                xtype:'button',
                text:'清空',
                iconCls:'clear',
                handler:function(){
                    me.down('#taskViewSearch').setValue('');
                    me.down('grid').getStore().load();
                }
            }
        ];
        me.items=[
            {
                xtype:'grid',
                region:'center',
                store:store,
                forceFit: true,
                border:false,
                autoScroll: true,
                columns:[
                    {
                        xtype:'rownumberer'
                    },
                    {
                        header: '标题',
                        dataIndex: 'title'
                    },
                    {
                        header: '任务名称',
                        dataIndex: 'name'
                    },{
                        header: '流程名称',
                        dataIndex: 'processDefinitionName'
                    },{
                        header: '任务创建日期',
                        dataIndex: 'createDate'
                    },{
                        header: '任务描述',
                        dataIndex: 'description'
                    },{
                        xtype:'actioncolumn',
                        dataIndex: 'assignee',
                        header:'管理',
                        items:[
                            {
                                getClass: function(v, meta, record) {
                                    if(v){
                                        return 'task_assigned';
                                    }else{
                                        return 'update';
                                    }
                                },
                                getTip:function(v,metadata,record,rowIndex,colIndex,store){
                                    if(v){
                                        return '办理';
                                    }
                                    return '签收';
                                },
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if(!rec.get('assignee')){
                                        var data={
                                            taskId:rec.get('id')
                                        };
                                        ajaxPostRequest('taskController.do?method=claim',data,function(result){
                                            if(result.success){
                                                me.reloadData();
                                            }else{
                                                Ext.MessageBox.show({
                                                    title:'任务签收',
                                                    icon:Ext.MessageBox.ERROR,
                                                    msg:'签收失败',
                                                    buttons:Ext.MessageBox.OK
                                                });
                                            }
                                        });
                                    }else{
                                        var data={executionId:rec.get('executionId'),processDefId:rec.get('processDefId'),instanceId:rec.get('instanceId')}
                                        ajaxPostRequest('taskController.do?method=assignee',data,function(result){
                                            if(result.success){
                                                var ret=result.data;
                                                ret.taskId=rec.get('id');
                                                ret.taskKey=rec.get('taskDefinitionKey');
                                                ret.taskName=rec.get('name');
                                                ret.executionId=rec.get('executionId');
                                                ret.instanceId=rec.get('instanceId');
                                                ret.processDefId=rec.get('processDefId');
                                                ret.actInstanceId=rec.get('actInstanceId');
                                                ret.title=rec.get('title');
                                                ret.taskType=rec.get('taskType');
                                                ret.fromTaskAssignee=rec.get('fromTaskAssignee');
                                                ret.fromTaskType=rec.get('fromTaskType');
                                                ret.fromTaskKey=rec.get('fromTaskKey');
                                                ret.fromTaskId=rec.get('fromTaskId');
                                                ret.parentId=rec.get('parentId');
                                                ret.endTask=rec.get('endTask');
                                                var itemId='taskAssigneeView_'+rec.get('id');
                                                var config={
                                                    record:ret,
                                                    itemId:itemId,
                                                    text:rec.get('title'),
                                                    title:rec.get('title')
                                                }
                                                var apptabs = Ext.ComponentQuery.query('#apptabs')[0];
                                                apptabs.addTab('taskAssigneeView',itemId,'#taskView',config);
                                            }else{
                                                Ext.MessageBox.show({
                                                    title:'执行失败',
                                                    icon:Ext.MessageBox.ERROR,
                                                    msg:result.message,
                                                    buttons:Ext.MessageBox.OK
                                                });
                                            }
                                        });
                                        
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        this.callParent();
    },
    reloadData:function(){
        var me=this;
        me.down('grid').getStore().load();
    }
});
