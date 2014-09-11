/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 7/1/13
 * Time: 1:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.view.GlobalTypeForm', {
  extend: 'Ext.Window',
  alias: 'widget.globalTypeForm',
  requires:[
     'FlexCenter.Constants',
     'FlexCenter.system.store.GlobalTypes'
  ],
  resizable: false,
  width: 400,
  modal: true,
  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      border: false,
      title: this.title,
      items: [
        {
          xtype: 'form',
          frame: true,
          bodyPadding:5,
          items: [
            {
              name: 'typeId',
              itemId:'typeId',
              xtype: 'hidden'
            },
            {
              xtype: 'textfield',
              name: 'typeName',
              labelWidth:80,
              fieldLabel: '<font color="red">*</font>分类名称',
              allowBlank: false,
              width:320
            },
            {
              xtype: 'textfield',
              name: 'typeKey',
              labelWidth:80,
              fieldLabel: '<font color="red">*</font>分类Key',
              allowBlank: false,
              width:320
            },
            {
              xtype: 'combo',
              name: 'catKey',
              itemId:'catKey',
              labelWidth:80,
              fieldLabel: '<font color="red">*</font>标&nbsp;识&nbsp;值',
              allowBlank: false,
              triggerAction:'all',
              editable:false,
              disabled:this.isEdit?this.isEdit:false,
              hidden:this.isEdit?this.isEdit:false,
              hiddenName:'catKey',
              queryMode: 'local',
              displayField: 'text',
              valueField: 'key',
              width: 320,
              store: Ext.create('Ext.data.Store',{
                fields:['key','text'],
                data:FlexCenter.Constants.GLOBAL_TYPE_KEY
              }),
              listeners:{
                change: function (combo, records) {
                  var catKey = '';
                  if (combo.value) {
                    catKey = combo.value;
                  }
                  var parentStore = me.down('#parentId').getStore();


                  parentStore.getProxy().extraParams = {catKey: catKey,parent:true};
                  parentStore.load(function(records, operation, success) {
                     if(records.length<=1){
                       me.down('#parentId').setValue('');
                     }
                    if(!me.parentId){
                      me.down('#parentId').setValue('');
                    }else{
                      me.parentId = null;
                    }
                  });
                },
                'afterrender':function(cmp,options){
                  cmp.setValue(me.catKey?me.catKey:'');
                }
              }
            },
            {
              xtype: 'combo',
              labelWidth:80,
              hiddenName:'parentId',
              itemId:'parentId',
              name:'parentId',
              fieldLabel: '&nbsp;&nbsp;父&nbsp;&nbsp;&nbsp;级',
              triggerAction:'all',
              editable:false,
              disabled:this.isEdit?this.isEdit:false,
              hidden:this.isEdit?this.isEdit:false,
              queryMode: 'local',
              typeAhead:false,
              displayField: 'typeName',
              valueField: 'typeId',
              width: 320,
              value: this.parentId?this.parentId:'',
              store: me.getParentsStore()
            }
          ],
          buttons: [
            {
              text: '保存',
              formBind: true,
              scope: me,
              handler: function () {
                if (!me.down('form').getForm().isValid()) {
                  return;
                }
                var data = me.down('form').getValues();
                var m = this.activeRecord;
                if (!m)
                  this.fireEvent('addType', this, data);
                else {
                  this.fireEvent('updateType', this, data)
                }
              }
            },
            {
              text: '取消',
              handler: function () {
                me.close();
              }
            }
          ]
        }
      ]
    });
    this.addEvents(['addType', 'updateType']);

    me.callParent(arguments);
  },

  getFormPanel: function () {
    var me = this;
    return me.down('form').getForm();
  },
  getParentsStore: function () {
    var store = Ext.StoreManager.lookup("parentsStore");
    if (!store) {
      store = Ext.create("FlexCenter.system.store.GlobalTypes", {
        storeId: 'parentsStore'
      });
    }
    return store;
  },
  setActiveRecord: function (record) {
    var me = this;
    this.activeRecord = record;
    if (record) {
    this.getFormPanel().loadRecord(record);
    } else {
      this.getFormPanel().reset();
    }
  }
});
