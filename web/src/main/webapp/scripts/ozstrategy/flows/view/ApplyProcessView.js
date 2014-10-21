/**
 * Created by lihao on 10/22/14.
 */
Ext.define('FlexCenter.flows.view.ApplyProcessView',{
    requires:[
        'FlexCenter.activiti.store.ProcessHistory',
        'FlexCenter.activiti.view.ApplyProcessDetailView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.applyProcessView',
    itemId:'applyProcessView',
    title:'我的申请流程',
    text:'我的申请流程',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ProcessHistory',{
            storeId:'applyProcessViewStore',
            proxy:{
                type: 'ajax',
                url:'processesController/getApplyProcess',
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total',
                    messageProperty: 'message'
                }
            }
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
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
                                name : 'name'
                            },
                            {
                                fieldLabel:'流程状态',
                                name: 'status',
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
                        dataIndex: 'name'
                    },
                    {
                        header: '日期',
                        dataIndex: 'startTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        header: '流程状态',
                        dataIndex: 'endTime',
                        renderer: function (v) {
                            if(v){
                                return "已结束"
                            }else{
                                return '正在运行'
                            }
                        }
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
                                    var itemId= 'applyProcessDetailView'+rec.get('id');
                                    var config={
                                        diagramHtml:rec.get('diagramHtml'),
                                        title:rec.get('name')+"-流程详细",
                                        itemId: itemId,
                                        processInstanceId:rec.get('id')
                                    };
                                    Ext.ComponentQuery.query('userCenterPanel')[0].addPanel('applyProcessDetailView',itemId,config);
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-print',
                                tooltip:'打印流程执行情况',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    window.open('processesController/printFlowDetail?processInstanceId='+rec.get('id')+'&definitionId='+rec.get('definitionId'),'','');
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-',
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
                    }

                }
            }
        ];
        this.callParent();
    },
    showDetail:function(rec){

    }
});