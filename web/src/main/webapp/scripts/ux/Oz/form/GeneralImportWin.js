Ext.define('Oz.form.GeneralImportWin', {
  extend:'Ext.window.Window',
  alias:'widget.generalimportwin',
  requires:[
    'Ext.form.Panel',
    'Oz.util.Utils'
  ],
  config:{
    fileFieldLabel:userRoleRes.selectFileText,
    fileFieldWidth:65,
    importBtnText:globalRes.buttons.importBtn
  },
  initComponent:function () {
    var me = this;
    Ext.apply(this, {
      layout:'fit',
      modal:true,
      width:375,
      autoHeight:true,
      resizable:false,
      shim:false,
      animCollapse:false,
      constrainHeader:true,
      defaults:{
        border:false
      },
      items:{
        xtype:'form',
        baseCls:'x-plain',
        bodyStyle:'padding: 5px;',
        border:false,
        autoHeight:true,
        buttonAlign:'right',
        fieldDefaults:{
          labelWidth:me.fileFieldWidth
        },
        items:[
          {
            xtype:'filefield',
            name:'file',
            anchor:'100%',
            itemId:'form-file',
            fieldLabel:me.fileFieldLabel,
            msgTarget:'side',
            allowBlank:false,
            validator:Oz.Utils.trimValidator
          }
        ],
        buttons:[
          {
            text:me.importBtnText,
            formBind:true,
            handler:function () {
              me.onImportBtnClick();
            }
          },
          {
            text:globalRes.buttons.close,
            handler:function () {
              me.onCancel();
            }
          }
        ]
      }
    });
    this.callParent(arguments);
  },
  getFormPanel:function () {
    return this.down('form');
  },
  onCancel:function () {
    this.close();
  },
  onImportBtnClick:function () {
    var me = this;
    var form = this.getFormPanel().getForm();
    if (form.isValid()) {
      me.importHandler(me, form);
    }
  },
  importHandler:function (win, form) {

  }
});