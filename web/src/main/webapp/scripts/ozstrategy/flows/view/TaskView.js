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
    getAssigneeStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.Task',{
            storeId:'aTaskViewAssigneeStore',
            proxy: {
                type: 'ajax',
                url: 'taskController.do?method=listAssigneeTasks',
                reader: {
                    root : 'data',
                    totalProperty  : 'total',
                    messageProperty: 'message'
                },
                listeners: {
                    exception: function(proxy, response, operation) {
                        Ext.MessageBox.show({
                                title: globalRes.remoteException,
                                msg: operation.getError(),
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.Msg.OK
                            }
                        );
                    }
                }
            }
            
        });
        store.load();
        return store;
    },
    getCandidateStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.Task',{
            storeId:'aTaskViewCandidateStore'
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var assigneeStore=me.getAssigneeStore(); 
        var candidateStore=me.getCandidateStore(); 
        me.items=[
            {
                xtype:'grid',
                region:'north',
                store:assigneeStore,
                height:'50%',
                forceFit: true,
                border:false,
                autoScroll: true,
                title:'待执行任务',
                itemId:'assigneeGrid',
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: assigneeStore,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'刷新',
                        iconCls:'refresh',
                        scope:this,
                        handler:function(){
                            me.down('grid').getStore().load();
                        }
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','description','createDate','assignee'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
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
                                    }
                                },
                                getTip:function(v,metadata,record,rowIndex,colIndex,store){
                                    if(v){
                                        return '办理';
                                    }
                                },
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var data={
                                        executionId:rec.get('executionId'),
                                        processDefId:rec.get('processDefId'),
                                        instanceId:rec.get('instanceId'),
                                        processElementId:rec.get('processElementId')
                                    }
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
                        ]
                    }
                ]
            },{
                xtype:'grid',
                region:'center',
                store:candidateStore,
                forceFit: true,
                border:false,
                autoScroll: true,
                itemId:'candidateGrid',
                title:'待签收任务',
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: candidateStore,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'刷新',
                        iconCls:'refresh',
                        scope:this,
                        handler:function(){
                            me.down('grid').getStore().load();
                        }
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','description','createDate','assignee'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
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
                                    return 'update';
                                },
                                getTip:function(v,metadata,record,rowIndex,colIndex,store){
                                    
                                    return '签收';
                                },
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
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
        me.down('#assigneeGrid').getStore().load();
        me.down('#candidateGrid').getStore().load();
    }
});
