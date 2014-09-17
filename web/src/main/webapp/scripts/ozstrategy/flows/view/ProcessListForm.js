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
                        if(me.process){
                            form.getForm().setValues(me.process.properties);
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
                            if(me.process){
                                me.process.properties=value;
                            }
                            if(!me.buttonSave){
                                me.fireEvent('addFlow',me,value);
                            }else{
                                var data={};
                                for(var i in value){
                                    data[i]=value[i];
                                }
                                if(me.process){
                                    data.actRes=Ext.encode(me.process);
                                }
                                if(me.graRes){
                                    data.graRes=me.graRes;
                                }
                                me.process=null;
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
                        fieldLabel:'流程分类<font color="red">*</font>',
                        xtype:'combo',
                        name:'category',
                        editable:false,
                        triggerAction:'all',
                        displayField: 'typeName',
                        valueField: 'typeName',
                        allowBlank: false,
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
                        fieldLabel: '引用表单<font color="red">*</font>',
                        name:'flowFormName',
                        allowBlank:false,
                        readOnly:true,
                        blankText:globalRes.tooltip.notEmpty,
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
