/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 8/28/13
 * Time: 5:27 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelForm',{
    extend:'Ext.Window',
    alias: 'widget.aModelForm',
    requires: [
    ],
    resizable: false,
    width: 600,
    title: '新建mxGraph模型',
    border:false,
    modal: true,
    config:{
        activeModel:null
    },
//    getCategoryStore:function(){
//        var store = Ext.StoreManager.lookup("aModelFormGlobalTypeStore");
//        if (!store) {
//            store = Ext.create("FlexCenter.activiti.store.GlobalTypes", {
//                storeId: 'aModelFormGlobalTypeStore',
//                pageSize:999,
//                proxy: {
//                    type: 'ajax',
//                    url: 'html/globalTypeController.do?method=listGlobalTypes',
//                    reader: {
//                        type: 'json',
//                        root: 'data',
//                        totalProperty: 'total',
//                        messageProperty: 'message'
//                    },
//                    extraParams:{
//                        catKey:'Workflow'
//
//                    }
//                }
//            });
//        }
//        return store;
//
//    },
    initComponent: function(){
        var me = this;
        var form = Ext.create('Ext.form.Panel',{
            frame:false,
            bodyPadding: 3,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items:[
                {
                    xtype: 'fieldset',
                    title: '流程详细信息',
                    defaultType: 'textfield',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items:[
                        {
                            name: 'name',
                            fieldLabel: '<font color="red">*</font>流程名称',
                            allowBlank: false
                        },
                        {
                            name: 'category',
                            fieldLabel: '<font color="red">*</font>流程分类',
                            xtype: 'combo',
//                            mode: 'local',
                            maxLength: 256,
                            allowBlank: false,
                            displayField:'typeName',
                            valueField:'typeId',
                            editable: false,
                            triggerAction: 'all',
//                            store: me.getCategoryStore()
                            store: [[]]
                        },
                        {
                            xtype     : 'textareafield',
                            grow      : true,
                            name      : 'source',
                            height:200,
                            fieldLabel: '<font color="red">*</font>mxGraph脚本',
                            anchor    : '100%',
                            allowBlank: false
                        }
                    ]
                }
            ],
            buttons:[{
                text: '发布',
                formBind: true,
                scope:me,
                handler:function(){
                    if(!me.down('form').getForm().isValid()){
                        return;
                    }
                    var data=me.down('form').getValues();
                    this.fireEvent('addModel',this,data);
                }
            },{
                text: '取消',
                handler: function(){
                    me.close();
                }
            }]
        });

        me.items = [form];
        this.addEvents(['addModel']);
        me.callParent(arguments);
    },
    getFormPanel:function(){
        return this.down('form');
    }

});
