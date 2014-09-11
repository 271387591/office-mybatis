/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/26/13
 * Time: 10:17 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessRunStartView',{
    requires:[
        'FlexCenter.activiti.view.ProcessRunWindow',
        'FlexCenter.activiti.view.DiagramWindow',
//        'OzSOA.jiuzhai.view.FileAttachSelector',
        'FlexCenter.activiti.view.Preview'
//        'FlexCenter.activiti.view.OnlineDocForm'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processRunStartView',
    layout:'form',
    autoScroll:true,
    closable:true,
    initComponent:function(){
        var me=this;
        var fileAttach='',mail='';
        me.items=[
            {
                xtype:'preview',
                formHtml:me.formHtml
            }
        ];
        me.tbar=[
            {
                xtype:'button',
                frame:true,
                text:'提交数据',
                iconCls:'btn-flow-ok',
                scope:this,
                handler:function(){
                    var data = me.down('preview').getGridValue(me.formHtml);
                    var mailCheckbox=Ext.ComponentQuery.query('#processRunStartView_mail_checkbox1')[0];
                    if(mailCheckbox){
                        mail=mailCheckbox.getValue();
                    }
                    var grid = me.down('#ProcessRunStartFileAttach');
                    if(grid){
                        var ids=[];
                        grid.getStore().each(function(record){
                            ids.push(record.get('fileId'));
                        })
                        fileAttach=ids.join(',');
                    }
                    Ext.Ajax.request({
                        url:'processesController/getNextTask',
                        params:{definitionId:me.definitionId},
                        method: 'POST',
                        success:function(response, options){
                            var result=Ext.decode(response.responseText);
                            Ext.widget('processRunWindow',{
                                dest:result.destInfo,
                                formData:Ext.encode(data),
                                fileAttach:fileAttach,
                                mail:mail,
                                definitionId:me.definitionId,
                                startViewItemId:me.itemId,
                                formDataId:me.formDataId
                            }).show();
                        }
                    });
                }
            },
//            '-',
//            {
//                frame: true,
//                iconCls: 'upload-file',
//                xtype: 'button',
//                text: '选择附件',
//                scope: this,
//                handler: function(){
//                    Ext.widget('fileAttachSelector',{
//                        returnObj:true,
//                        resultBack: function(records){
//                            var grid = me.down('#ProcessRunStartFileAttach');
//                            if(!grid){
//                                me.add(
//                                    {
//                                        xtype:'panel',
//                                        border:false,
//                                        items:{
//                                            xtype:'fieldset',
//                                            title: '附件列表',
//                                            defaults: {               // defaults are applied to items, not the container
//                                                anchor: '100%'
//                                            },
//                                            shim:false,
//                                            items:me.addFileAttachGrid(records)
//                                        }
//                                    }
//                                );
//                            }else{
//                                grid.getStore().loadRecords(records);
//                            }
//                        }
//                    }).show();
//                }
//            },'-',
//            {
//                xtype:'checkboxfield',
//                boxLabel  : '发送邮件',
//                name      : 'topping',
//                inputValue: '1',
//                itemId    : 'processRunStartView_mail_checkbox1'
//            },
//            '-',
            {
                xtype:'button',
                frame:true,
                text:'流程示意图',
                iconCls:'btn-flow-chart',
                scope:this,
                handler:function(){
                    Ext.widget('diagramWindow',{
                        diagramHtml:'modelController/getDiagram?depId='+this.deploymentId
                    }).show();
                }
            }
        ]
        me.callParent();
    },
    addFileAttachGrid:function(data){
        var store=Ext.create('Ext.data.Store',{
            fields:['fileId','fileTypeName','fileName','fileTypeName','ext','fileSize'],
            data:data
        });
        var grid=Ext.create('Ext.grid.Panel',{
            store:store,
            forceFit: true,
            autoScroll: true,
            border: true,
            itemId:'ProcessRunStartFileAttach',
            columns: [
                {
                    header: '名称',
                    flex: 1,
                    dataIndex: 'fileName'
                },
                {
                    header: '分类',
                    flex: 1,
                    dataIndex: 'fileTypeName'
                },
                {
                    header: '文件类型',
                    flex: 1,
                    dataIndex: 'ext'
                },
                {
                    header: '大小',
                    flex: 1,
                    dataIndex: 'fileSize',
                    renderer: function (v) {
                        if (v) {
                            return v + 'K';
                        } else {
                            return '0K';
                        }
                    }
                },
                {
                    xtype:'actioncolumn',
                    header:'操作',
                    items:[
                        {
                            tooltip: '下载',
                            iconCls: 'download-file-image',
                            handler: function (grid, rowIndex, colIndex, item, e, record, row) {
                                var fileId = record.get('fileId');
                                window.open("html/fileAttachController.do?method=downloadFile" + '&fileId=' + fileId);
                            }
                        },'-',{
                            tooltip: '查看',
                            formBind : true,
                            iconCls: 'btn-readdocument',
                            handler:function(grid, rowIndex, colIndex, item, e, record, row) {
                                var fileId = record.get('fileId');
                                var fileName = record.get('fileName');
                                var ext = record.get('ext');
                                if(ext=='doc' || ext=='docx' || ext=='xls' || ext=='xlsx'){
                                    Ext.widget('onlineDocForm',{
                                        doctype:ext,
                                        readType:'open',
                                        openPath:'html/fileAttachController.do?method=downloadFile&fileId=' + fileId
                                    }).show();
                                }else{
                                    Ext.widget('window', {
                                        title: fileName,
                                        autoWidth: true,
                                        modal: true,
                                        autoHeight: true,
                                        items: {
                                            xtype: 'component',
                                            autoEl: {
                                                tag: 'iframe',
                                                style: 'height: 100%; width: 100%; border: none',
                                                src: 'html/fileAttachController.do?method=downloadFile&fileId=' + fileId+'&online=true'
                                            }
                                        }
                                    }).show();
                                }
                            },
                            isDisabled: function (grid, rowIndex, colIndex, item, record) {
                                var fileExt = record.get('ext');
                                var f = true;
                                if(fileExt=='pdf'||fileExt=='jpg'||fileExt=='png'||fileExt=='gif'||fileExt=='txt' || fileExt=='doc' || fileExt=='docx' || fileExt=='xls' || fileExt=='xlsx') f= false;
                                return  f;
                            }
                        },'-',
                        {
                            icon: 'scripts/shared/icons/fam/delete.gif',
                            tooltip:'删除',
                            handler:function(grid, rowIndex, colIndex){
                                grid.getStore().removeAt(rowIndex);
                            }
                        }
                    ]
                }
            ]
        });
        return grid;
    }
});
