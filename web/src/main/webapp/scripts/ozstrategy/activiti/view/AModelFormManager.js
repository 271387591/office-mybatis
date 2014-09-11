/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-9-22
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelFormManager',{
    requires:[
        'FlexCenter.activiti.view.AModelEditForm'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.aModelFormManager',
    itemId:'aModelFormManager',
    layout:'border',
    autoScroll:true,
    getStore: function(){
        var store=Ext.StoreManager.lookup("amodelFormStore");
        if(!store){
            store=Ext.create("FlexCenter.activiti.store.AModelForm",{
                storeId:'amodelFormStore'
            });
        }
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel');
        me.items=[
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                store:store,
//                forceFit: true,
                border:false,
                autoScroll: true,
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'新建表单',
                        iconCls:'user-add',
                        scope:this,
                        handler:me.onAddClick
                    },
                    {
                        xtype: 'button',
                        frame: true,
                        text: '批量删除',
                        iconCls: 'delete',
                        scope: this,
                        handler: me.onDeleteClick
                    },'->',
                    {
                        xtype: 'textfield',
                        name: 'name',
                        labelWidth:60,
                        itemId:'aModelFormSearch',
                        fieldLabel: '表单名称'
                    },
                    {
                        xtype:'button',
                        text:'搜索',
                        iconCls:'search',
                        handler:function(){
                            var value = Ext.ComponentQuery.query('#aModelFormSearch')[0].getValue();
                            var grid=me.down('grid');
                            grid.getStore().load({
                                params:{
                                    Q_S_name_LK:value
                                }
                            });
                        }
                    },
                    {
                        xtype:'button',
                        text:'清空',
                        iconCls:'clear',
                        handler:function(){
                            Ext.ComponentQuery.query('#aModelFormSearch')[0].setValue('');
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
                        header: '表单名称',
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: '表单描述',
                        flex:1,
                        dataIndex: 'description'
                    },
//                    {
//                        header:'modelId',
//                        dataIndex:'modelId'
////                        renderer: function (v) {
////                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
////                        }
//                    },
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
                            },'-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-flow-design',
                                tooltip:'在线编辑',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            }
//                            '-',
//                            {
//                                iconCls:'btn-preview',
//                                tooltip:'查看',
//                                handler:function(grid, rowIndex, colIndex){
//                                    var rec = grid.getStore().getAt(rowIndex);
//                                    var title=rec.get('name');
//                                    me.addTab('aModelPreviewView','aModelPreviewView','模型详细信息-'+title,rec);
//                                }
//                            }
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
    onAddClick:function(){
        var me = this;
        var win = Ext.create('FlexCenter.activiti.view.AModelEditForm',{
            title:'添加表单'
        });
        win.show();
        win.setActiveRecord(null);
        this.mon(win, 'addForm', function (win, data) {
            temwin = win;
            temwin.close();
            me.saveOrUpdate(data);

        });
    },
    onUpdateClick:function(record){
        var me = this;
        var win = Ext.create('FlexCenter.activiti.view.AModelEditForm',{
            title:'编辑表单'
        });
        win.show();
        win.setActiveRecord(record);
        this.mon(win,'updateForm',function(win,data){
            temwin = win;
            temwin.close();
            me.saveOrUpdate(data);
        });

    },
    onDeleteClick:function(){
        var me=this;
        var selects=me.down('grid').getSelectionModel().getSelection();
        me.deleteClick(selects);
    },

    deleteClick:function(selects){
        var me=this,diaryIds=[];
        if(!selects || selects.length<1){
            Ext.MessageBox.alert({
                title:'删除表单',
                icon: Ext.MessageBox.ERROR,
                msg:"请选择要删除的表单",
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        Ext.Array.each(selects,function(mode){
            diaryIds.push(mode.get("id"));
        });
//        var diaryIdStr=diaryIds.join(",");
        Ext.MessageBox.show({
            title:'删除表单',
            buttons:Ext.MessageBox.YESNO,
            msg:'确定要删除选中的表单?',
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'yes'){
                    Ext.Ajax.request({
                        url:'flowFormDataController/delete',
                        params:{
                            ids:diaryIds
                        },
                        method: 'POST',
                        success: function (response, options){
                            var result=Ext.decode(response.responseText);
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
                        },
                        failure: function (response, options) {
                            Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                        }
                    })
                }
            }
        });

    },
    deploy:function(){

    },
    saveOrUpdate:function(data){
        var me=this;
        Ext.Ajax.request({
            url:'flowFormDataController/saveOrUpdateFlowFormData',
            params:data,
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    me.getStore().load();
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