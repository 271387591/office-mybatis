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
    closable:true,
    initComponent:function(){
        var me=this;
        me.dockedItems=[
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                    {
                        xtype: 'buttongroup',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'执行下一步',
                                iconCls:'btn-flow-ok',
                                scope:this,
                                handler:function(){
                                    me.runProcess();
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
                                            var data=me.getDefinitionValue();
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
                                hidden:me.record.taskType=='Starter',
                                scope:this,
                                handler:function(){
                                    me.returnTask(1);
                                }
                            },
                            {
                                xtype:'button',
                                frame:true,
                                text:'回退到发起人',
                                hidden:me.record.taskType=='Starter',
                                iconCls:'btn-turn-back-assignee',
                                scope:this,
                                handler:function(){
                                    me.returnTask(2);
                                }
                            }
                        ]
                    },

                    { xtype: 'tbspacer', width: 50 },
                    {
                        xtype: 'buttongroup',
                        items:[
                            {
                                xtype:'checkboxfield',
                                boxLabel:'邮件通知',
                                name:'mailNotice',
                                itemId:'sendEmail',
                                inputValue:'1'
                            }
                        ]
                    },
                    '->',
                    {
                        xtype: 'buttongroup',
                        items:[
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
                ]
            }
        ];
        me.items=[
            {
                xtype:'processDefinitionHeader',
                record:me.record
            },
            {
                xtype:'taskInstanceView',
                record:me.record,
                height:250
            },
            {

                xtype:'formPreview',
                title:'填写表单',
                formValue:me.record.formValue,
                formHtml:me.record.formHtml
            }
        ];
        this.callParent();
    },
    runProcess:function(){
        var me=this;
        var value=me.getDefinitionValue();
        ajaxPostRequest('processDefInstanceController.do?method=runStartNoneEvent',value,function(result){
            if(result.success){
                Ext.MessageBox.alert({
                    title:'提示',
                    icon: Ext.MessageBox.INFO,
                    msg:'流程启动成功。',
                    buttons:Ext.MessageBox.OK
                });
                me.close();
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
    returnTask:function(type){
        var me=this;
        var data=me.getDefinitionValue();
        data.taskId=me.record.taskId;
        data.taskKey=me.record.taskKey;
        data.instanceId=me.record.actInstanceId;
        data.turnType=type;
        ajaxPostRequest('taskController.do?method=returnTask',data,function(result){
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
    getDefinitionValue:function(){
        var me=this;
        var headerValue= me.down('processDefinitionHeader').getHeaderValue();
        var formData= me.down('formPreview').getFormValue();
        var sendEmail= me.down('#sendEmail').getValue();
        headerValue.formData=Ext.encode(formData,true);
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