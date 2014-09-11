/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/1/13
 * Time: 1:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.FeatureForm',{
    extend:'Ext.Window',
    alias: 'widget.featureForm',
    requires: [
        'FlexCenter.user.store.AllFeatures'
    ],
    resizable: false,
    width: 400,
    title: '添加角色',
    modal: true,
    initComponent: function(){
        var me = this;
        var form = Ext.create('Ext.form.Panel',{
            frame:true,
            bodyPadding: 5,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items:[
                {
                    xtype: 'fieldset',
                    title: '基本信息',
                    defaultType: 'textfield',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items:[{
                        name:'id',
                        hidden:true
                    },{
                        name: 'name',
//                        readOnly:me.isEdit,
                        fieldLabel: '<font color="red">*</font>功能名称',
                        allowBlank: false
                    },{
                        name: 'criteria',
                        fieldLabel: '<font color="red">*</font>分类',
                        allowBlank: false
                    },{
                        name: 'displayName',
                        fieldLabel: '<font color="red">*</font>显示名称',
                        allowBlank: false
                    },{
                        name: 'description',
                        fieldLabel: '&nbsp;&nbsp;描述'
                    }]
                }
            ],
            buttons:[{
                text: '保存',
                formBind: true,
                scope:me,
                handler:function(){
                    if(!me.down('form').getForm().isValid()){
                        return;
                    }
                    var data=me.down('form').getValues();
                    var m=this.activeRecord;
                    if(!m)
                        this.fireEvent('addFeature',this,data);
                    else{
                        this.fireEvent('updateFeature',this,data)
                    }
                }
            },{
                text: '取消',
                handler: function(){
                    me.close();
                }
            }]
        });

        me.items = [form];
        this.addEvents(['addFeature','updateFeature']);

        me.callParent(arguments);
    },
    getFormPanel: function(){
        var me = this;
        return me.down('form').getForm();
    },
    setActiveRecord: function(record){
        this.activeRecord = record;
        if (record) {
            this.getFormPanel().loadRecord(record);
        } else {
            this.getFormPanel().reset();
        }
    }
})
