/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/23/13
 * Time: 4:02 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProHistoryVersionView',{
    requires:[
        'FlexCenter.activiti.store.ProcessDefinition'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.proHistoryVersionView',
    itemId:'proHistoryVersionView',
    iconCls:'workflow-manager-16',
    layout:'border',
    closable:true,
    role:null,
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ProcessDefinition',{
            storeId:'proHistoryVersionViewStore',
            proxy:{
                type: 'ajax',
                url:'processesController/getProVersionDefinitions',
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total',
                    messageProperty: 'message'
                }
            }
        });
        store.load({
            params:{
                deploymentId:me.record.get('deploymentId')
            }
        });
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel');
        var actioncolumn=[
            {
                iconCls:'delete',
                tooltip:'强制删除',
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                    selects.push(rec);
                    me.deleteClick(selects);
                }
            },'-','-','-','-','-','-','-','-','-','-',
            {
                iconCls:'btn-readdocument',
                tooltip:' 查看',
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                    var depId=rec.get('deploymentId');
                    var title=rec.get('name');
                    Ext.Ajax.request({
                        url:'modelController/aModelPreviewView',
                        params:{modelId:'',depId:depId},
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
            }
        ]
        me.items=[
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                store:store,
                forceFit: true,
                border:true,
                autoScroll: true,
                dockedItems:[
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'刷新',
                                iconCls:'btn-refresh',
                                scope:this,
                                handler:function(){
                                    me.down('grid').getStore().load({
                                        params:{
                                            deploymentId:me.record.get('deploymentId')
                                        }
                                    });
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
                        header: '流程KEY',
                        dataIndex: 'key'
                    },

                    {
                        header: '版本号',
                        dataIndex: 'version'
                    },
                    {
                        header: '状态',
                        dataIndex: 'suspended',
                        renderer: function (v) {
                            if(v=='true'){
                                return "挂起"
                            }else {
                                return '正常'
                            }
                        }
                    },
                    {
                        header: '部署时间',
                        dataIndex: 'deploymentTime',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        xtype:'actioncolumn',
                        header:'管理',
                        items:actioncolumn
                    }
                ]

            }
        ];
        this.callParent();
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

    onDeleteClick:function(){
        var me=this;
        var selects=me.down('grid').getSelectionModel().getSelection();
        me.deleteClick(selects);
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
            msg:'该操作会将与该流程的所有正在执行的任务一并删除，请谨慎操作，确定要删除？',
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'yes'){
                    me.request('processesController/forceDeleteProcessDefinition',{definitionId:ids[0]})
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
