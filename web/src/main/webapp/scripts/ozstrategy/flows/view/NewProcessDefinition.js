/**
 * Created by lihao on 9/25/14.
 */
Ext.define('FlexCenter.flows.view.NewProcessDefinition',{
    requires:[
        'FlexCenter.forms.view.FormPreview',
        'FlexCenter.flows.view.ProcessDefinitionHeader',
        'FlexCenter.flows.view.ProcessDefInstanceDraftForm'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.newProcessDefinition',
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
                                text:'存为草稿',
                                iconCls:'save',
                                scope:this,
                                handler:function(){
                                    me.saveDraft();
                                }
                            },
                            {
                                xtype:'button',
                                frame:true,
                                text:'启动流程',
                                iconCls:'btn-flow-ok',
                                scope:this,
                                handler:function(){
                                    me.runProcess();
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
                region:'north',
                xtype:'processDefinitionHeader'
            },
            {

                xtype:'formPreview',
                title:'填写表单',
                formHtml:me.formHtml
            }
        ];
        this.callParent();
    },
    saveDraft:function(){
        var me=this;
        var win=Ext.widget('processDefInstanceDraftForm',{
        });
        me.mon(win, 'addDraft', function (win, data) {
            var value=me.getDefinitionValue();
            value.name=data.name;
            value.description=data.description;
            value.processDefId=me.record.get('id');
            value.processDefName=me.record.get('name');
            value.version=me.record.get('version');
            ajaxPostRequest('processDefInstanceDraftController.do?method=save',value,function(result){
                if(result.success){
                    Ext.MessageBox.alert({
                        title:'提示',
                        icon: Ext.MessageBox.INFO,
                        msg:'保存成功，你可以转到草稿箱查看详细。',
                        buttons:Ext.MessageBox.OK
                    });
                    win.close();
                }else{
                    Ext.MessageBox.alert({
                        title:'警告',
                        icon: Ext.MessageBox.ERROR,
                        msg:result.message,
                        buttons:Ext.MessageBox.OK
                    });
                }
            });
            
        });
        win.show();
        
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
    getDefinitionValue:function(){
        var me=this;
        var headerValue= me.down('processDefinitionHeader').getHeaderValue();
        var formData= me.down('formPreview').getFormValue();
        var sendEmail= me.down('#sendEmail').getValue();
        headerValue.formData=Ext.encode(formData,true);
        headerValue.sendEmail=sendEmail;
        headerValue.processDefId=me.record.get('id');
        return headerValue;
    },
    preview:function(record){
        var me=this;
        ajaxPostRequest('processDefController.do?method=getRes',{id:record.get('id')},function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerPreviewWindow',{
                    graRes:graRes,
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