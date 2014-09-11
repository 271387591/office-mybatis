/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/21/13
 * Time: 3:12 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.FlowFormDataSelector', {
    extend: 'Ext.window.Window',
    alias: 'widget.flowFormDataSelector',
    layout: 'fit',
    width:500,
    height:400,
    title:'表单选择',
    requires: [
        'Ext.selection.CheckboxModel'
    ],
    initComponent: function () {
        var me=this;
        var userSrore=Ext.create('Ext.data.Store',{
            fields:['id','name','modelId','createDate','formFieldSrc'],
            proxy:{
                type: 'ajax',
                url: 'flowFormDataController/getFlowFormDatas',
                reader: {
                    type: 'json',
                    root : 'data',
                    totalProperty  : 'total',
                    messageProperty: 'message'
                }
            },
            autoLoad:true
        });
        var sm=Ext.create('Ext.selection.CheckboxModel',{
            mode:'SINGLE'
        });
        me.items=[
            {
                xtype:'grid',
                selModel:sm,
                forceFit: true,
                border:false,
                autoScroll: true,
                itemId:'formDataSelectorGrid',
                columns:[
                    {
                        header: '表单名称',
                        dataIndex: 'name'
                    },
                    {
                        header: '创建时间',
                        dataIndex: 'createDate',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    }
                ],
                store:userSrore,
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: userSrore,
                        dock: 'bottom',
                        displayInfo: true
                    },
                    {
                        xtype:'toolbar',
                        dock:'top',
                        items:[
                            {
                                xtype: 'textfield',
                                name: 'name',
                                labelWidth:60,
                                itemId:'flowFormDataSelectorSearch',
                                fieldLabel: '表单名称'
                            },
                            {
                                xtype:'button',
                                text:'搜索',
                                iconCls:'search',
                                handler:function(){
                                    var value = Ext.ComponentQuery.query('#flowFormDataSelectorSearch')[0].getValue();
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
                                    Ext.ComponentQuery.query('#flowFormDataSelectorSearch')[0].setValue('');
                                }
                            }
                        ]

                    }
                ]
                
            }
        ];
//        me.items=Ext.create('Ext.grid.Panel',{
////            selModel:Ext.create('Ext.selection.CheckboxModel',{
////                mode:'SINGLE'
////            }),
////            selModel:sm,
//            forceFit: true,
//            border:false,
//            autoScroll: true,
//            itemId:'formDataSelectorGrid',
//            columns:[
//                {
//                    header: '表单名称',
//                    dataIndex: 'name',
//                    flex:1
//                },
//                {
//                    header: '创建时间',
//                    dataIndex: 'createDate',
//                    flex:1,
//                    renderer: function (v) {
//                        return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
//                    }
//                }
//            ],
//            store:userSrore,
//            dockedItems:[
//                {
//                    xtype: 'pagingtoolbar',
//                    store: userSrore,
//                    dock: 'bottom',
//                    displayInfo: true
//                },
//                {
//                    xtype:'toolbar',
//                    dock:'top',
//                    items:[
//                        {
//                            xtype: 'textfield',
//                            name: 'name',
//                            labelWidth:60,
//                            itemId:'flowFormDataSelectorSearch',
//                            fieldLabel: '表单名称'
//                        },
//                        {
//                            xtype:'button',
//                            text:'搜索',
//                            iconCls:'search',
//                            handler:function(){
//                                var value = Ext.ComponentQuery.query('#flowFormDataSelectorSearch')[0].getValue();
//                                var grid=me.down('grid');
//                                grid.getStore().load({
//                                    params:{
//                                        Q_S_name_LK:value
//                                    }
//                                });
//                            }
//                        },
//                        {
//                            xtype:'button',
//                            text:'清空',
//                            iconCls:'clear',
//                            handler:function(){
//                                Ext.ComponentQuery.query('#flowFormDataSelectorSearch')[0].setValue('');
//                            }
//                        }
//                    ]
//
//                }
//            ]
//        });
        me.buttons = [{
            text: '确定',
            handler:function(){
                var select = Ext.ComponentQuery.query('#formDataSelectorGrid')[0].getSelectionModel().getSelection()[0];
                if(select){
                    var data={};
                    data.id= select.get('id');
                    data.name= select.get('name');
                    me.callBack(data);
                    me.close();
                }
            }
        },{
            text: '取消',
            handler: function(){
                me.close();
            }
        }];
        me.callParent();
    }
});
