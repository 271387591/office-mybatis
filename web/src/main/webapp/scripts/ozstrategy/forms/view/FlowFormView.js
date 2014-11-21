/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormView',{
    requires:[
        'Ext.grid.*',
        'Ext.data.*',
        'FlexCenter.forms.store.FlowForm',
        'FlexCenter.forms.view.FlowFormForm',
        'FlexCenter.forms.view.FlowFormDetail',
        'FlexCenter.forms.view.FormPreviewWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.flowFormView',
    itemId:'flowFormView',
    layout:'border',
    selector:false,
    autoScroll:true,
    
    getStore: function(){
        var store=Ext.create("FlexCenter.forms.store.FlowForm",{
        });
        if(this.selector){
            store.on('beforeload',function(s,e){
                e.params = {
                    status:'Active'
                };
            });
        }
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel',{
            mode:'SINGLE'
        });
        me.items=[
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                store:store,
                border:false,
                autoScroll: true,
                tbar:[
                    {
                        xtype: 'buttongroup',
                        hidden: me.selector,
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:'添加',
                                iconCls:'table-add',
                                scope:me,
                                hidden: me.selector,
                                handler:me.onAddClick
                            },
                            {
                                xtype: 'button',
                                frame: true,
                                text: '编辑',
                                iconCls: 'table-edit',
                                hidden: me.selector,
                                scope: me,
                                handler: me.updateClick
                            },
                            {
                                xtype: 'button',
                                frame: true,
                                text: '删除',
                                iconCls: 'table-delete',
                                hidden: me.selector,
                                scope: me,
                                handler: me.onDeleteClick
                            }
                        ]
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','description','status','createDate'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
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
                        header: '表单名称',
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: '表单显示名称',
                        flex:1,
                        dataIndex: 'displayName'
                    },
                    
                    {
                        header: '表单描述',
                        flex:1,
                        dataIndex: 'description'
                    },
                    {
                        header: '状态',
                        flex:1,
                        dataIndex: 'status',
                        renderer:function(v){
                            if(v=='Draft'){
                                return '草稿';
                            }else if(v=='Active'){
                                return "已发布";
                            }
                            return v;
                        }
                    },
                    {
                        header: '创建时间',
                        flex:1,
                        dataIndex: 'createDate'
                    },
                    
                    me.selector?{
                        xtype:'actioncolumn',
                        header:'操作',
                        flex:1,
                        items:[
                            {
                                iconCls:'btn-preview',
                                tooltip:'预览',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    var formHtml=rec.get('content');
                                    Ext.widget('formPreviewWindow',{
                                        formHtml:formHtml
                                    }).show();
                                } 
                            }
                        ]
                    }:
                    {
                        xtype:'actioncolumn',
                        header:'管理',
                        flex:1,
                        hidden: me.selector,
                        items:[
                            {
                                iconCls:'btn-preview',
                                tooltip:'预览',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    var formHtml=rec.get('content');
                                    Ext.widget('formPreviewWindow',{
                                        formHtml:formHtml
                                    }).show();
                                }
                            },'-',
                            {
                                tooltip:'发布',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.publishTable(rec);
                                },
                                getClass:function(v,metadata,record){
                                    if(record.get('status')=='Draft'){
                                        return 'icon-publish';
                                    }
                                    return 'x-hide-display';
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
        this.callParent();
    },
    publishTable:function(rec){
        var me=this,ids=[];
        ids.push(rec.get('id'))
        ajaxPostRequest('flowFormController.do?method=publish',{ids:ids.join(',')},function(result){
            if(result.success){
                me.down('grid').getStore().load();
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
        var win = Ext.create('FlexCenter.forms.view.FlowFormForm',{
            title:'添加表单',
            animateTarget:me.getEl()
        });
        win.show();
        win.setActiveRecord(null);
        this.mon(win, 'addForm', function (win, data) {
            me.saveOrUpdate(data,true,win);

        });
    },
    updateClick:function(){
        var me=this;
        me.onUpdateClick();
    },
    onUpdateClick:function(record){
        var me = this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=record?record:(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.alert({
                title:'编辑',
                icon: Ext.MessageBox.ERROR,
                msg:"请选择要编辑的表单",
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        var win = Ext.create('FlexCenter.forms.view.FlowFormForm',{
            title:'编辑表单'
        });
        win.show();
        win.setActiveRecord(record);
        this.mon(win,'updateForm',function(win,data){
            me.saveOrUpdate(data,false,win);
        });

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
                title:'删除表单',
                icon: Ext.MessageBox.ERROR,
                msg:"请选择要删除的表单",
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        var status=selects[0].get('status');
        var msg='确定要删除选中的表单';
        if(status=='Active'){
            msg='该表单已发布，可能被其他流程引用，删除会影响流程的使用，你确定要删除该表单?';
        }
        Ext.Array.each(selects,function(mode){
            ids.push(mode.get("id"));
        });
        Ext.MessageBox.show({
            title:'删除表单',
            buttons:Ext.MessageBox.YESNO,
            msg:msg,
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'yes'){
                    ajaxPostRequest('flowFormController.do?method=multiRemove',{ids:ids},function(result){
                        if(result.success){
                            me.down('grid').getStore().load();
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
            }
        });

    },
    
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='flowFormController.do?method='+(save?'save':'update');
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
