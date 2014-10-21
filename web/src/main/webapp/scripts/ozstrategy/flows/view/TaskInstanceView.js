/**
 * Created by lihao on 10/10/14.
 */
Ext.define('FlexCenter.flows.view.TaskInstanceView', {
    requires: [
        'FlexCenter.flows.store.TaskInstance'
    ],
    extend: 'Ext.grid.Panel',
    alias: 'widget.taskInstanceView',
    itemId: 'taskInstanceView',
    title: '流程执行情况',
    autoScroll: true,
    margin:1,
    getTaskInstanceStore:function(){
        var me=this;
        var store=Ext.StoreManager.lookup("TaskInstanceViewStore");
        if(!store){
            store=Ext.create("FlexCenter.flows.store.TaskInstance",{
                storeId:'TaskInstanceViewStore'
            });
        }
        store.on('beforeload',function(s,e){
            e.params = {
                instanceId:me.record.instanceId
            };
        });
        store.load();
        return store;
    },
    initComponent: function () {
        var me = this;
        var store=me.getTaskInstanceStore();
        me.store=store;
        me.columns=[
            {
                header: '序号',
                xtype:'rownumberer',
                width:30
            },
            {
                header: '任务名称',
                flex:1,
                dataIndex: 'name'
            },{
                header: '执行人',
                flex:1,
                dataIndex: 'assigneeFullName'
            },{
                header: '任务开始时间',
                flex:1,
                dataIndex: 'startDate'
            },{
                header: '任务结束时间',
                flex:1,
                dataIndex: 'endDate'
            },
            {
                header:'耗时(秒)',
                flex:1,
                dataIndex:'durationIn',
                renderer: function (v) {
                    if(v)
                        return v/1000;
                }
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
        ];
        me.callParent(arguments);
    }
});