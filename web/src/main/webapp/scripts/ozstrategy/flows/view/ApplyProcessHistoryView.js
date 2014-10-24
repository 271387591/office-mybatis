/**
 * Created by lihao on 10/22/14.
 */
Ext.define('FlexCenter.flows.view.ApplyProcessHistoryView',{
    requires:[
        'FlexCenter.flows.store.ProcessInstanceHistory'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.applyProcessHistoryView',
    itemId:'applyProcessHistoryView',
    title:'流程申请记录',
    text:'流程申请记录',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.ProcessInstanceHistory',{
            storeId:'processInstanceHistoryViewStore'
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
                                name : 'processName'
                            },
                            {
                                fieldLabel:'流程状态',
                                name: 'pstatus',
                                xtype : 'combo',
                                mode : 'local',
                                editable : false,
                                triggerAction : 'all',
                                store :[['0','正在运行'],['1','已结束']]
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
                                format : 'Y-m-d',
                                editable:false,
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
                        dataIndex: 'processName'
                    },
                    {
                        header: '申请日期',
                        dataIndex: 'startTime'
                    },
                    {
                        header: '流程状态',
                        dataIndex: 'endTime',
                        renderer: function (v) {
                            if(v){
                                return "已结束"
                            }else{
                                return '<font color="red">正在运行</font>'
                            }
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
                                    me.preview(rec);
                                }
                            },'-',
                            {
                                iconCls:'btn-print',
                                tooltip:'打印流程执行情况',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    window.open('processesController/printFlowDetail?processInstanceId='+rec.get('id')+'&definitionId='+rec.get('definitionId'),'','');
                                }
                            },'-',
                            {
                                iconCls:'btn-print',
                                tooltip:'打印表单数据',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    window.open('processesController/printFormData?definitionId='+rec.get('definitionId')+'&instanceId='+rec.get('id')+'&deploymentId='+rec.get('deploymentId'),'','');
                                }
                            }
                        ]

                    }
                ],
                listeners:{
                    itemdblclick:function(grid, record, item, index, e, eOpts){
                        me.preview(record);
                    }

                }
            }
        ];
        this.callParent();
    },
    preview:function(record){
        var me=this;
        var data={};
        data.id=record.get('processDefId');
        var tasks= record.get('runTasks');
        data.taskKey=tasks.length>0?tasks[0].taskDefinitionKey:'';
        ajaxPostRequest('processDefController.do?method=getRes',data,function(result){
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