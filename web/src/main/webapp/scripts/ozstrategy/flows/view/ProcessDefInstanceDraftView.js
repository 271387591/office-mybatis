/**
 * Created by lihao on 9/28/14.
 */
Ext.define('FlexCenter.flows.view.ProcessDefInstanceDraftView', {
    requires: [
        'FlexCenter.flows.store.ProcessDefInstanceDraft'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processDefInstanceDraftView',
    itemId: 'processDefInstanceDraftView',
    title: '流程草稿列表',
    autoScroll: true,
    layout:'border',
    margin:1,
    closable:true,
    getStore:function(){
        var store=Ext.StoreManager.lookup("processDefInstanceDraftViewStore");
        if(!store){
            store=Ext.create("FlexCenter.flows.store.ProcessDefInstanceDraft",{
                storeId:'processDefInstanceDraftViewStore'
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
                xtype:'grid',
                region:'center',
                selModel:sm,
                itemId:'processDefInstanceDraftViewGrid',
                store:store,
                autoScroll: true,
                tbar:[
                    {
                        xtype: 'buttongroup',
                        items:[
                            {
                                xtype: 'button',
                                frame: true,
                                text: '删除',
                                iconCls: 'table-delete',
                                scope: this,
                                handler: function(){
                                    me.onDeleteClick();
                                }
                            }
                        ]
                    },
                    '->',
                    {
                        xtype: 'textfield',
                        name: 'keyword',
                        itemId:'processDefInstanceDraftViewSearch'
                    },
                    {
                        xtype:'button',
                        text:'搜索',
                        iconCls:'search',
                        handler:function(){
                            var value = me.down('#processDefInstanceDraftViewSearch').getValue();
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
                            me.down('#processDefInstanceDraftViewSearch').setValue('');
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
                    {
                        header: '草稿名称',
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: '流程名称',
                        flex:1,
                        dataIndex: 'processDefName'
                    },
                    {
                        header: '描述',
                        flex:1,
                        dataIndex: 'description'
                    },
                    {
                        header: '创建时间',
                        flex:1,
                        dataIndex: 'createDate'
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
                        items:[
                            {
                                iconCls:'btn-flow-design',
                                tooltip:'启动流程',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    },
    
    onDeleteClick:function(){
        var me = this;
        var grid = me.down('grid');
        var selection = grid.getSelectionModel().getSelection();
        if(selection.length<1){
            Ext.MessageBox.show({
                title: '删除草稿',
                width: 300,
                msg: '请选择要删除的草稿',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        ajaxPostRequest('processDefController.do?method=getRes',{id:selection[0].get('id')},function(result){
            if(result.success){
                grid.getStore().load();
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