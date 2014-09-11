/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/14/13
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ClawBackTaskView',{
    requires:[
        'FlexCenter.activiti.store.ATask'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.clawBackTaskView',
    itemId:'clawBackTaskView',
    title:'任务追回',
    layout:'border',
    autoScroll:true,
    closable:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ATask',{
            storeId:'clawBackTaskViewStore',
            proxy:{
                type: 'ajax',
                url:'processesController/getClawBackTask',
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total',
                    messageProperty: 'message'
                }
            }
        });
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        store.load();
        var sm = Ext.create('Ext.selection.CheckboxModel');
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
                            },{
                                fieldLabel:'任务名称',
                                xtype : 'textfield',
                                name : 'taskName'
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
                                name : 'startTime'
                            },
                            {
                                fieldLabel:'结束日期',
                                xtype : 'datefield',
                                format : 'Y-m-d',
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
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
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
                        header: '流程名称',
                        dataIndex: 'processDefinitionName'
                    },
                    {
                        header: '日期',
                        dataIndex: 'createTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        header: '任务名称',
                        dataIndex: 'name'
                    },
                    {
                        xtype:'actioncolumn',
                        header:'管理',
                        items:[
                            {
                                iconCls:'btn-flowView',
                                tooltip:'执行情况',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.showDetail(rec);
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-claw-back',
                                tooltip:'追回',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var data={taskId:rec.get('id'),taskKey:rec.get('taskDefinitionKey'),instanceId:rec.get('processInstanceId')}
                                    Ext.Ajax.request({
                                        url:'processesController/clawTask',
                                        params:data,
                                        method: 'POST',
                                        success:function(response, options){
                                            var result=Ext.decode(response.responseText);
                                            if(result.success == true){
                                                me.down('grid').getStore().load();
                                            }
                                            Ext.MessageBox.show({
                                                title:'任务追回',
                                                icon:result.success == true?Ext.MessageBox.INFO:Ext.MessageBox.ERROR,
                                                msg:result.message,
                                                buttons:Ext.MessageBox.OK
                                            });
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
    showDetail:function(rec){
        var itemId= 'clawBackTaskViewProcessDetailView'+rec.get('id');
        var html='<img src="processesController/readTraceResource?definitionId='+rec.get('processDefinitionId')+'&executionId='+rec.get('executionId')+'" />'
        var config={
            diagramHtml:html,
            title:rec.get('processDefinitionName')+"-流程详细",
            itemId: itemId,
            processInstanceId:rec.get('processInstanceId')
        };
        Ext.ComponentQuery.query('userCenterPanel')[0].addPanel('applyProcessDetailView',itemId,config);
    }
})
