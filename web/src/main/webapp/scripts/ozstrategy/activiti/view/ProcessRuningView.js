/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/27/13
 * Time: 5:13 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessRuningView',{
    requires:[
        'FlexCenter.activiti.store.HistoryTaskDetail',
        'FlexCenter.user.view.UserSelector'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processRuningView',
    layout:'form',
    autoScroll:true,
    title:'启动流程',
    closable:true,
    initComponent:function(){
        var me=this;
        var historyTaskStore=me.getStore();
        var tbarBut=[
            me.getNextTask()
        ];
        var fileAttach,mail;
        var formItems=[];
        if(me.taskKey.indexOf('Sign_')!=-1){
            formItems.push(me.showSignTask());
            formItems.push(me.showHistoryTaskDetail());
            formItems.push(me.showFormDataHtml());
            tbarBut=[];
            tbarBut.push(me.signSubResult(1));//同意
            tbarBut.push(me.signSubResult(2));//反对
            tbarBut.push(me.signSubResult(3));//弃权
            tbarBut.push(me.readTraceResource());
            tbarBut.push(me.printFlowDetail());
            tbarBut.push(me.printFormData());
        }else{
            formItems.push(me.showHistoryTaskDetail());
            formItems.push(me.showFormDataHtml());
        }
        if(me.initial!=0 && me.taskKey.indexOf('Task_')!=-1){
            tbarBut.push(me.turnBackTask(0)) //0表示驳回到发起人
            if(me.turnBack){
                tbarBut.push(me.turnBackTask(1))//1表示逐级驳回
            }
            //2表示任务转办
            tbarBut.push(
                {
                    xtype:'button',
                    frame:true,
                    text:'任务转办',
                    iconCls:'delivered-assignee',
                    scope:this,
                    handler:function(){
                        Ext.widget('userSelector',{
                            resultBack:function(ids,values,usernames){
                                Ext.Ajax.request({
                                    url:'processesController/turnBackTask',
                                    params:{taskId:me.taskId,taskKey:me.taskKey,instanceId:me.processInstanceId,turnType:2,taskAssignee:usernames},
                                    method: 'POST',
                                    success:function(response, options){
                                        var result=Ext.decode(response.responseText);
                                        me.alert(result);
                                        Ext.ComponentQuery.query('#aTaskView')[0].reloadData();
                                        me.close();
                                    }
                                });
                            },
                            type:'SINGLE'
                        }).show();
                    }
                }
            );
//            tbarBut.push(me.fileAttach());
//            tbarBut.push(me.mail());
        }

//        tbarBut.push(me.lookFileAttach());
        tbarBut.push(me.readTraceResource());
        tbarBut.push(me.printFlowDetail());
        tbarBut.push(me.printFormData());
        var form = Ext.create('Ext.form.Panel',{
            frame:false,
            bodyPadding: 3,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            border:false,
            items:formItems
        });
        me.items=form;
        me.tbar=tbarBut;
        me.callParent();
    },
    getStore:function(){
        var me=this;
        var historyTaskStore=Ext.create('FlexCenter.activiti.store.HistoryTaskDetail',{
            storeId:'historyTaskStore'
        });
        historyTaskStore.load({
            params:{
                processInstanceId:me.processInstanceId
            }
        });
        return historyTaskStore;
    },
    fileAttach:function(){
        var me=this;
        return {
            frame: true,
            iconCls: 'upload-file',
            xtype: 'button',
            text: '选择附件',
            scope: this,
            handler: function(){
                Ext.widget('fileAttachSelector',{
                    returnObj:true,
                    resultBack: function(records){
//                        me.fileAttachIds=fileIds;
                        var grid=me.down('#ProcessRunFileAttach');
                        if(!grid){
                            var dataGrid=me.down('#ProcessRuningViewDataGrid');
                            dataGrid.add({
                                    xtype:'panel',
                                    border:false,
                                    items:{
                                        xtype:'fieldset',
                                        title: '附件列表',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        shim:false,
                                        items:me.fileAttachGrid(records)
                                    }
                                });
                        }else{
                            var tempRecords=[];
                            var store=grid.getStore();
                            var checkHas=function(fileId){
                                for(var i=0;i<store.count();i++){
                                    var rec = store.getAt(i);
                                    var hasFiledId=rec.get('fileId');
                                    if(fileId == hasFiledId){
                                        return true;
                                    }
                                }
                                return false;
                            }
                            Ext.Array.each(records, function (record, index, recordsItSelf) {
                                var fileId=record.get('fileId');
                                var ret=checkHas(fileId);
                                if(!ret){
                                    tempRecords.push(record);
                                }
                            });
                            store.add(tempRecords);
                        }
                    }
                }).show();

            }
        }

    },
    mail:function(){
        var me=this;
        return {
            xtype:'checkboxfield',
            boxLabel  : '发送邮件',
            name      : 'topping',
            inputValue: '1',
            itemId    : 'processRuningView_mail_checkbox1'
        }
    },
    lookFileAttach:function(){
        var me=this;
        return {
            frame: true,
            iconCls: 'btn-readdocument',
            xtype: 'button',
            text: '查看附件',
            scope: this,
            handler: function(){
                var win=Ext.widget('window',{
                    width: 600,
                    modal: true,
                    height: 400,
                    layout:'fit',
                    title:'流程附件',
                    buttons:[
                        {
                            xtype:'button',
                            text:'关闭',
                            handler:function(){
                                win.close();
                            }
                        }
                    ],
                    items:me.fileAttachGrid()
                });
                win.show();
            }
        }
    },
    fileAttachGrid:function(data){
        var me=this;
        var store;
        if(data){
            store=Ext.create('Ext.data.Store',{
                fields:['fileId','fileTypeName','fileName','fileTypeName','ext','fileSize'],
                data:data
            });
        }else{
            store = Ext.StoreManager.lookup('flowFileAttachStore');
            if (!store) {
                store = Ext.create('OzSOA.jiuzhai.store.system.FileAttaches', {
                    proxy: {
                        type: 'ajax',
                        url: 'processesController/getFlowFileAttach',
                        reader: {
                            type: 'json',
                            root: 'data',
                            totalProperty: 'total',
                            messageProperty: 'message'
                        }
                    },
                    storeId: 'flowFileAttachStore'
                });
            }
            store.load({
                params:{
                    executionId:me.executionId
                }
            });
        }
        return  {
            xtype: 'grid',
            border: true,
            forceFit: true,
            autoScroll: true,
            store: store,
            itemId:'ProcessRunFileAttach',
            columns: [
                {
                    header: '名称',
                    flex: 2,
                    dataIndex: 'fileName'
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
                    header: '创建人',
                    flex: 1,
                    dataIndex: 'creatorName'
                },
                {
                    header: '管理',
                    flex: 1,
                    xtype: 'actioncolumn',
                    menuDisabled: true,
                    items: [
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

        }
    },
    getNextTask:function(){
        var me=this;
        return {
            xtype:'button',
            frame:true,
            text:'同意并提交数据',
            iconCls:'btn-flow-ok',
            scope:this,
            handler:function(){
                var data = me.down('preview').getGridValue(me.formHtml);
                var mailBtn=Ext.ComponentQuery.query('#processRuningView_mail_checkbox1')[0];
                var mail;
                if(mailBtn){
                    mail=mailBtn.getValue();
                }
                var grid=me.down('#ProcessRunFileAttach');
                if(grid){
                    var ids=[];
                    grid.getStore().each(function(record){
                        ids.push(record.get('fileId'));
                    })
                    fileAttachIds=ids.join(',');
                }
                Ext.Ajax.request({
                    url:'processesController/getNextTask',
                    params:{definitionId:me.definitionId,taskId:me.taskId,taskKey:me.taskKey,processInstanceId:me.processInstanceId,formData:Ext.encode(data),executionId:me.executionId,fileAttach:me.fileAttachIds,mail:mail},
                    method: 'POST',
                    success:function(response, options){
                        var result=Ext.decode(response.responseText);
                        Ext.widget('processRunWindow',{
                            dest:result.destInfo,
                            definitionId:me.definitionId,
                            taskId:me.taskId,
                            taskKey:me.taskKey,
                            taskName:me.taskName,
                            processInstanceId:me.processInstanceId,
                            executionId:me.executionId,
                            callBack:function(){
                                Ext.ComponentQuery.query('#aTaskView')[0].reloadData();
                                me.close();
                            }
                        }).show();
                    }
                });
            }
        }
    },
    printFlowDetail:function(){
        var me=this;
        return {
            xtype:'button',
            frame:true,
            text:'打印流程执行情况',
            iconCls:'btn-print',
            scope:this,
            handler:function(){
                window.open('processesController/printFlowDetail?processInstanceId='+me.processInstanceId+'&definitionId='+me.definitionId,'','');
            }
        }

    },
    printFormData:function(){
        var me=this;
        return {
            xtype:'button',
            frame:true,
            text:'打印表单数据',
            iconCls:'btn-print',
            scope:this,
            handler:function(){
                window.open('processesController/printFormData?definitionId='+me.definitionId+'&instanceId='+me.processInstanceId+'&deploymentId='+me.deploymentId,'','');
            }
        }

    },
    readTraceResource:function(){
        var me=this;
        return {
            xtype:'button',
            frame:true,
            text:'流程示意图',
            iconCls:'btn-flow-chart',
            scope:this,
            handler:function(){
                Ext.widget('diagramWindow',{
                    diagramHtml:'processesController/readTraceResource?executionId='+me.executionId+'&definitionId='+me.definitionId
                }).show();
            }
        }
    },
    turnBackTask:function(type){
        var me=this;
        return {
            xtype:'button',
            frame:true,
            text:type==0?'驳回到发起人':'驳回',
            iconCls:type==0?'btn-turn-back-assignee':'btn-turn-back',
            scope:this,
            handler:function(){
                Ext.Ajax.request({
                    url:'processesController/turnBackTask',
                    params:{taskId:me.taskId,taskKey:me.taskKey,instanceId:me.processInstanceId,turnType:type},
                    method: 'POST',
                    success:function(response, options){
                        var result=Ext.decode(response.responseText);
                        me.alert(result);
                        Ext.ComponentQuery.query('#aTaskView')[0].reloadData();
                        me.close();
                    }
                });
            }
        }
    },
    signSubResult:function(subType){
        var me=this;
        var text=subType==1?'同意':subType==2?'不同意':'弃权';
        var signType=1;
        return {
            xtype:'button',
            frame:true,
            text:text,
            iconCls:subType==1?'btn-flow-ok':subType==2?'btn-turn-back':'btn-gnome-exit',
            scope:this,
            handler:function(){
                Ext.Ajax.request({
                    url:'processesController/signSubResult',
                    params:{taskId:me.taskId,taskKey:me.taskKey,executionId:me.executionId,processInstanceId:me.processInstanceId,signType:me.signTaskRunNode.signType,subType:subType},
                    method: 'POST',
                    success:function(response, options){
                        var result=Ext.decode(response.responseText);
                        me.alert(result);
                        Ext.ComponentQuery.query('#aTaskView')[0].reloadData();
                        me.close();
                    }
                });
            }
        }

    },
    showSignTask:function(){
        var me=this,data=me.signTaskRunNode;
        var b_type=data.signType==1;//1表示百分比,2表示人数比

        return {
            xtype: 'fieldset',
            title: '会签描述',
            layout: 'form',
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: b_type?'会签通过比率':'会签通过人数',
                    value: b_type?data.perTotal*100+'%':data.personTotal
                },{
                    xtype:'container',
                    layout:'hbox',
                    items:[
                        {
                            xtype: 'displayfield',
                            fieldLabel: b_type?'已通过比率':'已通过人数',
                            itemId:'curSignTaskPassTotal',
                            value: b_type?data.curPerTotal!=0?data.curPerTotal*100+'%':0:data.curPersonTotal,
                            margins:'0 5 0 0'
                        },
                        {
                            xtype:'button',
                            text:'刷新',
                            handler:function(){
                                Ext.Ajax.request({
                                    url:'processesController/getSignTaskRunningInfo',
                                    params:{taskKey:me.taskKey,definitionId:me.definitionId,instanceId:me.processInstanceId},
                                    method: 'POST',
                                    success:function(response, options){
                                        var result=Ext.decode(response.responseText);
                                        var curData=b_type?result.data.curPerTotal:result.data.curPersonTotal;
                                        curData=curData!=0?curData*100+'%':0
                                        Ext.ComponentQuery.query('#curSignTaskPassTotal')[0].setValue(curData);
                                    }
                                });

                            }
                        }
                    ]
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '会签参与人员',
                    value: data.users
                }
            ]
        };
    },
    showHistoryTaskDetail:function(){
        var me=this;
        return {
            xtype: 'fieldset',
            title: '流程执行情况',
            layout: 'form',
            collapsible: true,
            items:[
                {
                    xtype:'grid',
                    region:'center',
                    store:me.getStore(),
                    forceFit: true,
                    border:true,
                    autoScroll: true,
                    columns:[
                        {
                            header: '序号',
                            xtype:'rownumberer',
                            width:30
                        },
                        {
                            header: '任务名称',
                            dataIndex: 'taskName'
                        },{
                            header: '执行人',
                            dataIndex: 'assigneeName'
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
                                    return '审核通过';
                                }else if(v == 2){
                                    return '<font color = "red">驳回</font>';
                                }else if(v == 3){
                                    return '<font color = "red">转办</font>';
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
        };
    },
    showFormDataHtml:function(){
        var me=this;
        var items=[
            {
                xtype:'preview',
                formHtml:me.formHtml
            }
        ];
        if(me.flowFileAttach==true){
            items.push({
                xtype:'fieldset',
                title: '附件列表',
                items:me.fileAttachGrid()
            });
        }
        return {
            xtype: 'fieldset',
                title: '数据表格',
            layout: 'form',
            collapsible: true,
            itemId:'ProcessRuningViewDataGrid',
            items:items
        };
    },
    alert:function(result){
        var ret=result.success;
        Ext.MessageBox.show({
            title:ret=='true'?'提示':'警告',
            icon:ret=='true'? Ext.MessageBox.INFO:Ext.MessageBox.ERROR,
            msg:result.message,
            buttons:Ext.MessageBox.OK
        });
    }
});
