/**
 * Created by lihao on 9/2/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListForm',{
    requires:[
        'FlexCenter.flows.view.Modeler',
        'FlexCenter.system.store.GlobalTypes',
        'FlexCenter.forms.view.FlowFormSelector'
    ],
    extend:'Ext.Window',
    alias: 'widget.processListForm',
    layout:'fit',
    modal: true,
    title:'流程信息',
    buttonSave:false,
    width:400,
    getCategoryStore:function(){
        var store=Ext.StoreManager.lookup("processListViewGlobalTypes");
        if(!store){
            store=Ext.create("FlexCenter.system.store.GlobalTypes",{
                storeId:'processListViewGlobalTypes',
                listeners:{
                    beforeload: function (s, e) {
                        e.params = {catKey:'Workflow'}; //ajax 附加参数
                    }
                }
            });
        }
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        me.items=[
            {
                xtype:'form',
                layout: 'anchor',
                border:false,
                itemId:'processListFormForm',
                defaults: {
                    anchor: '100%',
                    labelWidth:60
                },
                bodyPadding:5,
                defaultType: 'textfield',
                listeners:{
                    afterrender:function(form){
                        if(me.processRecord){
                            form.getForm().setValues(me.processRecord);
                        }
                    }
                },
                buttons: [
                    {
                        text: globalRes.buttons.save,
                        formBind: true,
                        scope: me,
                        handler: function () {
                            var value=me.down('#processListFormForm').getForm().getValues();
                            
                            if(!me.buttonSave){
                                me.fireEvent('addFlow',me,value);
                            }else{
                                var data={};
                                for(var i in value){
                                    data[i]=value[i];
                                }
                                if(me.graRes){
                                    data.graRes=me.graRes;
                                }
                                me.fireEvent('updateFlow',data);
                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function () {
                            me.close();
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
                        name:'flowFormId'
                    },
                    {
                        xtype:'hidden',
                        name:'globalTypeId'
                    },
                    {
                        fieldLabel: '流程名称<font color="red">*</font>',
                        allowBlank: false,
                        blankText:globalRes.tooltip.notEmpty,
                        name: 'name'
                    },{
                        fieldLabel: '引用表单',
                        name:'flowFormName',
                        allowBlank:true,
                        readOnly:true,
                        listeners:{
                            focus:function(){
                                if(!me.buttonSave){
                                    Ext.widget('flowFormSelector',{
                                        selectorSingle:true,
                                        resultBack:function(ids,names){
                                            me.down('form').down('textfield[name=flowFormName]').setValue(names);
                                            me.down('form').down('hidden[name=flowFormId]').setValue(ids);
                                        }
                                    }).show();
                                }
                            }
                        }
                    },{
                        fieldLabel:'流程分类',
                        xtype:'combo',
                        name:'category',
                        editable:false,
                        triggerAction:'all',
                        displayField: 'typeName',
                        valueField: 'typeName',
                        store:me.getCategoryStore(),
                        listeners: {
                            select: function (combo, records) {
                                if(records.length>0){
                                    var rec=records[0];
                                    me.down('form').down('hidden[name=globalTypeId]').setValue(rec.get('typeId'));
                                }
                            }
                        }
                    },{
                        xtype:'textareafield',
                        grow: true,
                        fieldLabel:'描述',
                        name:'documentation'
                    }]
            }
        ];
        me.callParent();
    }
});
