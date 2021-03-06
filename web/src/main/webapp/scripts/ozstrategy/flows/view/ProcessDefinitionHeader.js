/**
 * Created by lihao on 9/27/14.
 */
Ext.define('FlexCenter.flows.view.ProcessDefinitionHeader',{
    requires:[
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processDefinitionHeader',
    border:false,
    defaults: {anchor: '100%'},
//    layout:{
//        type: 'hbox'
//    },
    bodyPadding:1,
    initComponent:function(){
        var me=this;
        var record=me.record?me.record:{};
        me.items=[
            {
                xtype: 'buttongroup',
                items:[
                    {
                        labelWidth:35,
                        xtype: me.drawType?'textfield':'displayfield',
                        name: 'title',
                        value:record.title,
                        itemId:'title',
                        width:500,
                        fieldLabel:me.drawType?(workFlowRes.processDefinitionHeader.title+'<font color="red">*</font>'):workFlowRes.processDefinitionHeader.title
                    }
                ]
            },
            {
                xtype:'container',
                layout:'hbox',
                items:[
                    {
                        flex:.4,
                        xtype: 'buttongroup',
                        rowspan:3,
                        items:[
                            {
                                labelWidth:30,
                                xtype: 'textareafield',
                                grow: true,
                                height:86,
                                flex:1,
                                name: 'remarks',
                                value:record.remarks,
                                width:400,
                                itemId:'remarks',
                                fieldLabel:workFlowRes.processDefinitionHeader.remarks
                            }
                        ]
                    },
                    {
                        xtype:'container',
                        flex:.6,
                        margin:'0 0 0 2',
                        items:[
                            {
                                xtype: 'buttongroup',
                                items:[
                                    {
                                        xtype:'hidden',
                                        itemId:'fileAttachOne',
                                        value:record.fileAttachOne
                                    },
                                    {
                                        labelWidth:50,
                                        xtype: 'displayfield',
                                        grow: true,
                                        itemId:'fileAttachOneName',
                                        name: 'fileAttachOneName',
                                        value:record.fileAttachOneName,
                                        fieldLabel:workFlowRes.processDefinitionHeader.fileAttachOneName
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'upload-file',
                                        tooltip:workFlowRes.processDefinitionHeader.uploadFile,
                                        text:workFlowRes.processDefinitionHeader.uploadFile,
                                        itemId:'fileAttachOneUploadBtn',
                                        scope:me,
                                        margin:'0 0 0 10',
                                        handler:function(){
                                            me.uploadFile(1,'fileAttachOne','fileAttachOneName','fileAttachOneUploadBtn','fileAttachOneDeleteBtn','fileAttachOneDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'close',
                                        scope:me,
                                        tooltip:globalRes.buttons.remove,
                                        disabled:true,
                                        text:globalRes.buttons.remove,
                                        itemId:'fileAttachOneDeleteBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.deleteFile(1,'fileAttachOne','fileAttachOneName','fileAttachOneUploadBtn','fileAttachOneDeleteBtn','fileAttachOneDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'file-download',
                                        scope:me,
                                        text:workFlowRes.processDefinitionHeader.download,
                                        tooltip:workFlowRes.processDefinitionHeader.download,
                                        disabled:true,
                                        itemId:'fileAttachOneDownloadBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.downloadFile(1,'fileAttachOne');
                                        }
                                    }

                                ]
                            },
                            {
                                xtype: 'buttongroup',
                                margin:'1 0 0 0',
                                items:[
                                    {
                                        xtype:'hidden',
                                        itemId:'fileAttachTwo',
                                        value:record.fileAttachTwo
                                    },
                                    {
                                        labelWidth:50,
                                        xtype: 'displayfield',
                                        grow: true,
                                        name: 'fileAttachTwoName',
                                        value:record.fileAttachTwoName,
                                        itemId:'fileAttachTwoName',
                                        fieldLabel:workFlowRes.processDefinitionHeader.fileAttachTwoName
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'upload-file',
                                        tooltip:workFlowRes.processDefinitionHeader.uploadFile,
                                        text:workFlowRes.processDefinitionHeader.uploadFile,
                                        itemId:'fileAttachTwoUploadBtn',
                                        scope:me,
                                        margin:'0 0 0 10',
                                        handler:function(){
                                            me.uploadFile(2,'fileAttachTwo','fileAttachTwoName','fileAttachTwoUploadBtn','fileAttachTwoDeleteBtn','fileAttachTwoDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'close',
                                        scope:me,
                                        tooltip:globalRes.buttons.remove,
                                        text:globalRes.buttons.remove,
                                        disabled:true,
                                        itemId:'fileAttachTwoDeleteBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.deleteFile(2,'fileAttachTwo','fileAttachTwoName','fileAttachTwoUploadBtn','fileAttachTwoDeleteBtn','fileAttachTwoDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'file-download',
                                        scope:me,
                                        tooltip:workFlowRes.processDefinitionHeader.download,
                                        text:workFlowRes.processDefinitionHeader.download,
                                        disabled:true,
                                        itemId:'fileAttachTwoDownloadBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.downloadFile(2,'fileAttachTwo');
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'buttongroup',
                                margin:'1 0 1 0',
                                items:[
                                    {
                                        xtype:'hidden',
                                        itemId:'fileAttachThree',
                                        value:record.fileAttachThree
                                    },
                                    {
                                        labelWidth:50,
                                        xtype: 'displayfield',
                                        itemId:'fileAttachThreeName',
                                        value:record.fileAttachThreeName,
                                        name: 'fileAttachThreeName',
                                        fieldLabel:workFlowRes.processDefinitionHeader.fileAttachThreeName
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'upload-file',
                                        tooltip:workFlowRes.processDefinitionHeader.uploadFile,
                                        text:workFlowRes.processDefinitionHeader.uploadFile,
                                        itemId:'fileAttachThreeUploadBtn',
                                        scope:me,
                                        margin:'0 0 0 10',
                                        handler:function(){
                                            me.uploadFile(3,'fileAttachThree','fileAttachThreeName','fileAttachThreeUploadBtn','fileAttachThreeDeleteBtn','fileAttachThreeDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'close',
                                        scope:me,
                                        tooltip:globalRes.buttons.remove,
                                        text:globalRes.buttons.remove,
                                        disabled:true,
                                        itemId:'fileAttachThreeDeleteBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.deleteFile(3,'fileAttachThree','fileAttachThreeName','fileAttachThreeUploadBtn','fileAttachThreeDeleteBtn','fileAttachThreeDownloadBtn');
                                        }
                                    },
                                    {
                                        xtype:'button',
                                        frame:true,
                                        iconCls:'file-download',
                                        scope:me,
                                        tooltip:workFlowRes.processDefinitionHeader.download,
                                        text:workFlowRes.processDefinitionHeader.download,
                                        disabled:true,
                                        itemId:'fileAttachThreeDownloadBtn',
                                        margin:'0 0 0 5',
                                        handler:function(){
                                            me.downloadFile(3,'fileAttachThree');
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            
        ];
        me.listeners={
            afterrender:function(f){
                var fileAttachOneValue = me.down('#fileAttachOne').getValue();
                if(fileAttachOneValue){
                    me.down('#fileAttachOneUploadBtn').setDisabled(true);
                    me.down('#fileAttachOneDeleteBtn').setDisabled(false);
                    me.down('#fileAttachOneDownloadBtn').setDisabled(false);
                }
                var fileAttachTwoValue = me.down('#fileAttachTwo').getValue();
                if(fileAttachTwoValue){
                    me.down('#fileAttachTwoUploadBtn').setDisabled(true);
                    me.down('#fileAttachTwoDeleteBtn').setDisabled(false);
                    me.down('#fileAttachTwoDownloadBtn').setDisabled(false);
                }
                var fileAttachThreeValue = me.down('#fileAttachThree').getValue();
                if(fileAttachThreeValue){
                    me.down('#fileAttachThreeUploadBtn').setDisabled(true);
                    me.down('#fileAttachThreeDeleteBtn').setDisabled(false);
                    me.down('#fileAttachThreeDownloadBtn').setDisabled(false);
                }
            }
        };
        this.callParent();
    },
    getHeaderValue:function(){
        var me=this;
        var remarks=me.down('#remarks').getValue();
        var title=me.down('#title').getValue();
        var fileAttachOne=me.down('#fileAttachOne').getValue();
        var fileAttachOneName=me.down('#fileAttachOneName').getValue();
        var fileAttachTwo=me.down('#fileAttachTwo').getValue();
        var fileAttachTwoName=me.down('#fileAttachTwoName').getValue();
        var fileAttachThree=me.down('#fileAttachThree').getValue();
        var fileAttachThreeName=me.down('#fileAttachThreeName').getValue();
        var obj={},fileAttaches=[];
        obj.remarks=remarks;
        obj.title=title;
//        obj.fileAttachOne=fileAttachOne;
//        obj.fileAttachOneName=fileAttachOneName;
//        obj.fileAttachTwo=fileAttachTwo;
//        obj.fileAttachTwoName=fileAttachTwoName;
//        obj.fileAttachThree=fileAttachThree;
//        obj.fileAttachThreeName=fileAttachThreeName;
        if(fileAttachOne){
            fileAttaches.push(fileAttachOne);
        }
        if(fileAttachTwo){
            fileAttaches.push(fileAttachTwo);
        }
        if(fileAttachThree){
            fileAttaches.push(fileAttachThree);
        }
        obj.fileAttaches=fileAttaches.join(',');
        return obj;
    },
    downloadFile:function(index,idItemId){
        var me=this;
        var id=me.down('#'+idItemId).getValue();
        if(id){
            window.open('processFileAttachController.do?method=downloadFile&id='+id);
        }
    },
    deleteFile:function(index,idItemId,nameItemId,upBtnItemId,delBtnItemId,downBtnItemId){
        var me=this;
        var id=me.down('#'+idItemId).getValue();
        ajaxPostRequest('processFileAttachController.do?method=delete',{id:id},function(result){
            if(result.success){
                me.down('#'+idItemId).setValue('');
                me.down('#'+nameItemId).setValue('');
                me.down('#'+upBtnItemId).setDisabled(false);
                me.down('#'+delBtnItemId).setDisabled(true);
                me.down('#'+downBtnItemId).setDisabled(true);
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
    uploadFile:function(index,idItemId,nameItemId,upBtnItemId,delBtnItemId,downBtnItemId){
        var me=this;
        var win=Ext.widget('window',{
            width:400,
            animCollapse : true,
            layout: 'fit',
            modal:true,
            title:workFlowRes.processDefinitionHeader.uploadFileTitle,
            border:false,
            items:[
                {
                    xtype:'form',
                    bodyPadding:5,
                    items:[
                        {
                            xtype:'hidden',
                            value:index,
                            name:'fileIndex'
                        },
                        {
                            xtype: 'filefield',
                            name: 'fileName',
                            fieldLabel: workFlowRes.processDefinitionHeader.fileName,
                            labelWidth: 70,
                            msgTarget: 'side',
                            allowBlank: false,
                            anchor: '100%',
                            buttonText: workFlowRes.processDefinitionHeader.buttonText
                        }
                        
                    ],
                    buttons:[
                        {
                            xtype:'button',
                            formBind: true,
                            scope: me,
                            text:workFlowRes.processDefinitionHeader.uploadFile,
                            handler:function(){
                                var form = win.down('form').getForm();
                                if(form.isValid()){
                                    form.submit({
                                        url: 'processFileAttachController.do?method=upload',
                                        waitMsg: workFlowRes.processDefinitionHeader.waitMsg,
                                        success: function(fp, action) {
                                            var result=action.result;
                                            if(result.success){
                                                var id=result.id;
                                                var name=result.fileName
                                                me.down('#'+idItemId).setValue(id);
                                                me.down('#'+nameItemId).setValue(name);
                                                me.down('#'+upBtnItemId).setDisabled(true);
                                                me.down('#'+delBtnItemId).setDisabled(false);
                                                me.down('#'+downBtnItemId).setDisabled(false);
                                                win.close();
                                            }else{
                                                Ext.MessageBox.alert(globalRes.title.fail, result.msg);
                                            }
                                        },
                                        failure: function(form, action) {
                                            var text=action.response.responseText;
                                            if(text.indexOf('MaxUploadSizeExceededException')!=-1){
                                                Ext.MessageBox.alert(globalRes.title.fail, workFlowRes.processDefinitionHeader.fileLarge);
                                                return;
                                            }
                                            Ext.MessageBox.alert(Ext.String.format(globalRes.title.fail, globalRes.remoteTimeout,action.failureType));
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: globalRes.buttons.close,
                            handler: function () {
                                win.close();
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    }
});