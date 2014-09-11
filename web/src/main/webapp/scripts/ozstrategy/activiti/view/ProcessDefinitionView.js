/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessDefinitionView',{
    requires:[
        'FlexCenter.activiti.store.ProcessDefinition',
        'FlexCenter.activiti.view.ProcessRunStartView',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.activiti.view.AModelPreviewView'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processDefinitionView',
    itemId:'processDefinitionView',
    title:'流程列表',
    iconCls:'workflow-manager-16',
    layout:'border',
    role:null,
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ProcessDefinition',{
            storeId:'processDefinitionViewStore'
        });
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        store.load();
        var sm = Ext.create('Ext.selection.CheckboxModel');
        var actioncolumn=[
            {
                iconCls:'btn-readdocument',
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
            },'-','-','-','-','-','-','-','-','-','-',
            {
                iconCls:'btn-newFlow',
                tooltip:'新建流程',
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    var data={deploymentId:rec.get('deploymentId'),definitionId:rec.get('id')}
                    var itemId= 'processRunStartView_'+rec.get('id').split(':').join('_');
                    me.request('processesController/getProcessRunFormHtml',data,function(result){
                        var data=result.data;
                        if(data.length>0){
                            var config={
                                formHtml:data[0].content,
                                definitionId:rec.get('id'),
                                itemId:itemId,
                                title:'启动流程-'+rec.get('name'),
                                deploymentId:rec.get('deploymentId'),
                                formDataId:rec.get('formDataId')
                            }
                            Ext.ComponentQuery.query('userCenterPanel')[0].addPanel('processRunStartView',itemId,config);
                        }
                    });
                }
            }

        ]
        me.items=[
            {
                title: '流程分类',
                xtype: 'globalTypeTree',
                region: 'west',
                autoScroll:true,
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                margins: '1 2 1 1',
                catKey: 'Workflow',
                gridViewItemId:'processDefinitionView'
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
                    },
                    {
                        xtype:'toolbar',
                        dock:'top',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'刷新',
                                iconCls:'refresh',
                                scope:this,
                                handler:function(){
                                    me.down('grid').getStore().load();
                                }
                            },
                            '->',
                            {
                                fieldLabel:'流程名称',
                                xtype : 'textfield',
                                labelWidth:60,
                                itemId:'processDefinitionView_search',
                                name : 'name'
                            },
                            {
                                xtype : 'button',
                                text : '查询',
                                iconCls : 'search',
                                handler : function() {
                                    var data = Ext.ComponentQuery.query('#processDefinitionView_search')[0].getValue();
                                    me.down('grid').getStore().load({
                                        params:{
                                            name:data
                                        }
                                    });
                                }
                            },
                            {
                                xtype : 'button',
                                text : '清空',
                                margins:'0 0 0 5',
                                iconCls : 'clear',
                                handler : function() {
                                    Ext.ComponentQuery.query('#processDefinitionView_search')[0].setValue('');
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
                        me.down('grid').getStore().load();
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

})
