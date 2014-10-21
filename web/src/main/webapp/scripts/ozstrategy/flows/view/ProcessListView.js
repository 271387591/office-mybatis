/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListView', {
    requires: [
        'FlexCenter.flows.view.ProcessListForm',
        'FlexCenter.flows.store.ProcessDef',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.flows.view.ModelerWindow',
        'FlexCenter.flows.view.ModelerPreviewWindow',
        'FlexCenter.flows.view.ProcessDefAuthorityWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processListView',
    itemId: 'processListView',
    title: '流程列表',
    autoScroll: true,
    layout:'border',
    margin:1,
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
//                margins: '1 0 1 1',
//                margin:1,
                catKey: 'Workflow',
                gridViewItemId:'processListView'
            },
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
//                margin:1,
//                margins: '1 0 1 1',
                itemId:'processListViewGrid',
                store:store,
                autoScroll: true,
                tbar:[
                    {
                        xtype: 'buttongroup',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'新建',
                                iconCls:'table-add',
                                scope:this,
                                handler:me.onAddClick
                            },
                            {
                                xtype: 'button',
                                frame: true,
                                text: '删除',
                                iconCls: 'table-add',
                                scope: this,
                                handler: function(){
                                    me.onUpdateClick();
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'buttongroup',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'授权',
                                iconCls:'btn-shared',
                                scope:me,
                                handler:me.authorization
                            }
                        ]
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
                        dataIndex: 'actDefId',
                        renderer: function (v,m,rec) {
                            if(v){
                                return '<font color="red">已部署</font>'
                            }
                            return '未部署';
                        }
                    },
                    {
                        header: '版本号',
                        flex:1,
                        dataIndex: 'version'
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
                                iconCls:'deploy',
                                tooltip:'部署',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.deployed(rec);
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
    authorization:function(){
        var me=this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.show({
                title: '流程授权',
                width: 300,
                msg: '请选择要授权的流程。',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var win=Ext.widget('processDefAuthorityWindow',{
            animateTarget:me.getEl(),
            rec:record
        });
        win.show();
        me.mon(win, 'authorization', function (win, data) {
            ajaxPostRequest('processDefController.do?method=authorization',data,function(result){
                if(result.success){
                    me.down('grid').getStore().load();
                    me.down('grid').getSelectionModel().deselectAll();
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
    },
    deployed:function(rec){
        var me=this;
        ajaxPostRequest('processDefController.do?method=deploy',{id:rec.get('id')},function(result){
            var msg;
            if(result.success){
                msg='部署成功！';
            }
            me.down('grid').getStore().load();
            me.down('grid').getSelectionModel().deselectAll();
            Ext.MessageBox.alert({
                title:'提示',
                icon: Ext.MessageBox.INFO,
                msg:msg?msg:result.message,
                buttons:Ext.MessageBox.OK
            });
        });
    },
    
    preViewFlow:function(rec){
        var me=this;
        ajaxPostRequest('processDefController.do?method=getRes',{id:rec.get('id')},function(result){
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
        ajaxPostRequest('processDefController.do?method=getRes',{id:rec.get('id')},function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerWindow',{
                    processRecord:rec.data,
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
        });
    },
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='processDefController.do?method='+(save?'save':'update');
        ajaxPostRequest(url,data,function(result){
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
        });
    }
});
