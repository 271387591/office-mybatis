/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/8/13
 * Time: 3:29 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ApplyProcessDetailView',{
    requires:[
        'FlexCenter.activiti.store.HistoryTaskDetail'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.applyProcessDetailView',
    layout:'border',
    autoScroll:true,
    closable:true,
    initComponent:function(){
        var me=this;
        var historyTaskStore=Ext.create('FlexCenter.activiti.store.HistoryTaskDetail',{
            storeId:'applyProcessDetailStore'
        });
        historyTaskStore.load({
            params:{
                processInstanceId:me.processInstanceId
            }
        });
        me.items=[
            {
                title:'流程示意图',
                region:'west',
                margin:'0 0 2 0',
                autoScroll:true,
                width:'48%',
                html:'<div style="padding: 20px 0 0 10px;">'+this.diagramHtml+'</div>'//'<img src="'+__ctxPath+ '/jbpmImage?defId='+this.defId+ '&rand='+Math.random()+'"/>'
            },
            {
                title:'审批信息',
                margin:'0 0 0 2',
                region:'center',
                xtype:'form',
                autoScroll:true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items:[
                    {
                        xtype: 'fieldset',
                        title: '流程执行情况',
                        layout: 'form',
                        collapsible: true,
                        items:[
                            {
                                xtype:'grid',
                                region:'center',
                                store:historyTaskStore,
                                forceFit: true,
                                border:true,
                                autoScroll: true,
                                columns:[
                                    {
                                        header: '序',
                                        xtype:'rownumberer',
                                        width:40
                                    },
                                    {
                                        header: '任务名称',
                                        dataIndex: 'taskName'
                                    },{
                                        header: '执行人',
                                        dataIndex: 'assignee'
                                    },{
                                        header: '任务开始时间',
                                        dataIndex: 'startTime',
                                        renderer: function (v) {
                                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                                        }
                                    },{
                                        header: '任务结束时间',
                                        dataIndex: 'endTime',
                                        renderer: function (v) {
                                            if(v){
                                                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                                            }
                                        }
                                    },
                                    {
                                        header:'耗时(秒)',
                                        dataIndex:'durationIn',
                                        renderer: function (v) {
                                            if(v)
                                                return v/1000;
                                        }
                                    },
                                    {
                                        header: '状态',
                                        dataIndex: 'type',
                                        renderer: function (v) {
                                            if(v == 0){
                                                return '发起申请';
                                            }else if(v == 1){
                                                return '审核通过'
                                            }else if(v == 2){
                                                return '<font color = "red">驳回</font>'
                                            }else if(v == 3){
                                                return '<font color = "red">转办</font>'
                                            }else if(v == 4){
                                                return '追回';
                                            }else if(v == 5){
                                                return '会签任务';
                                            }else{
                                                return '结束'
                                            }
                                        }
                                    },
                                    {
                                        header: '审核意见',
                                        dataIndex: 'objection'
                                    }

                                ]
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
});
