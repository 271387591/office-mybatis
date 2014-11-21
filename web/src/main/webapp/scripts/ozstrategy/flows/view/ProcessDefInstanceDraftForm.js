/**
 * Created by lihao on 9/28/14.
 */
Ext.define('FlexCenter.flows.view.ProcessDefInstanceDraftForm',{
    requires:[
    ],
    extend:'Ext.Window',
    alias: 'widget.processDefInstanceDraftForm',
    layout:'fit',
    modal: true,
    title:globalRes.buttons.save,
    buttonSave:false,
    width:400,
    initComponent:function(){
        var me=this;
        me.items=[
            {
                xtype:'form',
                layout: 'anchor',
                border:false,
                defaults: {
                    anchor: '100%',
                    labelWidth:60
                },
                bodyPadding:5,
                defaultType: 'textfield',
                buttons: [
                    {
                        text: globalRes.buttons.save,
                        formBind: true,
                        scope: me,
                        handler: function () {
                            var value=me.down('form').getForm().getValues();
                            me.fireEvent('addDraft',me,value)
                        }
                    },
                    {
                        text: globalRes.buttons.cancel,
                        handler: function () {
                            me.close();
                        }
                    }
                ],
                items: [
                    {
                        fieldLabel: (workFlowRes.modeler.name+'<font color="red">*</font>'),
                        allowBlank: false,
                        blankText:globalRes.tooltip.notEmpty,
                        name: 'name'
                    },{
                        xtype:'textareafield',
                        grow: true,
                        fieldLabel:workFlowRes.modeler.processDocumentation,
                        name:'description'
                    }]
            }
        ];
        me.addEvents(['addDraft']);
        me.callParent();
    }
});