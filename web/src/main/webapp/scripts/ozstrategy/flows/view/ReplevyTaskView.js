/**
 * Created by lihao on 10/21/14.
 */
Ext.define('FlexCenter.flows.view.ReplevyTaskView',{
    requires:[
        'FlexCenter.flows.store.Task'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.replevyTaskView',
    itemId:'replevyTaskView',
    title:'任务追回',
    text:'任务追回',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.Task',{
            storeId:'replevyTaskViewStore',
            proxy:{
                type: 'ajax',
                url:'taskController.do?method=listReplevyTasks',
                reader: {
                    type: 'json',
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
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        me.items=[
            {
                xtype:'form',
                region:'north',
                height:60,
                frame:false,
                itemId:'searchApplyProcessViewForm',
                border:false,
                layout:'column',
                defaults: {
                    layout: 'vbox'
                },
                items:[
                    {
                        columnWidth: 1/3,
                        bodyStyle:'padding:5px 0 5px 5px',
                        border:false,
                        items:[
                            {
                                fieldLabel:'流程名称',
                                xtype : 'textfield',
                                name : 'processDefinitionName'
                            },{
                                fieldLabel:'申请标题',
                                xtype : 'textfield',
                                name : 'title'
                            }
                        ]
                    },
                    {
                        columnWidth: 1/3,
                        border:false,
                        bodyStyle:'padding:5px 0 5px 5px',
                        items:[
                            {
                                fieldLabel:'开始日期',
                                xtype : 'datefield',
                                editable:false,
                                format : 'Y-m-d',
                                name : 'startTime'
                            },
                            {
                                fieldLabel:'结束日期',
                                xtype : 'datefield',
                                editable:false,
                                format : 'Y-m-d 23:59:59',
                                name : 'endTime'
                            }
                        ]
                    },
                    {
                        columnWidth: 1/3,
                        border:false,
                        bodyStyle:'padding:5px 0 5px 5px',
                        items:[
                            {
                                xtype : 'button',
                                text : '查询',
                                iconCls : 'search',
                                handler : function() {
                                    var data = me.down('form').getForm().getValues();
                                    me.down('grid').getStore().load({
                                        params:data
                                    });
                                }
                            },
                            {
                                xtype : 'button',
                                text : '清空',
                                margins:'5 0 0 0',
                                iconCls : 'clear',
                                handler : function() {
                                    me.down('form').getForm().reset();
                                    me.down('grid').getStore().load();
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype:'grid',
                region:'center',
                store:store,
                title:'可追回的任务',
                forceFit: true,
                autoScroll: true,
                border:true,
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                columns:[
                    {
                        xtype:'rownumberer'
                    },
                    {
                        header: '申请标题',
                        dataIndex:'title'
                    },
                    {
                        header: '流程名称',
                        dataIndex: 'processDefinitionName'
                    },
                    {
                        header: '日期',
                        dataIndex: 'createDate'
                    },
                    {
                        header: '任务名称',
                        dataIndex: 'name'
                    },
                    {
                        header: '状态',
                        dataIndex: 'name',
                        renderer: function (v) {
                            return '未签收';
                        }
                    },
                    
                    {
                        xtype:'actioncolumn',
                        header:'管理',
                        items:[
                            {
                                iconCls:'btn-readdocument',
                                tooltip:'查看流程图',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var data={};
                                    data.id=rec.get('processDefId');
                                    data.taskKey=rec.get('taskDefinitionKey');
                                    me.preview(data);
                                }
                            },'-',
                            {
                                iconCls:'btn-claw-back',
                                tooltip:'追回',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var data={};
                                    data.taskId=rec.get('id');
                                    data.taskKey=rec.get('taskDefinitionKey');
                                    Ext.Msg.confirm('任务追回','任务追回将会反回到您刚所操作的任务节点，你确定要追回？',function(btn){
                                        if(btn=='yes'){
                                            me.replevy(data);
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ],
                listeners:{
                    itemdblclick:function(grid, record, item, index, e, eOpts){
                        me.showDetail(record);
                    }
                }
            }
        ];
        this.callParent();
    },
    replevy:function(record){
        var me=this;
        ajaxPostRequest('taskController.do?method=replevyTask',record,function(result){
            if(result.success){
                Ext.MessageBox.alert({
                    title:'提示',
                    icon: Ext.MessageBox.INFO,
                    msg:'追回成功。',
                    buttons:Ext.MessageBox.OK
                });
                me.down('grid').getStore().load();
            }else{
                Ext.MessageBox.alert({
                    title:'警告',
                    icon: Ext.MessageBox.ERROR,
                    msg:'追回失败',
                    buttons:Ext.MessageBox.OK
                });
            }
        });
        
    },
    
    preview:function(record){
        var me=this;
        ajaxPostRequest('processDefController.do?method=getRes',record,function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerPreviewWindow',{
                    graRes:graRes,
                    taskKey:record.taskKey,
                    animateTarget:me.getEl()
                });
                moder.show();
            }else{
                Ext.MessageBox.alert({
                    title:'警告',
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    }
});