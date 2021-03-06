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
//    closable:true,
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
                        text:workFlowRes.newProcessDefinition.save,
                        iconCls:'save',
                        scope:this,
                        handler:function(){
                            me.saveDraft();
                        }
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.newProcessDefinition.start,
                        iconCls:'btn-flow-ok',
                        scope:this,
                        handler:function(){
                            me.runProcess();
                        }
                    },

                    { xtype: 'tbspacer', width: 50 },
                    {
                        xtype:'checkboxfield',
                        boxLabel:workFlowRes.newProcessDefinition.mail,
                        name:'mailNotice',
                        itemId:'sendEmail',
                        inputValue:'1'
                    },
                    '->',
                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.readdocument,
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
                drawType:'new',
                xtype:'processDefinitionHeader'
            }
        ];
        if(me.formHtml){
            items.push({

                xtype:'formPreview',
                title:workFlowRes.newProcessDefinition.writeForm,
                formHtml:me.formHtml
            });
        }
        me.items=items;
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
                        title:globalRes.title.prompt,
                        icon: Ext.MessageBox.INFO,
                        msg:workFlowRes.newProcessDefinition.draftSuc,
                        buttons:Ext.MessageBox.OK
                    });
                    win.close();
                }else{
                    Ext.MessageBox.alert({
                        title:globalRes.title.warning,
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
        if(!value.title){
            Ext.MessageBox.alert({
                title:globalRes.title.warning,
                icon: Ext.MessageBox.ERROR,
                msg:workFlowRes.newProcessDefinition.titleNull,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        ajaxPostRequest('processDefInstanceController.do?method=runStartNoneEvent',value,function(result){
            if(result.success){
                Ext.MessageBox.alert({
                    title:globalRes.title.prompt,
                    icon: Ext.MessageBox.INFO,
                    msg:workFlowRes.newProcessDefinition.processRunSuc,
                    buttons:Ext.MessageBox.OK
                });
                me.close();
            }else{
                Ext.MessageBox.alert({
                    title:globalRes.title.warning,
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
        var formPreview=me.down('formPreview');
        if(formPreview){
            var formData= formPreview.getFormValue();
            headerValue.formData=Ext.encode(formData,true);
        }
        var sendEmail= me.down('#sendEmail').getValue();
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
                    title:globalRes.title.warning,
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    }
});