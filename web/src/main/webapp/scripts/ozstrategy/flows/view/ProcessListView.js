/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListView', {
    requires: [
        'FlexCenter.flows.view.ProcessListForm',
        'FlexCenter.flows.store.ProcessDef',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.forms.view.FlowFormSelector'
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
//                selModel:sm,
                itemId:'processListViewGrid',
                store:me.getStore(),
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
//                    {
//                        xtype:'rownumber'
//                    },
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
                        header: '流程分类',
                        flex:1,
                        dataIndex: 'category'
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
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
//            frame: true,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            bodyPadding:5,
            defaultType: 'textfield',
            buttons: [
                {
                    text: '下一步',
                    formBind: true,
                    scope: me,
                    handler: function () {
                        var value=form.getForm().getValues();
                        var moder = Ext.widget('processListForm',{
                            processRecord:value,
                            animateTarget:me.getEl()
                        });
                        moder.show();
                        win.close();
                    }
                },
                {
                    text: '取消',
                    handler: function () {
                        win.close();
                    }
                }
            ],
            items: [
                {
                    xtype:'hidden',
                    name:'id'
                },
                {
                    xtype:'hidden',
                    name:'formIds'
                },
                {
                    fieldLabel: '流程名称<font color="red">*</font>',
                    allowBlank: false,
                    blankText:globalRes.tooltip.notEmpty,
                    name: 'name'
                },{
                    fieldLabel: '引用表单<font color="red">*</font>',
                    name:'formName',
                    allowBlank:false,
                    readOnly:true,
                    blankText:globalRes.tooltip.notEmpty,
                    listeners:{
                        focus:function(){
                            Ext.widget('flowFormSelector',{
                                selectorSingle:true,
                                resultBack:function(ids,names){
                                    form.down('textfield[name=formName]').setValue(names);
                                    form.down('hidden[name=formIds]').setValue(ids);
                                }
                            }).show();
                        }
                    }
                },{
                    xtype:'textareafield',
                    grow: true,
                    fieldLabel:'描述',
                    name:'documentation'
                }]
        });
        var win=Ext.widget('window',{
            layout:'fit',
            modal: true,
            title:'流程信息',
            width:400,
            items:[
                form
            ]
            
        });
        win.show();
        
        
//        this.mon(win, 'addForm', function (win, data) {
//            me.saveOrUpdate(data,true,win);
//
//        });
    }
});
