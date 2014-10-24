/**
 * Created by lihao on 10/22/14.
 */
Ext.define('FlexCenter.flows.view.TaskRecordView',{
    requires:[
        'FlexCenter.flows.store.ProcessInstanceHistory'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.taskRecordView',
    itemId:'taskRecordView',
    title:'任务执行记录',
    text:'任务执行记录',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.TaskInstance',{
            storeId:'taskRecordViewStore',
            groupField:'groupBy',
            sorters: [
                {
                    property: 'instanceId',
                    direction: 'DESC'
                }
            ],
            proxy: {
                type: 'ajax',
                url: 'taskInstanceController.do?method=listTaskInstanceRecords',
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
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
                groupHeaderTpl: [
                    '{name:this.formatName}({rows.length}条任务)',
                    {
                        formatName: function(name) {
                            var last=name.lastIndexOf(":");
                            return name.substr(0,last);
                        }
                    }
                ],
                hideGroupedHeader: true,
                startCollapsed: true,
                id: 'restaurantGrouping'
            });
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
                features: [groupingFeature],
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
                        header: '任务名称',
                        dataIndex:'name'
                    },
                    {
                        header: '流程名称',
                        dataIndex: 'processName'
                    },
                    {
                        header: '流程版本',
                        dataIndex: 'processVersion'
                    },
                    {
                        header: '任务开始时间',
                        flex:1,
                        dataIndex: 'startDate'
                    },{
                        header: '任务结束时间',
                        flex:1,
                        dataIndex: 'endDate'
                    },
                    {
                        header: '状态',
                        flex:1,
                        dataIndex: 'status',
                        renderer: function (v) {
                            if(v == 'Starter'){
                                return '发起申请';
                            }else if(v == 'Complete'){
                                return '任务通过';
                            }else if(v == 'ProxyTask'){
                                return '转办';
                            }else if(v == 'ReturnTaskToStarter'){
                                return '<font color = "red">回退到发起人</font>';
                            }else if(v == 'ReturnTask'){
                                return '<font color = "red">回退</font>';
                            }else if(v == 'Replevy'){
                                return '<font color = "red">追回</font>';
                            }else if(v=='End'){
                                return '结束'
                            }
                        }
                    },
                    {
                        header: '备注',
                        flex:1,
                        dataIndex: 'remarks'
                    }
                ]
            }
        ];
        this.callParent();
    }
});