/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 8:07 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ATaskView',{
    requires:[
        'FlexCenter.activiti.store.ATask',
        'FlexCenter.activiti.view.ProcessRuningView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.aTaskView',
    itemId:'aTaskView',
    title:'待办事项',
    iconCls: 'icon-flowWait',
    layout:'border',
    autoScroll:true,
    closable:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ATask',{
            storeId:'aTaskViewStore'
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;

        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel');
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
            }
        ];
        me.items=[
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                store:store,
                forceFit: true,
                border:false,
                autoScroll: true,
                columns:[
                    {
                        header: '任务名称',
                        dataIndex: 'name'
                    },{
                        header: '流程名称',
                        dataIndex: 'processDefinitionName'
                    },{
                        header: '任务创建日期',
                        dataIndex: 'createTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
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
                                    if(!record.get('assignee')){
                                        return 'task_assigned';
                                    }else{
                                        return 'update';
                                    }
                                },
                                getTip:function(v,metadata,record,rowIndex,colIndex,store){
                                    if(!record.get('assignee')){
                                        return '办理';
                                    }
                                    return '签收';
                                },
                                handler:function(grid, rowIndex, colIndex){
                                    var type=this.items[0].type;
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var data={taskId:rec.get('id'),definitionId:rec.get('processDefinitionId'),taskKey:rec.get('taskDefinitionKey')}
                                    if(rec.get('assignee')){
                                        me.request('processesController/getProcessRunFormHtml',data,function(result){
                                            var data=result.data;
                                            if(data.length>0){
                                                var config={
                                                    formHtml:data[0].content,
                                                    processInstanceId:rec.get('processInstanceId'),
                                                    definitionId:rec.get('processDefinitionId'),
                                                    taskId:rec.get('id'),
                                                    title:rec.get('name'),
                                                    taskKey:rec.get('taskDefinitionKey'),
                                                    taskName:rec.get('name'),
                                                    itemId:'processRuningView_'+rec.get('id'),
                                                    executionId:rec.get('executionId'),
                                                    initial:rec.get('initial'),
                                                    signTaskRunNode:rec.get('signTaskRunNode'),
                                                    deploymentId:rec.get('deploymentId'),
                                                    turnBack:rec.get('turnBack'),
                                                    flowFileAttach:rec.get('flowFileAttach')
                                                }
                                                Ext.ComponentQuery.query('#centerPanel')[0].addPanel('processRuningView','processRuningView_'+rec.get('id'),config);
                                            }
                                        });
                                    }else{
                                        me.request('processesController/claim',data,function(result){
                                            if(result.success == true){
                                                me.reloadData();
                                            }else{
                                                var ret=result.success;
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
    },
    request:function(url,data,callback){
        var me=this;
        Ext.Ajax.request({
            url:url,
            params:data,
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    if(!callback){
                        me.down('grid').getStore().reload();
                    } else{
                        callback(result);
                    }
                }else{
                    Ext.MessageBox.alert({
                        title:'警告',
                        icon: Ext.MessageBox.ERROR,
                        msg:result.message,
                        buttons:Ext.MessageBox.OK
                    });
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        })

    }
});
