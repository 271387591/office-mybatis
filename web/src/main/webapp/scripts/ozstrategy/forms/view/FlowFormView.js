/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormView',{
    requires:[
        'FlexCenter.forms.store.FlowForm',
        'FlexCenter.forms.view.FlowFormForm',
        'FlexCenter.forms.view.FlowFormDetail'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.flowFormView',
    itemId:'flowFormView',
    layout:'border',
    autoScroll:true,
    getStore: function(){
        var store=Ext.StoreManager.lookup("flowFormViewStore");
        if(!store){
            store=Ext.create("FlexCenter.forms.store.FlowForm",{
                storeId:'flowFormViewStore'
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
                        header: '明细表',
                        flex:1,
                        dataIndex: 'children',
                        renderer: function (v,m,rec) {
                            var names=[];
                            for(var i=0;i< v.length;i++){
                                names.push(v[i].displayName);
                            }
                            if(names.length>0){
                                return names.join(',');
                            }
                            return '无';
                        }
                    },
                    
                    {
                        header: '表单描述',
                        flex:1,
                        dataIndex: 'description'
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
        this.callParent();
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
    onUpdateClick:function(record){
        var me = this;
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
                        url:'flowFormController.do?method=multiRemove',
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
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='flowFormController.do?method='+(save?'save':'update');
        Ext.Ajax.request({
            url:url,
            params:data,
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    me.getStore().load();
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
