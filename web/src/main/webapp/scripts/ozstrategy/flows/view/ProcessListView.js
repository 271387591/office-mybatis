/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListView', {
    requires: [
        'FlexCenter.flows.view.ProcessListForm',
        'FlexCenter.flows.store.ProcessDef',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.flows.view.ModelerWindow',
        'FlexCenter.flows.view.ModelerPreviewWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processListView',
    itemId: 'processListView',
    title: '流程列表',
    iconCls: 'workflow-manager-16',
    autoScroll: true,
    layout:'border',
    getStore:function(){
        var store=Ext.StoreManager.lookup("processListViewStore");
        if(!store){
            store=Ext.create("FlexCenter.flows.store.ProcessDef",{
                storeId:'processListViewStore'
            });
        }
        store.load();
        return store;
    },
    initComponent: function () {
        var me = this;
        var store=me.getStore(),sm=Ext.create('Ext.selection.CheckboxModel',{
            mode:'SINGLE'
        });
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
                gridViewItemId:'processListView'
            },
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                itemId:'processListViewGrid',
                store:store,
                autoScroll: true,
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'新建流程',
                        iconCls:'add',
                        scope:this,
                        handler:me.onAddClick
                    },
                    {
                        xtype: 'button',
                        frame: true,
                        text: '删除流程',
                        iconCls: 'delete',
                        scope: this,
                        handler: function(){
                            me.onUpdateClick();
                        }
                    },
                    '->',
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId:'aModelFormSearch'
                    },
                    {
                        xtype:'button',
                        text:'搜索',
                        iconCls:'search',
                        handler:function(){
                            var value = me.down('#aModelFormSearch').getValue();
                            var grid=me.down('grid');
                            grid.getStore().load({
                                params:{
                                    keyword:value
                                }
                            });
                        }
                    },
                    {
                        xtype:'button',
                        text:'清空',
                        iconCls:'clear',
                        handler:function(){
                            me.down('#aModelFormSearch').setValue('');
                            me.down('grid').getStore().load();
                        }
                    }
                ],
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                columns:[
//                    {
//                        xtype:'rownumber'
//                    },
                    {
                        header: '流程名称',
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: '流程分类',
                        flex:1,
                        dataIndex: 'category',
                        renderer:function(v){
                            if(!v){
                                return '所有';
                            }
                            return v;
                        }
                    },
                    {
                        header: '流程表单',
                        flex:1,
                        dataIndex: 'flowFormName'
                    },
                    {
                        header: '描述',
                        flex:1,
                        dataIndex: 'documentation'
                    },
                    {
                        header: '创建时间',
                        flex:1,
                        dataIndex: 'createDate'
                    },
                    {
                        header: '是否部署',
                        flex:1,
                        dataIndex: 'depId',
                        renderer: function (v,m,rec) {
                            if(v){
                                return '<font color="red">已部署</font>>'
                            }
                            return '未部署';
                        }
                    },
                    {
                        header: '是否包含子流程',
                        flex:1,
                        dataIndex: 'parentId',
                        renderer: function (v,m,rec) {
                            if(v){
                                return '<font color="red">是</font>>'
                            }
                            return '否';
                        }
                    },
                    {
                        xtype:'actioncolumn',
                        header:'管理',
                        flex:1,
//                        width:'200',
                        items:[
                            {
                                iconCls:'btn-flow-design',
                                tooltip:'设计流程',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            },'-',
                            {
                                iconCls:'btn-preview',
                                tooltip:'查看流程图',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.preViewFlow(rec);
                                }
                            }
                        ]
                    }
                ],
                listeners:{
                    itemdblclick:function(grid, record, item, index, e, eOpts){
                        me.onUpdateClick(record)
                    }

                }
            }
        ];
        me.callParent(arguments);
    },
    preViewFlow:function(rec){
        var me=this;
        Ext.Ajax.request({
            url:'processDefController.do?method=getRes',
            params:{id:rec.get('id')},
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
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
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        });
        
    },
    onAddClick:function(){
        var me = this;
        var win = Ext.widget('processListForm',{
//            animateTarget:me.getEl()
        });
        win.show();
        me.mon(win, 'addFlow', function (win, data) {
            me.saveOrUpdate(data,true,win);
        });
    } ,
    onDeleteClick:function(){
        var me = this;
        var grid = me.down('grid');
        var selection = grid.getSelectionModel().getSelection();
        if(selection.length<1){
            Ext.MessageBox.show({
                title: userRoleRes.editUser,
                width: 300,
                msg: userRoleRes.msg.editUser,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
    },
    onUpdateClick:function(rec){
        var me=this;
        if(!rec){
            Ext.MessageBox.show({
                title: userRoleRes.editUser,
                width: 300,
                msg: userRoleRes.msg.editUser,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        Ext.Ajax.request({
            url:'processDefController.do?method=getRes',
            params:{id:rec.get('id')},
            method: 'POST',
            success: function (response, options){
                
                var result=Ext.decode(response.responseText);
                if(result.success){
                    var data=result.data,actRes,graRes;
                    if(data){
                        actRes=Ext.decode(data.actRes,true);
                        graRes=data.graRes;
                    }
                    var moder = Ext.widget('modelerWindow',{
                        processRecord:actRes.properties,
                        developer:false,
                        graRes:graRes,
                        animateTarget:me.getEl()
                    });
                    var modeler = moder.down('modeler');
                    me.mon(modeler, 'updateFlow', function (data) {
                        me.saveOrUpdate(data,false,moder);
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
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        });
    },
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='processDefController.do?method='+(save?'save':'update');
        Ext.Ajax.request({
            url:url,
            params:data,
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    me.down('grid').getStore().load();
                    win.close();
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
        });
    }
});
