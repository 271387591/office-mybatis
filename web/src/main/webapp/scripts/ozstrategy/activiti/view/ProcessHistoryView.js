/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessHistoryView',{
    requires:[
        'FlexCenter.activiti.store.ProcessHistory',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.activiti.view.AModelPreviewView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processHistoryView',
    itemId:'processHistoryView',
    title:'已结束流程',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ProcessHistory',{
            storeId:'processHistoryViewStore'
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel');
        me.items=[
            {
                title: '流程分类',
                xtype: 'globalTypeTree',
                region: 'west',
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                margins: '1 2 1 1',
                catKey: 'Workflow',
                gridViewItemId:'processHistoryView'
            },
            {
                xtype:'grid',
                region:'center',
                margins: '1 1 1 0',
                selModel:sm,
                store:store,
                forceFit: true,
                border:true,
                autoScroll: true,
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    },{
                        xtype: 'toolbar',
                        dock: 'top',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'批量删除',
                                iconCls:'delete',
                                scope:this,
                                handler:me.onDeleteClick
                            },'-',
                            {
                                xtype:'button',
                                frame:true,
                                text:'刷新',
                                iconCls:'refresh',
                                scope:this,
                                handler:function(){
                                    me.down('grid').getStore().load();
                                }
                            },'->',
                            {
                                xtype: 'textfield',
                                name: 'name',
                                labelWidth:60,
                                itemId:'processHistoryViewSearch',
                                fieldLabel: '流程名称'
                            },
                            {
                                xtype:'button',
                                text:'搜索',
                                iconCls:'search',
                                handler:function(){
                                    var value = Ext.ComponentQuery.query('#processHistoryViewSearch')[0].getValue();
                                    var grid=me.down('grid');
                                    grid.getStore().load({
                                        params:{
                                            name:value
                                        }
                                    });
                                }
                            },
                            {
                                xtype:'button',
                                text:'清空',
                                iconCls:'clear',
                                handler:function(){
                                    Ext.ComponentQuery.query('#processHistoryViewSearch')[0].setValue('');
                                }
                            }
                        ]
                    }
                ],
                columns:[
                    {
                        header: '流程名称',
                        dataIndex: 'name'
                    },
                    {
                        header: '发起人',
                        dataIndex: 'startUserId'
                    },
                    {
                        header: '开始时间',
                        dataIndex: 'startTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        header: '结束时间',
                        dataIndex: 'endTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        header: '总耗时',
                        dataIndex: 'durationInMillis'
                    },
                    {
                        xtype:'actioncolumn',
                        dataIndex: 'suspended',
                        header:'管理',
                        items:[
                            {
                                iconCls:'delete',
                                tooltip:'删除',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    selects.push(rec);
                                    me.deleteClick(selects)
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-preview',
                                tooltip:'查看',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var modelId=rec.get('modelId'),depId=rec.get('deploymentId');
                                    var title=rec.get('name');
                                    Ext.Ajax.request({
                                        url:'modelController/aModelPreviewView',
                                        params:{modelId:modelId,depId:depId},
                                        method: 'POST',
                                        scope:me,
                                        success: function (response, options){
                                            var result=Ext.decode(response.responseText);
                                            if(result.success){
                                                var panel = Ext.widget('aModelPreviewView',{
                                                    record:result.data
                                                });
                                                me.showInWin('流程详细信息-'+title,panel);
                                            }
                                        },
                                        failure: function (response, options) {
                                            Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                        }
                                    });
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-print',
                                tooltip:'打印流程执行情况',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    window.open('processesController/printFlowDetail?processInstanceId='+rec.get('id')+'&definitionId='+rec.get('definitionId'),'','');
                                }
                            },'-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-print',
                                tooltip:'打印表单数据',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    window.open('processesController/printFormData?definitionId='+rec.get('definitionId')+'&instanceId='+rec.get('id')+'&deploymentId='+rec.get('deploymentId'),'','');
                                }
                            }
                        ]

                    }
                ]

            }
        ];
        this.callParent();
    },
    onDeleteClick:function(){
        var me=this;
        var selects=me.down('grid').getSelectionModel().getSelection();
        me.deleteClick(selects);
    },
    showInWin:function(title,widget){
        var me=this;
        var win=Ext.widget('window',{
            layout:'fit',
            width:1000,
            height:600,
            autoScroll:true,
            title:title,
            items:widget,
            buttons:[
                {
                    text: '关闭',
                    handler: function(){
                        win.close();
                    }
                }
            ]
        }).show();
    },

    deleteClick:function(selects){
        var me=this,ids=[];
        if(!selects || selects.length<1){
            Ext.MessageBox.alert({
                title:'删除流程',
                icon: Ext.MessageBox.ERROR,
                msg:"请选择要删除的流程",
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        Ext.Array.each(selects,function(mode){
            ids.push(mode.get("id"));
        });
        var idStr=ids.join(",");
        Ext.MessageBox.show({
            title:'删除流程',
            buttons:Ext.MessageBox.YESNO,
            msg:'确定要删除选中的流程?',
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'yes'){
                    me.request('html/processesController/multiDelHistoryProcess',{ids:idStr})
                }
            }
        });
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
                        callback();
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
