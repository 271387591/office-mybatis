/**
 * Created by lihao on 9/15/14.
 */
Ext.define('FlexCenter.forms.view.FormFieldSetter', {
    requires: [
    ],
    extend: 'Ext.Window',
    alias: 'widget.formFieldSetter',
    itemId: 'formFieldSetter',
    title: '字段设置',
    shim: false,
    modal: true,
    layout: 'fit',
    width:600,
    height:400,
    getStore:function(){
        var me=this;
        var store=Ext.StoreManager.lookup("FormFieldSetterStore");
        if(!store){
            store=Ext.create("Ext.data.Store",{
                storeId:'FormFieldSetterStore',
                fields:['name','variable','type','readable','writeable','required','expression'],
                proxy: {
                    type: 'ajax',
                    url: 'processDefController.do?method=listDefFormField',
                    reader: {
                        root : 'data',
                        totalProperty  : 'total',
                        messageProperty: 'message'
                    },
                    writer: {
                        writeAllFields: true,
                        root: 'data'
                    },
                    listeners: {
                        exception: function(proxy, response, operation) {
                            Ext.MessageBox.show({
                                    title: globalRes.remoteException,
                                    msg: operation.getError(),
                                    icon: Ext.MessageBox.ERROR,
                                    buttons: Ext.Msg.OK
                                }
                            );
                        }
                    }
                }
            });
        }
        store.load({
            params:{
                formId:me.formId
            }
        });
        return store;
        
    },
    initComponent:function(){
        var me=this;
        var items=[
            {
                xtype:'grid',
                columns:[
                    {xtype: 'rownumberer'},
                    {
                        header: '字段名称',
                        flex:1,
                        dataIndex: 'variable'
                    },{
                        header: '字段标题',
                        flex:1,
                        dataIndex: 'name'
                    },{
                        header: '数据类型',
                        flex:1,
                        dataIndex: 'type'
                    },{
                        xtype: 'checkcolumn',
                        header: '可读',
                        sortable: true,
                        dataIndex:'readable',
//                        renderer: function (v, m, rec, rowIndex) {
//                            if (v && !rec.get('allowCheck')) {
//                                m.tdCls='x-item-disabled';
//                            }
//                            return (new Ext.grid.column.CheckColumn()).renderer(v);
//                        },
                        flex: 1
                    },{
                        xtype: 'checkcolumn',
                        header: '可写',
                        sortable: true,
                        dataIndex:'writeable',
//                        renderer: function (v, m, rec, rowIndex) {
//                            if (v && !rec.get('allowCheck')) {
//                                m.tdCls='x-item-disabled';
//                            }
//                            return (new Ext.grid.column.CheckColumn()).renderer(v);
//                        },
                        flex: 1
                    },{
                        xtype: 'checkcolumn',
                        header: '隐藏',
                        sortable: true,
                        dataIndex:'required',
//                        renderer: function (v, m, rec, rowIndex) {
//                            if (v && !rec.get('allowCheck')) {
//                                m.tdCls='x-item-disabled';
//                            }
//                            return (new Ext.grid.column.CheckColumn()).renderer(v);
//                        },
                        flex: 1
                    }
                ],
                margin:'0 1 0 0',
                autoScroll: true,
                store:me.getStore()
            }
        ];
        me.items=items;
        
        me.buttons=[
            {
                xtype:'button',
                text: globalRes.buttons.ok,
                handler: function(){
                    me.close();
                }
            },{
                xtype:'button',
                text: globalRes.buttons.close,
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
    }
});
