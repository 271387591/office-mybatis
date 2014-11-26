/**
 * Created by lihao on 10/10/14.
 */
Ext.define('FlexCenter.flows.view.TaskAssigneeView',{
    requires:[
        'FlexCenter.forms.view.FormPreview',
        'FlexCenter.flows.view.ProcessDefinitionHeader',
        'FlexCenter.flows.view.TaskInstanceView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.taskAssigneeView',
    autoScroll:true,
    initComponent:function(){
        var me=this;
        me.dockedItems=[
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        xtype:'button',
                        frame:true,
                        text:me.record.taskType=='Countersign'?'完成会签':'执行下一步',
                        iconCls:'btn-flow-ok',
                        scope:this,
                        handler:function(){
                            if(me.record.taskType=='Countersign'){
                                me.completeTask('Countersign');
                            }else{
                                me.completeTask();
                            }
                        }
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:'任务转办',
                        iconCls:'delivered-assignee',
                        scope:this,
                        handler:function(){
                            Ext.widget('userSelector',{
                                resultBack:function(ids,values,usernames){
                                    var data=me.getTaskValue();
                                    data.taskId=me.record.taskId;
                                    data.username=usernames;
                                    data.instanceId=me.record.instanceId;
                                    ajaxPostRequest('taskController.do?method=proxyTask',data,function(result){
                                        if(result.success){
                                        }else{
                                            Ext.MessageBox.alert({
                                                title:'警告',
                                                icon: Ext.MessageBox.ERROR,
                                                msg:result.message,
                                                buttons:Ext.MessageBox.OK
                                            });
                                        }
                                    });
                                },
                                type:'SINGLE'
                            }).show();
                        }
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:'回退',
                        iconCls:'btn-turn-back',
                        hidden:(me.record.taskType=='Starter' || me.record.taskType=='Countersign' || me.record.fromTaskType=='Countersign'),
                        scope:this,
                        handler:function(){
                            Ext.Msg.confirm('回退','该功能将会回到上一任务节点，你确定要回退？',function(btn){
                                if(btn=='yes'){
                                    
                                    me.returnTask(1);
                                }
                            });
                            
                        }
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:'回退到发起人',
                        hidden:(me.record.taskType=='Starter' || me.record.taskType=='Countersign' || me.record.fromTaskType=='Countersign'),
                        iconCls:'btn-turn-back-assignee',
                        scope:this,
                        handler:function(){
                            Ext.Msg.confirm('回退到发起人','该功能将会回到流程发起人任务节点，你确定要回退？',function(btn){
                                if(btn=='yes'){
                                    me.returnTask();
                                }
                            });
                        }
                    },

                    { xtype: 'tbspacer', width: 50 },
                    {
                        xtype:'checkboxfield',
                        boxLabel:'邮件通知',
                        hidden:(me.record.taskType=='Countersign' || me.record.endTask),
                        name:'mailNotice',
                        itemId:'sendEmail',
                        inputValue:'1'
                    },
                    '->',
                    {
                        xtype:'button',
                        frame:true,
                        text:'查看流程图',
                        iconCls:'btn-readdocument',
                        scope:this,
                        handler:function(){
                            me.preview(me.record);
                        }
                    }
                ]
            }
        ];
        var items=[
            {
                xtype:'processDefinitionHeader',
                record:me.record
            },
            {
                xtype:'taskInstanceView',
                record:me.record
            }
        ];
        if(me.record.formHtml){
            items.push({

                xtype:'formPreview',
                title:'填写表单',
                formValue:me.record.formValue,
                chmods:me.record.chmods,
                formHtml:me.record.formHtml
            });
        }
        me.items=items;
        this.callParent();
    },
    completeTask:function(type){
        var me=this;
        var value=me.getTaskValue();
        value.taskId=me.record.taskId;
        value.instanceId=me.record.instanceId;
        value.processDefId=me.record.processDefId;
        if(type=='Countersign'){
            value.completeType='Countersign';
        }
        ajaxPostRequest('taskController.do?method=completeTask',value,function(result){
            if(result.success){
                Ext.MessageBox.alert({
                    title:'提示',
                    icon: Ext.MessageBox.INFO,
                    msg:'任务完成。',
                    buttons:Ext.MessageBox.OK
                });
                me.flushTask();
            }else{
                Ext.MessageBox.alert({
                    title:'审核失败',
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    },
    returnTask:function(type){
        var me=this;
        var data=me.getTaskValue();
        data.taskId=me.record.taskId;
        data.taskKey=me.record.taskKey;
        data.instanceId=me.record.instanceId;
        if(type==1){
            data.sourceTask=me.record.fromTaskId;
        }
        ajaxPostRequest('taskController.do?method=returnTask',data,function(result){
            if(result.success){
                Ext.MessageBox.alert({
                    title:'提示',
                    icon: Ext.MessageBox.INFO,
                    msg:'回退成功。',
                    buttons:Ext.MessageBox.OK
                });
                me.flushTask();
            }else{
                Ext.MessageBox.alert({
                    title:'警告',
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    },
    flushTask:function(){
        var me=this;
        var taskView=Ext.ComponentQuery.query('#taskView')[0];
        if(taskView){
            taskView.reloadData();
        }
        me.close();
    },
    getTaskValue:function(){
        var me=this;
        var headerValue= me.down('processDefinitionHeader').getHeaderValue();
        var formPreview=me.down('formPreview');
        if(formPreview){
            var formData= formPreview.getFormValue();
            headerValue.formData=Ext.encode(formData,true);
        }
        var sendEmail= me.down('#sendEmail').getValue();
        headerValue.sendEmail=sendEmail;
        headerValue.processDefId=me.record.processDefId;
        return headerValue;
    },
    preview:function(record){
        var me=this;
        ajaxPostRequest('processDefController.do?method=getRes',{id:me.record.processDefId,taskKey:me.record.taskKey},function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerPreviewWindow',{
                    graRes:graRes,
                    taskKey:me.record.taskKey,
                    taskType:me.record.taskType,
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