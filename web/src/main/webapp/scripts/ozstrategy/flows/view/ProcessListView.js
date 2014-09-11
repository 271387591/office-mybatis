/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListView', {
    requires: [
        'FlexCenter.flows.view.ProcessListForm',
        'FlexCenter.flows.store.ProcessDef'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processListView',
    itemId: 'processListView',
    title: '流程列表',
    iconCls: 'workflow-manager-16',
    autoScroll: true,
    layout:'fit',
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
        me.items=[
            {
                xtype:'grid',
                region:'center',
//                selModel:sm,
                store:me.getStore(),
                border:false,
                autoScroll: true,
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'新建流程',
                        iconCls:'user-add',
                        scope:this,
                        handler:me.onAddClick
                    },
//                    {
//                        xtype: 'button',
//                        frame: true,
//                        text: '批量删除',
//                        iconCls: 'delete',
//                        scope: this,
//                        handler: me.onDeleteClick
//                    },
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
                        store: me.getStore(),
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                columns:[
                    {
                        header: '流程名称',
                        flex:1,
                        dataIndex: 'name'
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
                                iconCls:'delete',
                                tooltip:'删除',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    selects.push(rec);
                                    me.deleteClick(selects);
                                }
                            },'-',
                            {
                                iconCls:'btn-flow-design',
                                tooltip:'编辑',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            },'-',
                            {
                                iconCls:'btn-preview',
                                tooltip:'查看表结构',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    Ext.widget('flowFormDetail',{
                                        rec:rec
                                    }).show();
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
    onAddClick:function(){
        var me = this;
        var win = Ext.widget('processListForm',{
            animateTarget:me.getEl()
        });
        win.show();
//        this.mon(win, 'addForm', function (win, data) {
//            me.saveOrUpdate(data,true,win);
//
//        });
    }
});
